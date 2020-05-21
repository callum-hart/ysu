import React, { useEffect } from "react";
import { sequence } from "../../lib";

import { nextLaunchSequence } from "./sequence";

// compare next spacex launch with next nasa launch
// (only want to render data when both datasets are present)

export const LaunchCompare = (props) => {
  const [{ status, payload }, getNextLaunch, { history }] = props.nextLaunch;

  useEffect(() => {
    getNextLaunch();
  }, [getNextLaunch]);

  return (
    <>
      {status === "LOADING" && <p>Loading...</p>}
      {status === "READY" && (
        <table>
          <caption>Next launch:</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">SpaceX</th>
              <th scope="col">NASA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Launch Date</th>
              <td>{payload.spaceX.launchDate}</td>
              <td>{payload.nasa.launchDate}</td>
            </tr>
            <tr>
              <th scope="row">Launch Site</th>
              <td>{payload.spaceX.launchSite}</td>
              <td>{payload.nasa.launchSite}</td>
            </tr>
            <tr>
              <th scope="row">Mission Name</th>
              <td>{payload.spaceX.missionName}</td>
              <td>{payload.nasa.missionName}</td>
            </tr>
            <tr>
              <th scope="row">Rocket</th>
              <td>{payload.spaceX.rocket}</td>
              <td>{payload.nasa.rocket}</td>
            </tr>
          </tbody>
        </table>
      )}
      {status === "FAILED" && <p>{payload.message}</p>}

      {history}
    </>
  );
};

export default sequence({
  nextLaunch: nextLaunchSequence,
})(LaunchCompare);
