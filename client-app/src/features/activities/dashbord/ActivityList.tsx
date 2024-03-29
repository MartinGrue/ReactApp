import { useContext, Fragment } from "react";
import * as React from "react";
import { Item, Label, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import { IActivity } from "../../../app/models/IActivity";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { format, parseISO } from "date-fns";

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;
  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size="large" color="blue" data-cy="groupByDateLabel">
            {format(parseISO(group), "dd.MM.yyyy")}
          </Label>
          <Segment>
            <Item.Group>
              {activities.map((activity: IActivity) => (
                <ActivityListItem key={activity.id} activity={activity} />
              ))}
            </Item.Group>
          </Segment>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
