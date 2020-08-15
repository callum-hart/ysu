import React from "react";
import {
  Button,
  Form,
  InlineNotification,
  InlineLoading,
  Tile,
} from "carbon-components-react";

import { sequence } from "../../lib";
import { deleteAccountSequence } from "./sequence";

export const AccountSettings = (props) => {
  const [
    { status, payload },
    transition,
    { devTools, suspend },
  ] = props.deleteAccount;

  return (
    <Form action="#">
      <h1>Account Settings</h1>

      {(status === "@IDLE" || status === "UNDONE" || status === "FAILED") && (
        <>
          {status === "FAILED" && (
            <InlineNotification
              hideCloseButton={true}
              kind="error"
              title={payload.message}
            />
          )}
          <Tile>
            <p>
              <strong>First name</strong> Callum
            </p>
            <p>
              <strong>Last name</strong> Hart
            </p>
            <p>
              <strong>Username</strong> @chart
            </p>
          </Tile>
          <Button onClick={() => transition("DELETE", { accountId: "123" })}>
            Delete account
          </Button>
        </>
      )}

      {status === "SOFT_DELETING" && (
        <>
          <InlineLoading description="Deleting account" />
          <Button
            onClick={() => {
              suspend(); // suspend scheduled delete
              transition("UNDO");
            }}
          >
            Undo
          </Button>
        </>
      )}

      {status === "DELETING" && (
        <InlineLoading description="Deleting account" />
      )}

      {status === "DELETED" && (
        <InlineNotification
          hideCloseButton={true}
          kind="success"
          title="Account was deleted"
        />
      )}

      {props.showDevTools && <>{devTools}</>}
    </Form>
  );
};

export default sequence({
  deleteAccount: deleteAccountSequence,
})(AccountSettings);
