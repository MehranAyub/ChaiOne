import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

// Screens
import DashboardScreen from './screens/DashboardScreen';
import ReviewDataScreen from './screens/ReviewDataScreen';
import Login from './screens/Login';
import Reset from './screens/Reset';
import ValidateResponseScreen from './screens/validate-responses';
import OverviewScreen from './screens/overview';
import ComputeScoreScreen from './screens/compute-score';
import ViewScoreScreen from './screens/view-score';
import Navigation from './components/Navigation';
import { ScaleProvider } from './contexts/ScaleContext';
import { FactorProvider } from './contexts/FactorContext';
import { ResponseAnswersProvider } from './contexts/ResponseAnswersContext';

// Style
import './App.css';

function App() {
  const [isUserAuth, setIsUserAuth] = React.useState(true);

  return (
    <Router>
      <div>
        {isUserAuth && <Navigation />}
        <Switch>
          <FactorProvider>
            <ScaleProvider>
              <Route path="/login" exact>
                <Login setIsUserAuth={setIsUserAuth} />
              </Route>
              <Route path="/reset" exact>
                <Reset />
              </Route>
              <Route path="/pending-validations" exact component={ReviewDataScreen} />
              <Route path="/overview/:surveyId/:responseId" exact component={OverviewScreen} />
              <Route path="/compute-score/:companyId/:projectId" exact component={ComputeScoreScreen} />
              <ResponseAnswersProvider>
                <Route path="/validate/:surveyId/:responseId" exact component={ValidateResponseScreen} />
              </ResponseAnswersProvider>
              <Route path="/dashboard" exact component={DashboardScreen} />
              <Route path="/view-score/:companyId/:projectId" exact component={ViewScoreScreen} />
              <Route path="/" exact component={DashboardScreen} />
              {/* <Login setIsUserAuth={setIsUserAuth} /> */}
            </ScaleProvider>
          </FactorProvider>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
