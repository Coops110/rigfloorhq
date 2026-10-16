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
  const mw = num("ecd-mw"), tvd = num("ecd-tvd"), q = num("ecd-q"), len = num("ecd-len");
  const dh = num("ecd-dh"), dp = num("ecd-dp");
  const gap = dh - dp;
  const areaTerm = dh * dh - dp * dp;
  const av = areaTerm > 0 ? 24.5 * q / areaTerm : 0;
  const apl = gap > 0 ? 14327e-11 * mw * len * av * av / gap : 0;
  const ecd = tvd > 0 ? mw + apl / 0.052 / tvd : mw;
  set("out-av", fmt(av, 0) + " ft/min");
  set("out-apl", fmt(apl, 0) + " psi");
  set("out-ecd", fmt(ecd, 2) + " ppg");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
