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
function checkpoint(md, dpcap, pumpOut, icp, fcp, stb) {
  const vol = md * dpcap;
  const strokes = pumpOut > 0 ? vol / pumpOut : 0;
  const pressure = stb > 0 ? icp - (icp - fcp) * (strokes / stb) : icp;
  return { vol, strokes, pressure };
}
function calc() {
  const icp = num("icp"), fcp = num("fcp"), stb = num("stb");
  const dpcap = num("dpcap"), pumpOut = num("pumpout");
  const kop = checkpoint(num("kopmd"), dpcap, pumpOut, icp, fcp, stb);
  set("out-kopvol", fmt(kop.vol, 1) + " bbls");
  set("out-kopstrokes", fmt(kop.strokes, 0) + " strokes");
  set("out-koppress", fmt(kop.pressure, 0) + " psi");
  const eob = checkpoint(num("eobmd"), dpcap, pumpOut, icp, fcp, stb);
  set("out-eobvol", fmt(eob.vol, 1) + " bbls");
  set("out-eobstrokes", fmt(eob.strokes, 0) + " strokes");
  set("out-eobpress", fmt(eob.pressure, 0) + " psi");
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
