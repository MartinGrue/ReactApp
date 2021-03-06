import * as React from "react";
import {
  Item,
  Button,
  Segment,
  Icon,
  Label,
  ItemDescription,
  Grid,
  Header,
  Divider,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IActivity } from "../../../app/models/IActivity";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";
import ActivityListAttendee from "./ActivityListAttendee";
import { SimpleMap } from "../../../app/common/maps/SimpleMap";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const host = activity.userActivities.filter((x) => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
        <Header as={Link} to={`/activities/${activity.id}`}>
          {activity.title}
        </Header>
        <Divider></Divider>
        <Grid stackable>
          <Grid.Column width={8} verticalAlign="middle">
            <Grid>
              <Grid.Column width={8} verticalAlign="middle">
                <Item.Group>
                  <Item key={activity.id}>
                    <Item.Image
                      size="big"
                      circular
                      src={host.image || "/assets/user.png"}
                      style={{ marginBottom: 3 }}
                      as={Link}
                      to={`/profiles/${host.userName}`}
                    ></Item.Image>
                  </Item>
                </Item.Group>
              </Grid.Column>
              <Grid.Column width={8}>
                <Item.Group>
                  <Item key={activity.id}>
                    <Item.Content>
                      <Item.Description>
                        <Header>
                          Hosted by{" "}
                          <Link to={`/profiles/${host.userName}`}>
                            {host.displayName}
                          </Link>
                        </Header>
                      </Item.Description>
                      {activity.isHost && (
                        <ItemDescription>
                          <Label
                            tag
                            color="orange"
                            content="you are hosting this activity"
                          ></Label>
                        </ItemDescription>
                      )}
                      {activity.isGoing && !activity.isHost && (
                        <ItemDescription>
                          <Label
                            tag
                            color="green"
                            content="you are going to this activity"
                          ></Label>
                        </ItemDescription>
                      )}
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Grid.Column>
            </Grid>
          </Grid.Column>
          <Grid.Column width={8}>
            <SimpleMap
              lat={activity.latitute}
              lng={activity.longitute}
              opt={{ style: { width: "100%", height: 200 } }}
            ></SimpleMap>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment>
        <Icon name="clock" />
        {format(activity.date!, "HH:mm")}
        <Icon name="marker" />
        {activity.venue},{activity.city}
      </Segment>
      <Segment secondary>
        <ActivityListAttendee
          attendees={activity.userActivities}
        ></ActivityListAttendee>
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          floated="right"
          content="View"
          color="blue"
          as={Link}
          to={`/activities/${activity.id}`}
        ></Button>
      </Segment>
    </Segment.Group>
  );
};
export default observer(ActivityListItem);
