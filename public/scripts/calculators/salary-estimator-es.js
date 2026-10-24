// Spanish version of salary-estimator.js — same ROLES data, translated output
// text only. Keep both files' ROLES object in sync if the pay table changes.
const ROLES = {
  "roustabout": { entry: 38000, typical: 50000, senior: 60000 },
  "roughneck": { entry: 45000, typical: 70000, senior: 82000 },
  "derrickhand": { entry: 55000, typical: 75000, senior: 90000 },
  "assistant-driller": { entry: 60000, typical: 78000, senior: 95000 },
  "driller": { entry: 70000, typical: 95000, senior: 120000 },
  "toolpusher": { entry: 90000, typical: 130000, senior: 180000 },
  "oim": { entry: 150000, typical: 210000, senior: 280000 },
  "mud-engineer": { entry: 80000, typical: 105000, senior: 140000 },
  "directional-driller": { entry: 100000, typical: 150000, senior: 200000 },
  "wellsite-geologist": { entry: 80000, typical: 115000, senior: 160000 },
  "hse-officer": { entry: 65000, typical: 85000, senior: 110000 },
  "welder-junior": { entry: 45000, typical: 55000, senior: 65000 },
  "welder-senior": { entry: 90000, typical: 110000, senior: 130000 },
  "underwater-welder": { entry: 60000, typical: 100000, senior: 150000 },
  "company-man": { entry: 150000, typical: 220000, senior: 300000 },
};

function fmt(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function calc() {
  const role = document.getElementById("se-role").value;
  const exp = document.getElementById("se-experience").value;
  const loc = document.getElementById("se-location").value;
  const out = document.getElementById("se-out");
  const note = document.getElementById("se-note");

  const base = ROLES[role]?.[exp];
  if (!base) {
    out.textContent = "—";
    note.textContent = "";
    return;
  }

  if (loc === "offshore") {
    const low = Math.round(base * 1.3 / 1000) * 1000;
    const high = Math.round(base * 1.4 / 1000) * 1000;
    out.textContent = fmt(low) + " – " + fmt(high);
    note.textContent = "La base en tierra para este rol/nivel es " + fmt(base) + " — la cifra costa afuera aplica la prima de 30–40% explicada abajo, más alojamiento y comida gratis durante el turno.";
  } else {
    out.textContent = fmt(base);
    note.textContent = "Esta es la estimación editorial para este rol y nivel de experiencia de la tabla de abajo, no una encuesta con nombre único — ver la tabla de verificación cruzada del BLS más abajo para una comparación con fuente independiente.";
  }
}

["se-role", "se-experience", "se-location"].forEach((id) => {
  document.getElementById(id)?.addEventListener("change", calc);
});
calc();
