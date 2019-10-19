import React from 'react';
import { Item, Button, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/IActivity';
import { observer } from 'mobx-react-lite';

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item key={activity.id}>
          <Item.Image size='tiny' circular src='/assets/user.png'></Item.Image>

          <Item.Content>
            <Item.Header as='a'>{activity.title}</Item.Header>
            <Item.Meta>{activity.date}</Item.Meta>
            <Item.Description>Hosted by Bob</Item.Description>
          </Item.Content>
        </Item>
      </Segment>
      <Segment>
        <Icon name='clock' />
        {activity.date}
        <Icon name='clock' />
        {activity.venue},{activity.city}
      </Segment>
      <Segment secondary>Miglieder kommen hier rein</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          floated='right'
          content='View'
          color='blue'
          as={Link}
          to={`/activities/${activity.id}`}
        ></Button>
      </Segment>
    </Segment.Group>
  );
};
export default observer(ActivityListItem);