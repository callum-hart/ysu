import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  Toggle,
  Grid,
  Row,
  Column,
} from "carbon-components-react";
import "carbon-components/css/carbon-components.min.css";

import "./App.css";
import ProgrammingQuote from "../RemoteData/ProgrammingQuote";
import InternationalSpaceStation from "../Polling/InternationalSpaceStation";
import PrimeNumber from "../RetryRequest/PrimeNumber";
import LaunchCompare from "../Aggregation/LaunchCompare";
import RandomPhoto from "../Race/RandomPhoto";
import StockBidder from "../UserJourney/StockBidder";
import AccountSettings from "../Undo/AccountSettings";
import AuthorSearch from "../Debounce/AuthorSearch";

const urls = {
  remoteData: "/remote-data",
  polling: "/polling",
  retryRequest: "/retry-request",
  aggregation: "/aggregation",
  race: "/race",
  userJourney: "/user-journey",
  undo: "/undo",
  debounce: "/debounce"
};

function App() {
  const [showYsuHistory, toggleYsuHistory] = useState(false);

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
          <SideNavLink element={NavLink} to={urls.userJourney}>
            User Journey
          </SideNavLink>
          <SideNavLink element={NavLink} to={urls.undo}>
            Undo
          </SideNavLink>
          <SideNavLink element={NavLink} to={urls.debounce}>
            Debounce
          </SideNavLink>
        </SideNavItems>

        <Toggle
          id="toggle-ysu-history"
          className="toggle-ysu-history"
          labelA="History"
          labelB="History"
          onChange={() => toggleYsuHistory(!showYsuHistory)}
        />
      </SideNav>

      <main>
        <Grid>
          <Row>
            <Column>
              <Switch>
                <Route path={urls.remoteData}>
                  <ProgrammingQuote showYsuHistory={showYsuHistory} />
                </Route>
                <Route path={urls.polling}>
                  <InternationalSpaceStation showYsuHistory={showYsuHistory} />
                </Route>
                <Route path={urls.retryRequest}>
                  <PrimeNumber showYsuHistory={showYsuHistory} />
                </Route>
                <Route path={urls.aggregation}>
                  <LaunchCompare showYsuHistory={showYsuHistory} />
                </Route>
                <Route path={urls.race}>
                  <RandomPhoto showYsuHistory={showYsuHistory} />
                </Route>
                <Route path={urls.userJourney}>
                  <StockBidder showYsuHistory={showYsuHistory} />
                </Route>
                <Route path={urls.undo}>
                  <AccountSettings showYsuHistory={showYsuHistory} />
                </Route>
                <Route path={urls.debounce}>
                  <AuthorSearch showYsuHistory={showYsuHistory} />
                </Route>
                <Route path="/">
                  <ProgrammingQuote showYsuHistory={showYsuHistory} />
                </Route>
              </Switch>
            </Column>
          </Row>
        </Grid>
      </main>
    </Router>
  );
}

export default App;
