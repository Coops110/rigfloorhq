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
  const mw = num("mamw-mw"), lp = num("mamw-lp"), tvd = num("mamw-tvd");
  const mamw = mw + lp / (0.052 * tvd);
  set("out-mamw", fmt(mamw, 2) + " ppg");
  const killmw = num("mamw-killmw"), tvd2 = num("mamw-tvd2"), mamw2 = num("mamw-mamw2");
  const newMaasp = (mamw2 - killmw) * 0.052 * tvd2;
  set("out-newmaasp", fmt(newMaasp, 0) + " psi");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
