function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el?.value ?? "");
  return isFinite(v) ? v : 0;
}
function fmt(n, d) {
  if (!isFinite(n)) return "0";
  return n.toLocaleString(void 0, { minimumFractionDigits: d, maximumFractionDigits: d });
}
function calc() {
  const orig = num("odf-orig"), present = num("odf-present");
  const dp = num("odf-dp"), wl = num("odf-wl");
  const c1 = orig - present;
  const c2 = dp !== 0 || wl !== 0 ? dp - wl : 0;
  const final = c1 + c2;
  document.getElementById("out-c1").textContent = fmt(c1, 1) + " ft";
  document.getElementById("out-c2").textContent = fmt(c2, 1) + " ft";
  document.getElementById("out-final").textContent = (final >= 0 ? "+" : "") + fmt(final, 1) + " ft";
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
