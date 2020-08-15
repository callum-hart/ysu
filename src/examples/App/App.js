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
import CurrencyConverter from "../Composition/CurrencyConverter";

const urls = {
  remoteData: "/remote-data",
  polling: "/polling",
  retryRequest: "/retry-request",
  aggregation: "/aggregation",
  race: "/race",
  userJourney: "/user-journey",
  undo: "/undo",
  debounce: "/debounce",
  composition: "/composition",
};

function App() {
  const [showDevTools, toggleDevTools] = useState(false);

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
          <SideNavLink element={NavLink} to={urls.composition}>
            Composition
          </SideNavLink>
        </SideNavItems>

        <Toggle
          id="toggle-dev-tools"
          className="toggle-dev-tools"
          labelA="DevTools"
          labelB="DevTools"
          onChange={() => toggleDevTools(!showDevTools)}
        />
      </SideNav>

      <main>
        <Grid>
          <Row>
            <Column>
              <Switch>
                <Route path={urls.remoteData}>
                  <ProgrammingQuote showDevTools={showDevTools} />
                </Route>
                <Route path={urls.polling}>
                  <InternationalSpaceStation showDevTools={showDevTools} />
                </Route>
                <Route path={urls.retryRequest}>
                  <PrimeNumber showDevTools={showDevTools} />
                </Route>
                <Route path={urls.aggregation}>
                  <LaunchCompare showDevTools={showDevTools} />
                </Route>
                <Route path={urls.race}>
                  <RandomPhoto showDevTools={showDevTools} />
                </Route>
                <Route path={urls.userJourney}>
                  <StockBidder showDevTools={showDevTools} />
                </Route>
                <Route path={urls.undo}>
                  <AccountSettings showDevTools={showDevTools} />
                </Route>
                <Route path={urls.debounce}>
                  <AuthorSearch showDevTools={showDevTools} />
                </Route>
                <Route path={urls.composition}>
                  <CurrencyConverter showDevTools={showDevTools} />
                </Route>
                <Route path="/">
                  <ProgrammingQuote showDevTools={showDevTools} />
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
