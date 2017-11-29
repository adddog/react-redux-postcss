import React from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//import { Router, Route } from 'react-router'

//import InvitedPage from 'containers/InvitedPage';
import AppPageMediator from 'mediators/AppPageMediator';
import LoginPageMediator from 'mediators/LoginPageMediator';
//import SignupPage from 'mediators/SignUpPage';
import DashboardPageMediator from 'mediators/DashboardPageMediator';
import LeadDataPageMediator from 'mediators/LeadDataPageMediator';
import PerformancePageMediator from 'mediators/PerformancePageMediator';
//import SchoolDashboardPageMediator from 'containers/SchoolDashboardPageMediator';

import { Route, Switch, Redirect } from 'react-router';

export const ROUTES = {
  root: {
    slug: '/'
  },
  content: {
    slug: '/silverthrone',
    label: 'Silverthrone'
  },
  leadData: {
    slug: '/rainier',
    label: 'Rainier'
  },
  performance: {
    slug: '/lassen',
    label: 'Lassen'
  }
};

export default function configureRoutes() {
  return (
    <Switch>
      <Route
        exact
        path={`${ROUTES.root.slug}`}
        render={() => <Redirect to={ROUTES.content.slug} />}
      />
      <Route
        path={`${ROUTES.leadData.slug}`}
        component={LeadDataPageMediator}
      />
      <Route
        path={`${ROUTES.content.slug}`}
        component={DashboardPageMediator}
      />
      <Route
        path={`${ROUTES.performance.slug}`}
        component={PerformancePageMediator}
      />
    </Switch>
  );
}

/*
          <Route path="invitation/:token/:username" component={InvitedPage}/>
          <Route path="login" component={LoginPageMediator}/>
          <Route path="signup" component={SignupPage}/>
          <Route path="logout" onEnter={logout}/>
          <Route path="dashboard" component={DashboardPageMediator} />
          <Route path="dashboard/:schoolId" component={SchoolDashboardPageMediator} />
*/
