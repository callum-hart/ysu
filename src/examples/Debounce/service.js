async function getBooksByAuthor(author) {
  const res = await fetch(
    `http://openlibrary.org/search.json?author=${author}`
  );
  const { docs } = await res.json();

  return docs.map(({ title, first_publish_year }) => ({
    title,
    firstPublished: first_publish_year,
  }));
}

export { getBooksByAuthor };
