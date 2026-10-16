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
  const len = num("slug-len"), cap = num("slug-cap"), mw = num("slug-mw"), sw = num("slug-sw");
  const denom = sw - mw;
  const slugVol = denom > 0 ? len * cap * mw / denom : 0;
  set("out-slugvol", fmt(slugVol, 2) + " bbl");
  const vol2 = num("slug-vol2"), mw2 = num("slug-mw2"), sw2 = num("slug-sw2");
  const pitGain = mw2 > 0 ? vol2 * (sw2 - mw2) / mw2 : 0;
  set("out-pitgain", fmt(pitGain, 2) + " bbl");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
