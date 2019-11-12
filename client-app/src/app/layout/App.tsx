// import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import React, { Fragment, useContext, useEffect } from 'react';
import Nav from '../../features/nav/Nav';
import ActivityDashboard from '../../features/activities/dashbord/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'react-router-dom';
import homepage from '../../features/home/homepage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import LoginForm from '../../features/User/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/modalContainer';
import ProfilePage from '../../features/profile/ProfilePage';


const App = () => {
  const rootStore = useContext(RootStoreContext);
  const { setApploaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => {
        setApploaded();
      });
    } else {
      setApploaded();
    }
  }, [getUser, setApploaded, token]);

  if (!appLoaded) {
    return <LoadingComponent content='Loading app'></LoadingComponent>;
  }
  return (
    <Fragment>
      <ModalContainer></ModalContainer>
      <ToastContainer position='bottom-right'></ToastContainer>
      <Route exact path='/' component={homepage}></Route>
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <Nav />

          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default observer(App);
