import { update, pause } from "../../lib";

import { getBooksByAuthor } from "./service";

async function* booksByAuthorSequence(author) {
  // optimistically inform UI search has been recieved
  yield update("SEARCHING");

  // wait for 1 second to debounce the network request
  await pause(1000);

  yield update("FETCHING");

  try {
    const books = await getBooksByAuthor(author);

    if (books.length) {
      yield update("BOOKS_FOUND", { books });
    } else {
      yield update("NO_BOOKS_FOUND", { author });
    }
  } catch (error) {
    yield update("FAILED", error);
  }
}

export { booksByAuthorSequence };
