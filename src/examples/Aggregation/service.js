async function getNextSpaceXLaunch() {
  const res = await fetch("https://api.spacexdata.com/v3/launches/next");
  const {
    launch_date_local,
    launch_site,
    mission_name,
    rocket,
  } = await res.json();

  return {
    launchDate: new Date(launch_date_local).toDateString(),
    launchSite: launch_site.site_name_long,
    missionName: mission_name,
    rocket: rocket.rocket_name,
  };
}

async function getNextNasaLaunch() {
  const res = await fetch(
    "https://launchlibrary.net/1.3/launch/next/1?lsp=nasa"
  );
  const {
    launches: [{ windowstart, location, name, rocket }],
  } = await res.json();

  return {
    launchDate: new Date(windowstart).toDateString(),
    launchSite: location.name,
    missionName: name,
    rocket: rocket.name,
  };
}

export { getNextSpaceXLaunch, getNextNasaLaunch };
