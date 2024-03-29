import { useEffect, useContext } from "react";
import * as React from "react";
import ProfileHeader from "./ProfileHeader";
import { ProfileContent } from "./ProfileContent";
import { Grid, GridColumn } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface ProfileParams {
  userName: string;
}

const ProfilePage: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { getProfile, profile, loadingProfile } = rootStore.profileStore;
  const { setActiveTab } = rootStore.followersStore;
  const { user } = rootStore.userStore;

  const { userName } = useParams();

  useEffect(() => {
    window && window.scrollTo(0, 0);
    getProfile(userName!);
  }, [getProfile, userName, user]);

  if (loadingProfile) {
    return <LoadingComponent content="Loading Component"></LoadingComponent>;
  }

  return (
    <Grid>
      <GridColumn width={16} floated="left">
        <ProfileHeader profile={profile!}></ProfileHeader>
        <ProfileContent setActiveTab={setActiveTab}></ProfileContent>
      </GridColumn>
    </Grid>
  );
};
export default observer(ProfilePage);
