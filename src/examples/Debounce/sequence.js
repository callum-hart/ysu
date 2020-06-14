import { update, pause } from "../../lib";

import { getBooksByAuthor } from "./service";

async function* booksByAuthorSequence(author) {
  // inform UI we've recieved the latest search intent
  yield update("LISTENING");

  // wait for 1 second to debounce the network request
  await pause(1000);

  yield update("SEARCHING", author);

  try {
    const books = await getBooksByAuthor(author);

    if (books.length) {
      yield update("BOOKS_FOUND", books);
    } else {
      yield update("NO_BOOKS_FOUND");
    }
  } catch (error) {
    yield update("FAILED", error);
  }
}

export { booksByAuthorSequence };
