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
  const dp = num("dp"), mw = num("mw"), acap = num("acap"), dpcap = num("dpcap"), dpdisp = num("dpdisp");
  const wetDenom = 0.052 * mw * (dpcap + dpdisp);
  const wet = wetDenom !== 0 ? dp * acap / wetDenom : 0;
  const dryDenom = 0.052 * mw * dpdisp;
  const dry = dryDenom !== 0 ? dp * (acap + dpcap) / dryDenom : 0;
  const perft = acap !== 0 ? 0.052 * mw * ((dpcap + dpdisp) / acap) : 0;
  set("out-wet", fmt(wet, 1) + " ft");
  set("out-dry", fmt(dry, 1) + " ft");
  set("out-perft", fmt(perft, 4) + " psi/ft");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
