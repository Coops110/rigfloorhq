function num(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el?.value ?? "");
  return isFinite(v) ? v : 0;
}
function fmt(n, d) {
  if (!isFinite(n)) return "0";
  return n.toLocaleString(void 0, { minimumFractionDigits: d, maximumFractionDigits: d });
}
function roundTripTM(depth, mw, dpWtAir, standLen, blockWt, dcLen, dcWtAir) {
  const bf = (65.5 - mw) / 65.5;
  const wp = dpWtAir * bf;
  const wc = dcLen * dcWtAir * bf - dcLen * dpWtAir * bf;
  const D = depth;
  const rttm = (wp * D * (standLen + D) + 2 * D * (2 * blockWt + wc)) / (5280 * 2e3);
  return { rttm, bf };
}
function calc() {
  const mw = num("mw"), dpWt = num("dpwt"), stand = num("stand");
  const block = num("block"), dcLen = num("dclen"), dcWt = num("dcwt");
  const depthA = num("deptha"), depthB = num("depthb");
  const a = roundTripTM(depthA, mw, dpWt, stand, block, dcLen, dcWt);
  const b = roundTripTM(depthB, mw, dpWt, stand, block, dcLen, dcWt);
  const diff = b.rttm - a.rttm;
  document.getElementById("out-bf").textContent = fmt(a.bf, 4);
  document.getElementById("out-rttma").textContent = fmt(a.rttm, 2) + " ton-miles";
  document.getElementById("out-rttmb").textContent = fmt(b.rttm, 2) + " ton-miles";
  document.getElementById("out-drilling").textContent = fmt(3 * diff, 2) + " ton-miles";
  document.getElementById("out-coring").textContent = fmt(2 * diff, 2) + " ton-miles";
  document.getElementById("out-shorttrip").textContent = fmt(diff, 2) + " ton-miles";
  const csgWt = num("csgwt"), csgDepth = num("csgdepth"), csgJoint = num("csgjoint");
  const csgTM = (csgWt * csgDepth * (csgJoint + csgDepth) + csgDepth * block) * 0.5 / (5280 * 2e3);
  document.getElementById("out-csgtm").textContent = fmt(csgTM, 2) + " ton-miles";
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
