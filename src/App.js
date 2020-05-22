import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import ProgrammingQuote from "./examples/RemoteData/ProgrammingQuote";
import InternationalSpaceStation from "./examples/Polling/InternationalSpaceStation";
import PrimeNumber from "./examples/RetryRequest/PrimeNumber";
import LaunchCompare from "./examples/Aggregation/LaunchCompare";
import RandomPhoto from "./examples/Race/RandomPhoto";

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
      <header>
        <nav>
          <ul>
            <li>
              <Link to={urls.remoteData}>Remote Data</Link>
            </li>
            <li>
              <Link to={urls.polling}>Polling</Link>
            </li>
            <li>
              <Link to={urls.retryRequest}>Retry Request</Link>
            </li>
            <li>
              <Link to={urls.aggregation}>Aggregation</Link>
            </li>
            <li>
              <Link to={urls.race}>Race</Link>
            </li>
          </ul>
        </nav>
      </header>

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
