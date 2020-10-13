async function getIssLocation() {
  const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
  const { timestamp, latitude, longitude } = await res.json();

  return {
    timestamp,
    lat: latitude,
    long: longitude
  };
}

export { getIssLocation };
