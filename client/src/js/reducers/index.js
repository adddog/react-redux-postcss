import { combineReducers } from 'redux';
//import { routerReducer as routing } from 'react-router-redux';
import { createResponsiveStateReducer } from 'redux-responsive';
import auth from './auth';
import copy from './copy';
import performance from './performance';
import dashboard from './dashboard';
import componentUI from './componentUI';
import leadData from './leadData';
import routes from './routes';
import schoolProfile from './schoolProfileReducer';

const dashApp = combineReducers({
  auth,
  copy,
  components: componentUI,
  dashboard,
  performance,
  leadData,
  browser: createResponsiveStateReducer(
    {
      mobile: 360,
      phablet: 540,
      tablet: 768,
      tabletH: 1024,
      desktop: 1280,
      desktopM: 1440,
      desktopL: 1680,
      desktopXL: 1920
    },
    {
      extraFields: () => ({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  ),
  schoolProfile,
  routes
});

export default dashApp;
