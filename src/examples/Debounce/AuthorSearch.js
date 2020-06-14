import React from "react";

import { sequence } from "../../lib";
import { booksByAuthorSequence } from "./sequence";

export const AuthorSearch = (props) => {
  const [
    { status, payload },
    getBooksByAuthor,
    { history, suspend },
  ] = props.booksByAuthor;

  return (
    <>
      <h1>Search Books by Author</h1>
      <input
        type="text"
        onChange={(e) => {
          suspend();
          getBooksByAuthor(e.target.value);
        }}
      />

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  booksByAuthor: booksByAuthorSequence,
})(AuthorSearch);
