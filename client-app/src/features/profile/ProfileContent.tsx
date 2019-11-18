import React, { useContext } from 'react';
import { Tab } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import ProfileDescription from './ProfileDescription';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileFollowings from './ProfileFollowings';
import ProfileActivities from '../activities/dashbord/ProfileActivities';


export const ProfileContent: React.FC<{
  setActiveTab: (activeIndex: any) => void;
}> = ({ setActiveTab }) => {

  return (
    <Tab
      // panes={panes}
      panes={[
        {
          menuItem: 'About',
          render: () => <ProfileDescription></ProfileDescription>
        },
        {
          menuItem: 'Photos',
          render: () => <ProfilePhotos></ProfilePhotos>
        },
        {
          menuItem: 'Activities',
          render: () => <ProfileActivities></ProfileActivities>
        },
        {
          menuItem: 'Followers',
          render: () => (
            <ProfileFollowings></ProfileFollowings>
          )
        },
        {
          menuItem: 'Following',
          render: () => (
            <ProfileFollowings></ProfileFollowings>
          )
        }
      ]}
      menuPosition='right'
      menu={{ fluid: true, className: 'wrapped', tabular: false }}
      defaultActiveIndex={1}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
    ></Tab>
  );
};

export default observer(ProfileContent);
