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
function tfaFor32nds(n) {
  const d = n / 32;
  return Math.PI / 4 * d * d;
}
function calc() {
  const n1 = num("bh-n1"), n2 = num("bh-n2"), n3 = num("bh-n3");
  const tfa = tfaFor32nds(n1) + tfaFor32nds(n2) + tfaFor32nds(n3);
  set("out-tfa", fmt(tfa, 3) + " in\xB2");
  const q = num("bh-q"), tfa2 = num("bh-tfa2");
  const jv = tfa2 > 0 ? 0.32 * q / tfa2 : 0;
  set("out-jv", fmt(jv, 1) + " ft/sec");
  const dp = num("bh-dp"), q2 = num("bh-q2"), size = num("bh-size");
  const hhp = dp * q2 / 1714;
  const bitArea = Math.PI / 4 * size * size;
  const hsi = bitArea > 0 ? hhp / bitArea : 0;
  set("out-hhp", fmt(hhp, 1) + " hp");
  set("out-hsi", fmt(hsi, 2) + " hp/in\xB2");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
