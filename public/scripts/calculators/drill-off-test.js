function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el?.value ?? "");
  return isFinite(v) ? v : 0;
}
function fmt(n) {
  if (!isFinite(n)) return "0";
  return n.toLocaleString(void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
const WOB_COUNT = 6;
const RPM_COUNT = 6;
function calcWob() {
  let bestIdx = -1, bestVal = -Infinity;
  const values = [];
  for (let i = 0; i < WOB_COUNT; i++) {
    const time = num(`wob-time-${i}`);
    const ft = num(`wob-ft-${i}`);
    const rop = time > 0 ? ft / time * 3600 : 0;
    values.push(rop);
    const el = document.getElementById(`wob-rop-${i}`);
    if (el) el.textContent = rop > 0 ? fmt(rop) + " ft/hr" : "\u2014";
    if (rop > bestVal) {
      bestVal = rop;
      bestIdx = i;
    }
  }
  const table = document.getElementById("wob-table");
  table?.querySelectorAll("tbody tr").forEach((tr, i) => tr.classList.toggle("best-row", i === bestIdx && values[i] > 0));
}
function calcRpm() {
  let bestIdx = -1, bestVal = -Infinity;
  const values = [];
  for (let i = 0; i < RPM_COUNT; i++) {
    const time = num(`rpm-time-${i}`);
    const rop = time > 0 ? 3600 / time : 0;
    values.push(rop);
    const el = document.getElementById(`rpm-rop-${i}`);
    if (el) el.textContent = rop > 0 ? fmt(rop) + " ft/hr" : "\u2014";
    if (rop > bestVal) {
      bestVal = rop;
      bestIdx = i;
    }
  }
  const table = document.getElementById("rpm-table");
  table?.querySelectorAll("tbody tr").forEach((tr, i) => tr.classList.toggle("best-row", i === bestIdx && values[i] > 0));
}
document.querySelectorAll("#wob-table .row-in").forEach((el) => el.addEventListener("input", calcWob));
document.querySelectorAll("#rpm-table .row-in").forEach((el) => el.addEventListener("input", calcRpm));
calcWob();
calcRpm();
