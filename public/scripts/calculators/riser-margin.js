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
  document.getElementById(id).textContent = text;
}
function calc() {
  const mw = num("mw"), swg = num("swg"), wd = num("wd"), ag = num("ag"), tvd = num("tvd");
  const riserLen = wd + ag;
  const rmh = mw * 0.052 * riserLen;
  const swh = swg * wd;
  const denom = tvd - wd - ag;
  const margin = denom !== 0 ? (rmh - swh) / 0.052 / denom : 0;
  set("out-rmh", fmt(rmh, 0) + " psi");
  set("out-swh", fmt(swh, 0) + " psi");
  set("out-margin", fmt(margin, 2) + " ppg");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
