import {
  observable,
  computed,
  action,
  runInAction,
  makeObservable,
} from "mobx";
import { IUser, IUserFormValues, IExternalLoginInfo } from "../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from "../../pages/_app";
import { IProfileFormValues } from "../models/IProfile";
import { toast } from "react-toastify";

export default class UserStore {
  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
  }
  rootStore: RootStore;

  @observable user: IUser | null = null;
  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
        history.push("/activities");
        toast.success("login success");
      });
      this.rootStore.commonStore.logIn(user.token);
      this.rootStore.modalStore.closeModal();
    } catch (error) {
      toast.error("login error");
      throw error;
    }
  };
  @action loginExternal = async (info: IExternalLoginInfo) => {
    try {
      const user = await agent.User.loginExternal(info);
      runInAction(() => {
        this.user = user;
        history.push("/activities");
        this.rootStore.commonStore.setToken(user.token);
        this.rootStore.modalStore.closeModal();
        toast.success("login success");
      });
    } catch (error) {
      toast.success("login error");
      throw error;
    }
  };
  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };
  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {}
  };
  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);
      runInAction(() => {
        this.user = user;
        history.push("/activities");
        this.rootStore.commonStore.setToken(user.token);
        this.rootStore.modalStore.closeModal();
        toast.success("register success");
      });
    } catch (error) {
      toast.error("register error");
      throw error;
    }
  };

  @action updateUser = async (values: IProfileFormValues) => {
    try {
      const user = await agent.User.update(values);
      runInAction(() => {
        this.user = user;
        this.rootStore.activityStore.activityRegistryHasNotChanged = false;
        this.rootStore.commonStore.setToken(user.token);
        toast.success("update success");
      });
    } catch (error) {
      console.log(error);
      toast.error("update error");
      throw error;
    }
  };
}
