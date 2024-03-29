import { useEffect, useContext } from "react";
import * as React from "react";
import { observer } from "mobx-react-lite";
import { Tab, Grid, Header, Card, Image, TabProps } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { format } from "date-fns";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserActivity } from "../../app/models/IActivity";

const panes = [
  { menuItem: "Future Events", pane: { key: "futureEvents" } },
  { menuItem: "Past Events", pane: { key: "pastEvents" } },
  { menuItem: "Hosting", pane: { key: "hosted" } },
];

const ProfileEvents = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadUserActivities, profile, loadingUserActivities, userActivities } =
    rootStore.profileStore!;

  useEffect(() => {
    loadUserActivities(profile!.userName);
  }, [loadUserActivities, profile]);

  const handleTabChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: TabProps
  ) => {
    let predicate: string;
    switch (data.activeIndex) {
      case 1:
        predicate = "past";
        break;
      case 2:
        predicate = "hosting";
        break;
      default:
        predicate = "future";
        break;
    }
    loadUserActivities(predicate);
  };

  return (
    <Tab.Pane loading={loadingUserActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            data-cy="PaneContentHeader"
            floated="left"
            icon="calendar"
            content={"Activities"}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            data-cy="activities-panes"
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4} stackable doubling>
            {userActivities.map((activity: IUserActivity) => (
              <Card
                data-cy="activities-card"
                as={Link}
                to={`/activities/${activity.id}`}
                key={activity.id}
              >
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header textAlign="center">{activity.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(new Date(activity.date), "d.MM")}</div>
                    <div>{format(new Date(activity.date), "HH:mm")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileEvents);
