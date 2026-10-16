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
  const tvd = num("ks-tvd"), omw = num("omw"), sidpp = num("sidpp"), scr = num("spr");
  const sicp = num("sicp"), maasp = num("maasp");
  const pumpOut = num("pumpout");
  const stringVol = num("dp-len") * num("dp-cap") + num("bha-len") * num("bha-cap");
  const annVol = num("dpann-len") * num("dpann-cap") + num("bhaann-len") * num("bhaann-cap");
  const kmwRaw = tvd > 0 ? sidpp / (0.052 * tvd) + omw : omw;
  const kmw = Math.ceil(kmwRaw * 10) / 10;
  const icp = scr + sidpp;
  const fcp = omw > 0 ? scr * (kmw / omw) : 0;
  const strokesToBit = pumpOut > 0 ? stringVol / pumpOut : 0;
  const strokesUp = pumpOut > 0 ? annVol / pumpOut : 0;
  const totalStrokes = strokesToBit + strokesUp;
  const maaspWarning = document.getElementById("maasp-warning");
  if (maaspWarning) maaspWarning.style.display = maasp > 0 && sicp > maasp ? "block" : "none";
  document.getElementById("out-kmw").textContent = fmt(kmw, 1) + " ppg";
  document.getElementById("out-icp").textContent = fmt(icp, 0) + " psi";
  document.getElementById("out-fcp").textContent = fmt(fcp, 0) + " psi";
  document.getElementById("out-stringvol").textContent = fmt(stringVol, 1) + " bbls";
  document.getElementById("out-annvol").textContent = fmt(annVol, 1) + " bbls";
  document.getElementById("out-strokesbit").textContent = fmt(strokesToBit, 0) + " strokes";
  document.getElementById("out-strokesup").textContent = fmt(strokesUp, 0) + " strokes";
  document.getElementById("out-strokestotal").textContent = fmt(totalStrokes, 0) + " strokes";
  const tbody = document.querySelector("#sched-table tbody");
  if (tbody && strokesToBit > 0) {
    const stepStrokes = Math.floor(strokesToBit / 10);
    let rows = "";
    for (let i = 0; i <= 10; i++) {
      const strokes = i === 10 ? Math.round(strokesToBit) : stepStrokes * i;
      const pressure = Math.floor(icp - (icp - fcp) / 10 * i);
      const label = i === 0 ? "Start" : i === 10 ? "At Bit" : i * 10 + "%";
      rows += `<tr><td>${label}</td><td>${fmt(strokes, 0)}</td><td>${fmt(pressure, 0)} psi</td></tr>`;
    }
    tbody.innerHTML = rows;
  } else if (tbody) {
    tbody.innerHTML = "";
  }
}
document.querySelectorAll(".calc-box input").forEach((el) => el.addEventListener("input", calc));
calc();
