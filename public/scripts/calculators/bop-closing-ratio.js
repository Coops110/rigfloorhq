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
  const whp1 = num("bop-whp1"), cr = num("bop-cr");
  set("out-close", fmt(cr > 0 ? whp1 / cr : 0, 0) + " psi");
  const whp2 = num("bop-whp2"), or_ = num("bop-or");
  set("out-open", fmt(or_ > 0 ? whp2 / or_ : 0, 0) + " psi");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
