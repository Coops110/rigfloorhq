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
  const wair = num("wair"), od = num("od"), id_ = num("id"), fwa = num("fwa"), fwi = num("fwi");
  const bf = 1 - fwa / 65.5;
  const open = wair * bf;
  const closed = wair - od * od * fwa / 24.5;
  const diff = wair + id_ * id_ * fwi / 24.5 - od * od * fwa / 24.5;
  set("out-bf", fmt(bf, 4));
  set("out-open", fmt(open, 2) + " lb/ft");
  set("out-closed", fmt(closed, 2) + " lb/ft");
  set("out-diff", fmt(diff, 2) + " lb/ft");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
