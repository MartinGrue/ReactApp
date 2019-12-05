import React, { useContext, useEffect } from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSideBar from './ActivityDetailedSideBar';
import NotFound from '../../../app/layout/NotFound';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { SimpleMap } from '../../../app/common/maps/SimpleMap';

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match
}) => {
  
  const rootStore = useContext(RootStoreContext);
  const { selectedActivity, loadActivity, loadingInitial } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
    window.scrollTo(0, 0);
  }, [match.params.id, loadActivity]);

  // return <p>Details {match.params.id}</p>


  if (loadingInitial || !selectedActivity) {
    return <LoadingComponent content='Fetching Activity...'></LoadingComponent>;
  }
  if (!selectedActivity) {
    return <NotFound></NotFound>;
  }
  return (
    <Grid>
      <GridColumn mobile={16} tablet={14} computer={8} floated='left'>
        <ActivityDetailedHeader
          activity={selectedActivity}
        ></ActivityDetailedHeader>
        <SimpleMap 
        lat={selectedActivity.latitute}
        lng={selectedActivity.longitute}
        opt={{ style: { width: '100%', height: 300 } }}></SimpleMap>
        <ActivityDetailedInfo
          activity={selectedActivity}
        ></ActivityDetailedInfo>
        <ActivityDetailedChat></ActivityDetailedChat>
      </GridColumn>
      <GridColumn  mobile={16} tablet={14} computer={8} floated='left'>
        <ActivityDetailedSideBar attendees={selectedActivity.userActivities}></ActivityDetailedSideBar>
      </GridColumn>
    </Grid>
    // <Card fluid>
    //   <Image
    //     src={`/assets/categoryImages/${selectedActivity!.category}.jpg`}
    //     wrapped
    //     ui={false}
    //   />
    //   <Card.Content>
    //     <Card.Header>{selectedActivity!.title}</Card.Header>
    //     <Card.Meta>
    //       <span className='date'>{selectedActivity!.date}</span>
    //     </Card.Meta>
    //     <Card.Description>{selectedActivity!.description}</Card.Description>
    //   </Card.Content>
    //   <Card.Content extra>
    //     <Button.Group widths={2}>
    //       <Button
    //         basic
    //         color='blue'
    //         content='Edit'
    //         as={Link} to={`/manage/${selectedActivity.id}`}
    //       ></Button>
    //       <Button
    //         basic
    //         color='grey'
    //         content='Cancel'
    //         as={Link} to='/activities'
    //       ></Button>
    //     </Button.Group>
    //   </Card.Content>
    // </Card>
  );
};

export default observer(ActivityDetails);
