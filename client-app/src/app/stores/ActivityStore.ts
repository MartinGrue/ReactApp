import {
  observable,
  action,
  computed,
  runInAction,
  reaction,
  toJS,
  makeObservable,
} from "mobx";
import {
  IActivity,
  IAttendee,
  IComment,
  ICommentSend,
} from "../models/IActivity";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { FillActivityProps, transformateTimeZone } from "../common/util/util";
import * as signalR from "@microsoft/signalr";

// class ActivityStore {
export default class ActivityStore {
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        window.innerHeight > 1000
          ? this.loadAllActivities()
          : this.loadActivities();
      }
    );
  }
  rootStore: RootStore;

  @observable selectedActivity: IActivity | undefined;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable init = true;
  /*
    get: /activities
   */
  @observable activityRegistry = new Map(); // um die activities als eine observableMap darzustellen
  @observable activityRegistryHasNotChanged: boolean = true;
  @observable activities: IActivity[] = [];
  @observable loadingInitial = false;
  /*
    get: /activities with params
  */
  @observable activityCount = 0;
  @observable page = 0;
  @observable predicate = new Map();
  @observable PagingLimit = 2;
  /*
   SignalR
  */
  @observable.ref
  hubConnection: signalR.HubConnection | null = null;

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(this.PagingLimit));
    params.append("offset", `${this.page ? this.page * this.PagingLimit : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  @computed get totalPages() {
    return Math.ceil(this.activityCount / this.PagingLimit);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  @action setloadinginitial = () => {
    this.loadingInitial = true;
  };

  @action connectToSignalRHub = () => {
    var hubConnectionBuilder = new signalR.HubConnectionBuilder();
    this.hubConnection = hubConnectionBuilder
      .withUrl(process.env.NEXT_PUBLIC_CHAT_URL!, {
        accessTokenFactory: (): string => {
          return this.rootStore.commonStore.token!;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.hubConnection.start();
    this.hubConnection.on("ReceiveComment", (comment: IComment) => {
      runInAction(() => {
        this.selectedActivity!.comments.push(comment);
      });
    });
  };

  @action stopSignalRHub = () => {
    this.hubConnection!.stop();
  };

  @action addComment = async (values: ICommentSend) => {
    values.activityId = this.selectedActivity!.id;
    try {
      await this.hubConnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }
  groupActivitiesByDate(activities: IActivity[]) {
    const sorted = activities.sort(
      (a, b) => b.date!.getTime() - a.date!.getTime()
    );

    return Object.entries(
      sorted.reduce((activities, activity) => {
        const key: string = activity.date!.toISOString();
        key in activities
          ? (activities[key] = [...activities[key], activity])
          : (activities[key] = [activity]);
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(transformateTimeZone(activity));
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.submitting = false;
        toast.success("Activity Updated");
      });
    } catch (error) {
      runInAction(() => {
        toast.error("Problem submitting data");
        console.log(error);
        this.submitting = false;
      });
    }
  };
  @action loadAllActivities = async () => {
    this.loadingInitial = true;
    try {
      const initEnvelope = await agent.Activities.list(this.axiosParams);
      const { activityCount } = initEnvelope;
      runInAction(() => {
        this.PagingLimit = activityCount;
      });

      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      const { activities } = activitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
          FillActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
        this.activityRegistryHasNotChanged = true;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
        this.activityRegistryHasNotChanged = true;
      });
    }
  };
  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      // console.log(activitiesEnvelope);
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
          FillActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
        this.activityRegistryHasNotChanged = true;
        this.activityCount = activityCount;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
        this.activityRegistryHasNotChanged = true;
      });
    }
  };

  @action loadActivity = async (id: string): Promise<IActivity | undefined> => {
    this.loadingInitial = true;
    let activity: IActivity = this.activityRegistry.get(id);

    if (activity) {
      this.selectedActivity = activity;
      this.loadingInitial = false;
      return toJS(activity);
    } else {
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          FillActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
          this.selectedActivity = activity;
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction(() => {
          console.log(error);
          this.loadingInitial = false;
        });
      }
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    if (activity.date === null) {
      activity.date = new Date();
    }
    try {
      await agent.Activities.create(transformateTimeZone(activity));

      const NewAttendee: IAttendee = {
        userName: this.rootStore.userStore.user!.userName,
        displayName: this.rootStore.userStore.user!.displayName,
        isHost: true,
        image: this.rootStore.userStore.user!.image,
      };
      let attendees = [];
      attendees.push(NewAttendee);
      activity.userActivities = attendees;
      activity.comments = [];
      runInAction(() => {
        // this.activities.push(activity);
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.submitting = false;
        toast.success("Activity Created");
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        toast.error("Problem submitting data");
        console.log(error);
      });
    }
  };

  @action deleteActivity = async (
    // event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        // this.selectedActivity = undefined;
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        // this.target = '';
        console.log(error);
      });
    }
  };

  @action selectActivity = (id: string) => {
    // this.selectedActivity = this.activities.find(p => p.id === id);
    this.selectedActivity = this.activityRegistry.get(id);
  };

  @action joinActivity = async () => {
    const NewAttendee: IAttendee = {
      userName: this.rootStore.userStore.user!.userName,
      displayName: this.rootStore.userStore.user!.displayName,
      isHost: false,
      image: this.rootStore.userStore.user!.image,
    };
    this.loading = true;
    try {
      await agent.Activities.join(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.userActivities.push(NewAttendee);
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
        this.selectedActivity!.isGoing = true;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unjoinActivity = async () => {
    this.loading = true;
    try {
      await agent.Activities.unjoin(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.userActivities =
          this.selectedActivity!.userActivities.filter(
            (at) => at.userName !== this.rootStore.userStore.user!.userName
          );
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
        this.selectedActivity!.isGoing = false;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.log(error);
      });
    }
  };

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    this.init = false;
    this.predicate.set(predicate, value);
  };
}

// export default createContext(new ActivityStore());
