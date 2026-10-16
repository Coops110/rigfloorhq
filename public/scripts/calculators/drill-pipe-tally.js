function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el?.value ?? "");
  return isFinite(v) ? v : 0;
}
function fmt(n, d) {
  if (!isFinite(n)) return "0";
  return n.toLocaleString(void 0, { minimumFractionDigits: d, maximumFractionDigits: d });
}
const MAX_ROWS = 25;
function calc() {
  const od = num("dp-od"), id = num("dp-id");
  const jointLen = num("joint-len"), jointCount = Math.max(0, Math.round(num("joint-count")));
  const standLen = num("stand-len");
  const capPerFt = id * id / 1029.4;
  const dispPerFt = (od * od - id * id) / 1029.4;
  const totalLen = jointCount * jointLen;
  const totalCap = capPerFt * totalLen;
  const totalDisp = dispPerFt * totalLen;
  const stands = standLen > 0 ? totalLen / standLen : 0;
  document.getElementById("out-cap-ft").textContent = fmt(capPerFt, 4) + " bbl/ft";
  document.getElementById("out-disp-ft").textContent = fmt(dispPerFt, 4) + " bbl/ft";
  document.getElementById("out-total-len").textContent = fmt(totalLen, 1) + " ft";
  document.getElementById("out-total-cap").textContent = fmt(totalCap, 1) + " bbls";
  document.getElementById("out-total-disp").textContent = fmt(totalDisp, 1) + " bbls";
  document.getElementById("out-stands").textContent = stands > 0 ? fmt(stands, 1) + " stands" : "\u2014";
  const tbody = document.getElementById("tally-body");
  const note = document.getElementById("tally-note");
  if (tbody) {
    tbody.innerHTML = "";
    if (jointCount > 0 && jointLen > 0) {
      const step = jointCount > MAX_ROWS ? Math.ceil(jointCount / MAX_ROWS) : 1;
      const rows = [];
      for (let j = step; j <= jointCount; j += step) rows.push(j);
      if (rows.length === 0 || rows[rows.length - 1] !== jointCount) rows.push(jointCount);
      for (const j of rows) {
        const depth = j * jointLen;
        const tr = document.createElement("tr");
        tr.innerHTML = "<td>" + j + "</td><td>" + fmt(depth, 1) + "</td><td>" + fmt(capPerFt * depth, 1) + "</td><td>" + fmt(dispPerFt * depth, 1) + "</td>";
        tbody.appendChild(tr);
      }
      if (note) {
        note.textContent = step > 1 ? "Cumulative depth, capacity, and displacement at each joint, assuming every joint equals the average length above. Showing every " + step + "-joint interval (" + rows.length + " rows) to keep the table readable \u2014 the underlying math is continuous per joint." : "Cumulative depth, capacity, and displacement at each joint, assuming every joint equals the average length above.";
      }
    }
  }
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
