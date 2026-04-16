const nationalityMap = {
  "British": "gb",
  "Monegasque": "mc",
  "Italian": "it",
  "Dutch": "nl",
  "Spanish": "es",
  "French": "fr",
  "German": "de",
  "Finnish": "fi",
  "Australian": "au",
  "Mexican": "mx",
  "Canadian": "ca",
  "Japanese": "jp",
  "Thai": "th",
  "Chinese": "cn"
};

async function loadData() {
  try {
    // 1️⃣ standings
    const standingsRes = await fetch("https://api.jolpi.ca/ergast/f1/current/driverStandings.json");
    const standingsData = await standingsRes.json();
    const standings = standingsData.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    // 2️⃣ openF1 drivers (má fotky!)
    const driversRes = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
    const driversData = await driversRes.json();

    // map driver_number -> data
    const driverMap = {};
    driversData.forEach(d => {
      driverMap[d.driver_number] = d;
    });

    const tbody = document.querySelector("#f1Table tbody");
    tbody.innerHTML = "";

    standings.forEach(driver => {
      const row = document.createElement("tr");

      const fullName = driver.Driver.givenName + " " + driver.Driver.familyName;

      // najdi odpovídajícího jezdce v OpenF1
      const number = parseInt(driver.Driver.permanentNumber);
      const openDriver = driverMap[number];

      const img = openDriver?.headshot_url || "";
      const nat = driver.Driver.nationality;
      const code = nationalityMap[nat] || "un";

      row.innerHTML = `
        <td>${driver.position}</td>
        <td><img class="driver" src="${img}"></td>
        <td>${fullName}</td>
        <td><img class="flag" src="https://flagcdn.com/w40/${code}.png"></td>
        <td>${driver.points}</td>
      `;

      tbody.appendChild(row);
    });

  } catch (err) {
    console.error(err);
  }
}

loadData();
setInterval(loadData, 60000);