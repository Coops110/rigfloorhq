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
  const pumpType = document.getElementById("pumptype").value;
  const rodField = document.getElementById("rod-field");
  rodField.style.opacity = pumpType === "duplex" ? "1" : "0.4";
  const liner = num("liner"), stroke = num("stroke"), rod = num("rod"), eff = num("eff") / 100, spm = num("spm");
  let outputPerStroke = pumpType === "triplex" ? 243e-6 * liner * liner * stroke : 162e-6 * stroke * (2 * liner * liner - rod * rod);
  outputPerStroke *= eff;
  const bpm = outputPerStroke * spm;
  const gpm = bpm * 42;
  const dpCap = num("dp-id") * num("dp-id") / 1029.4;
  const dpDisp = (num("dp-od") * num("dp-od") - num("dp-id") * num("dp-id")) / 1029.4;
  const bhaCap = num("bha-id") * num("bha-id") / 1029.4;
  const bhaDisp = (num("bha-od") * num("bha-od") - num("bha-id") * num("bha-id")) / 1029.4;
  const stringCapVol = dpCap * num("dp-len") + bhaCap * num("bha-len");
  const stringDispVol = dpDisp * num("dp-len") + bhaDisp * num("bha-len");
  const ann1Cap = (num("hole1") * num("hole1") - num("dp-od") * num("dp-od")) / 1029.4;
  const ann2Cap = (num("hole2") * num("hole2") - num("bha-od") * num("bha-od")) / 1029.4;
  const annVol = ann1Cap * num("hole1-len") + ann2Cap * num("hole2-len");
  const strokesDown = outputPerStroke > 0 ? stringCapVol / outputPerStroke : 0;
  const strokesUp = outputPerStroke > 0 ? annVol / outputPerStroke : 0;
  const minutesDown = spm > 0 ? strokesDown / spm : 0;
  const minutesUp = spm > 0 ? strokesUp / spm : 0;
  document.getElementById("out-output").textContent = fmt(outputPerStroke, 4) + " bbl/stroke";
  document.getElementById("out-rate").textContent = fmt(bpm, 2) + " bbl/min (" + fmt(gpm, 0) + " gpm)";
  document.getElementById("out-stringcap").textContent = fmt(stringCapVol, 1) + " bbls";
  document.getElementById("out-stringdisp").textContent = fmt(stringDispVol, 1) + " bbls";
  document.getElementById("out-annvol").textContent = fmt(annVol, 1) + " bbls";
  document.getElementById("out-strokesdown").textContent = fmt(strokesDown, 0) + " strokes";
  document.getElementById("out-strokesup").textContent = fmt(strokesUp, 0) + " strokes";
  document.getElementById("out-timedown").textContent = fmt(minutesDown, 1) + " min";
  document.getElementById("out-timeup").textContent = fmt(minutesUp, 1) + " min";
}
document.querySelectorAll(".calc-box input, .calc-box select").forEach((el) => el.addEventListener("input", calc));
calc();
