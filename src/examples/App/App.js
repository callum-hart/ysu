import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { SideNav, SideNavItems, SideNavLink } from "carbon-components-react";
import "carbon-components/css/carbon-components.min.css";

import "./App.css";
import ProgrammingQuote from "../RemoteData/ProgrammingQuote";
import InternationalSpaceStation from "../Polling/InternationalSpaceStation";
import PrimeNumber from "../RetryRequest/PrimeNumber";
import LaunchCompare from "../Aggregation/LaunchCompare";
import RandomPhoto from "../Race/RandomPhoto";

const urls = {
  remoteData: "/remote-data",
  polling: "/polling",
  retryRequest: "/retry-request",
  aggregation: "/aggregation",
  race: "/race",
};

function App() {
  return (
    <Router>
      <SideNav
        isFixedNav
        expanded
        isChildOfHeader={false}
        aria-label="Side navigation"
      >
        <SideNavItems>
          <SideNavLink element={NavLink} to={urls.remoteData}>
            Remote Data
          </SideNavLink>
          <SideNavLink element={NavLink} to={urls.polling}>
            Polling
          </SideNavLink>
          <SideNavLink element={NavLink} to={urls.retryRequest}>
            Retry Request
          </SideNavLink>
          <SideNavLink element={NavLink} to={urls.aggregation}>
            Aggregation
          </SideNavLink>
          <SideNavLink element={NavLink} to={urls.race}>
            Race
          </SideNavLink>
        </SideNavItems>
      </SideNav>

      <main>
        <Switch>
          <Route path={urls.remoteData}>
            <ProgrammingQuote />
          </Route>
          <Route path={urls.polling}>
            <InternationalSpaceStation />
          </Route>
          <Route path={urls.retryRequest}>
            <PrimeNumber />
          </Route>
          <Route path={urls.aggregation}>
            <LaunchCompare />
          </Route>
          <Route path={urls.race}>
            <RandomPhoto />
          </Route>
          <Route path="/">
            <ProgrammingQuote />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
