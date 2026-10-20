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
  const on = num("days-on"), off = num("days-off"), rate = num("hourly-rate"), perdiem = num("per-diem");
  const cycle = on + off;
  const cyclesPerYear = cycle > 0 ? 365 / cycle : 0;
  const daysWorked = on * cyclesPerYear;
  const daysOff = off * cyclesPerYear;
  const hoursWorked = daysWorked * 12;
  const basePay = hoursWorked * rate;
  const perDiemPay = daysWorked * perdiem;
  const totalPay = basePay + perDiemPay;
  const fteHourly = totalPay / 2080;
  set("out-cycle", fmt(cycle, 0) + "-day cycle");
  set("out-days-worked", fmt(daysWorked, 0) + " days/yr");
  set("out-days-off", fmt(daysOff, 0) + " days/yr");
  set("out-hours", fmt(hoursWorked, 0) + " hrs/yr");
  set("out-base", "$" + fmt(basePay, 0));
  set("out-perdiem", "$" + fmt(perDiemPay, 0));
  set("out-total", "$" + fmt(totalPay, 0));
  set("out-fte", "$" + fmt(fteHourly, 2) + "/hr FTE-equivalent");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
