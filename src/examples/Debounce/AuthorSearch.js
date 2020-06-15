import React from "react";
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  StructuredListSkeleton,
  Form,
  FormGroup,
  TextInput,
  InlineLoading,
  InlineNotification,
} from "carbon-components-react";

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
      <Form action="#" autoComplete="off">
        <FormGroup>
          <TextInput
            id="author"
            labelText="Authors name"
            placeholder="e.g. Tolkien"
            onChange={(e) => {
              suspend();
              getBooksByAuthor(e.target.value);
            }}
          />
        </FormGroup>
      </Form>

      {status === "SEARCHING" && (
        <InlineLoading description="Searching author" />
      )}

      {status === "FETCHING" && (
        <>
          <InlineLoading description="Fetching books" />
          <StructuredListSkeleton rowCount={1} />
        </>
      )}

      {status === "BOOKS_FOUND" && (
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow>
              <StructuredListCell head>Title</StructuredListCell>
              <StructuredListCell head>Published</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {payload.books.map((book, index) => (
              <StructuredListRow key={index}>
                <StructuredListCell>{book.title}</StructuredListCell>
                <StructuredListCell>{book.firstPublished}</StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      )}

      {status === "NO_BOOKS_FOUND" && (
        <InlineNotification
          hideCloseButton={true}
          kind="error"
          title={`No books found for author "${payload.author}"`}
        />
      )}

      {status === "FAILED" && (
        <InlineNotification
          hideCloseButton={true}
          kind="error"
          title={payload.message}
        />
      )}

      {props.showYsuHistory && <>{history}</>}
    </>
  );
};

export default sequence({
  booksByAuthor: booksByAuthorSequence,
})(AuthorSearch);
