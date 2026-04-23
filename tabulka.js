
let previous = {};

// 🎨 barvy týmů (API fallback)
const teamColors = {
  "Red Bull": "#0600EF",
  "Ferrari": "#DC0000",
  "Mercedes": "#00D2BE",
  "McLaren": "#FF8700",
  "Aston Martin": "#006F62",
  "Alpine F1 Team": "#0090FF",
  "Williams": "#005AFF",
  "RB F1 Team": "#1E41FF",
  "Kick Sauber": "#52E252",
  "Haas F1 Team": "#B6BABD"
};

async function load() {

  const res = await fetch("https://api.jolpi.ca/ergast/f1/current/driverStandings.json");
  const data = await res.json();
  const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

  const open = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
  const drivers = await open.json();

  const map = {};
  drivers.forEach(d => map[d.driver_number] = d);

  const tbody = document.querySelector("#f1Table tbody");
  tbody.innerHTML = "";

  standings.forEach(d => {

    const id = d.Driver.driverId;
    const pos = parseInt(d.position);
    const old = previous[id];

    let arrow = "";
    let cls = "";

    if (old) {
      if (pos < old) {
        arrow = "▲";
        cls = "up";
      }
      if (pos > old) {
        arrow = "▼";
        cls = "down";
      }
    }

    previous[id] = pos;

    const number = parseInt(d.Driver.permanentNumber);
    const img = map[number]?.headshot_url || "https://via.placeholder.com/40";

    const team = d.Constructors[0].name;
    const color = teamColors[team] || "#777";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="pos">
        ${pos} <span class="${cls}">${arrow}</span>
      </td>

      <td>
        <div style="width:5px;height:40px;background:${color};float:left;margin-right:8px"></div>
        <img class="driver-img" src="${img}">
      </td>

      <td>${d.Driver.givenName} ${d.Driver.familyName}</td>

      <td class="team">${team}</td>

      <td><b>${d.points}</b></td>
    `;

    tbody.appendChild(tr);
  });
}

load();
setInterval(load, 60000);