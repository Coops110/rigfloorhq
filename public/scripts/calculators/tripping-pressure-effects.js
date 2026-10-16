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
  const mw = num("tpe-mw"), sd = num("tpe-sd"), cc = num("tpe-cc");
  const dry = cc - sd > 0 ? mw * 0.052 * (sd / (cc - sd)) : 0;
  set("out-dry", fmt(dry, 4) + " psi/ft");
  const mw2 = num("tpe-mw2"), dpc = num("tpe-dpc"), ac = num("tpe-ac");
  const wet = ac > 0 ? mw2 * 0.052 * ((sd + dpc) / ac) : 0;
  set("out-wet", fmt(wet, 4) + " psi/ft");
  const len = num("tpe-len"), sd2 = num("tpe-sd2"), cc2 = num("tpe-cc2");
  const drop = cc2 > 0 ? len * sd2 / cc2 : 0;
  set("out-drop", fmt(drop, 1) + " ft");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
