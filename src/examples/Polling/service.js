async function getIssLocation() {
  const res = await fetch("http://api.open-notify.org/iss-now.json");
  const { timestamp, iss_position } = await res.json();

  return {
    timestamp,
    lat: iss_position.latitude,
    long: iss_position.longitude
  };
}

export { getIssLocation };
