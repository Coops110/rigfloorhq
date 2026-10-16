const GAL_DIVISOR = 231;
const LITRE_DIVISOR = 1e3;
const DEFAULTS = {
  gal: { d: 48, l: 120, h: 24 },
  litre: { d: 120, l: 300, h: 60 }
};
function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el?.value ?? "");
  return isFinite(v) ? v : 0;
}
function fmt(n, d) {
  if (!isFinite(n)) return "0";
  return n.toLocaleString(void 0, { minimumFractionDigits: d, maximumFractionDigits: d });
}
function set(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function segmentArea(r, h) {
  if (r <= 0) return 0;
  const hh = Math.max(0, Math.min(2 * r, h));
  const d = r - hh;
  const arg = Math.max(-1, Math.min(1, d / r));
  const under = Math.max(0, 2 * r * hh - hh * hh);
  return r * r * Math.acos(arg) - d * Math.sqrt(under);
}
function calc() {
  const unitEl = document.getElementById("tank-unit");
  const unit = unitEl?.value === "litre" ? "litre" : "gal";
  const divisor = unit === "litre" ? LITRE_DIVISOR : GAL_DIVISOR;
  const unitLabel = unit === "litre" ? "cm" : "in";
  const volLabel = unit === "litre" ? "L" : "gal";
  ["unit-d", "unit-l", "unit-h", "unit-table"].forEach((id) => set(id, unitLabel));
  const D = num("tank-d");
  const L = num("tank-l");
  const r = D / 2;
  const fullVol = segmentArea(r, D) * L / divisor;
  set("out-total", D > 0 && L > 0 ? fmt(fullVol, 1) + " " + volLabel : "\u2014");
  const h = num("tank-h");
  const quickVol = segmentArea(r, h) * L / divisor;
  set("out-quick", D > 0 && L > 0 ? fmt(quickVol, 1) + " " + volLabel : "\u2014");
  set("out-quick-pct", fullVol > 0 ? fmt(quickVol / fullVol * 100, 1) + "%" : "\u2014");
  const tbody = document.getElementById("tank-table-body");
  if (tbody) {
    tbody.innerHTML = "";
    if (D > 0 && L > 0) {
      for (let pct = 0; pct <= 100; pct += 5) {
        const rowH = pct / 100 * D;
        const rowVol = segmentArea(r, rowH) * L / divisor;
        const tr = document.createElement("tr");
        tr.innerHTML = "<td>" + pct + "%</td><td>" + fmt(rowH, 2) + "</td><td>" + fmt(rowVol, 1) + " " + volLabel + "</td>";
        tbody.appendChild(tr);
      }
    }
  }
}
const unitSelect = document.getElementById("tank-unit");
unitSelect?.addEventListener("change", () => {
  const mode = unitSelect.value === "litre" ? "litre" : "gal";
  const d = DEFAULTS[mode];
  document.getElementById("tank-d").value = String(d.d);
  document.getElementById("tank-l").value = String(d.l);
  document.getElementById("tank-h").value = String(d.h);
  calc();
});
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
