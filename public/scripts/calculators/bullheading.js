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
  const fp = num("fp"), sitp = num("sitp"), tvd = num("tvd"), omw = num("omw"), fg = num("fg");
  const kfw = tvd > 0 ? sitp / (0.052 * tvd) + omw : 0;
  const ffp = fg * tvd;
  const ihp = fp - sitp;
  const iafd = tvd > 0 ? ihp / (tvd * 0.052) : 0;
  const misp = ffp - ihp;
  const mfsp = ffp - kfw * 0.052 * tvd;
  set("out-kfw", fmt(kfw, 2) + " ppg");
  set("out-ffp", fmt(ffp, 0) + " psi");
  set("out-ihp", fmt(ihp, 0) + " psi");
  set("out-iafd", fmt(iafd, 2) + " ppg");
  set("out-misp", fmt(misp, 0) + " psi");
  set("out-mfsp", fmt(mfsp, 0) + " psi");
  const vol = num("vsl") + num("veot") + num("vperf") + num("vbot");
  set("out-vol", fmt(vol, 1) + " bbls");
  const gmr = num("gmr"), tcap = num("tcap"), pout = num("pout");
  const spm = pout > 0 ? gmr / 60 * tcap / pout : 0;
  set("out-spm", fmt(spm, 3) + " spm");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
