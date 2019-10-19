import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/ActivityStore';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import { IActivity } from '../../../app/models/IActivity';

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;
  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size='large' color='blue'>
            {group}
          </Label>
            <Item.Group>
            {activities.map((activity: IActivity) => (
                <ActivityListItem
                  key={activity.id}
                  activity={activity}
                />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
