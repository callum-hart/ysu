import React, { useEffect } from "react";
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  StructuredListSkeleton,
  Button,
  InlineNotification,
} from "carbon-components-react";

import { sequence } from "../../lib";
import { nextLaunchSequence } from "./sequence";

// compare next spacex launch with next nasa launch
// (only want to render data when both datasets are present)

export const LaunchCompare = (props) => {
  const [{ status, payload }, getNextLaunch, { devTools }] = props.nextLaunch;

  useEffect(() => {
    getNextLaunch();
  }, [getNextLaunch]);

  return (
    <>
      <h1>Next Space Launch</h1>
      {status === "LOADING" && <StructuredListSkeleton rowCount={4} />}
      {status === "READY" && (
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head></StructuredListCell>
              <StructuredListCell head>SpaceX</StructuredListCell>
              <StructuredListCell head>NASA</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell>
                <strong>Launch Date</strong>
              </StructuredListCell>
              <StructuredListCell>
                {payload.spaceX.launchDate}
              </StructuredListCell>
              <StructuredListCell>{payload.nasa.launchDate}</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell>
                <strong>Launch Site</strong>
              </StructuredListCell>
              <StructuredListCell>
                {payload.spaceX.launchSite}
              </StructuredListCell>
              <StructuredListCell>{payload.nasa.launchSite}</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell>
                <strong>Mission Name</strong>
              </StructuredListCell>
              <StructuredListCell>
                {payload.spaceX.missionName}
              </StructuredListCell>
              <StructuredListCell>
                {payload.nasa.missionName}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell>
                <strong>Rocket</strong>
              </StructuredListCell>
              <StructuredListCell>{payload.spaceX.rocket}</StructuredListCell>
              <StructuredListCell>{payload.nasa.rocket}</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      )}
      {status === "FAILED" && (
        <>
          <InlineNotification
            hideCloseButton={true}
            kind="error"
            title={payload.message}
          />
          <Button onClick={getNextLaunch}>Try again</Button>
        </>
      )}

      {props.showDevTools && <>{devTools}</>}
    </>
  );
};

export default sequence({
  nextLaunch: nextLaunchSequence,
})(LaunchCompare);
