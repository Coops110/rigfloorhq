const PSI_PER_FT_PER_PPG = 0.05194805194805;
const mw = document.getElementById("q-mw");
const tvd = document.getElementById("q-tvd");
const hpOut = document.getElementById("q-hp");
const gradOut = document.getElementById("q-grad");
const box = document.getElementById("q-output");
function run() {
  if (!mw || !tvd || !hpOut || !gradOut) return;
  const w = parseFloat(mw.value);
  const d = parseFloat(tvd.value);
  if (isFinite(w) && w > 0) {
    gradOut.textContent = (w * PSI_PER_FT_PER_PPG).toFixed(4) + " psi/ft";
    box?.classList.add("visible");
  } else {
    gradOut.textContent = "\u2014";
  }
  if (isFinite(w) && isFinite(d) && w > 0 && d > 0) {
    hpOut.textContent = Math.round(w * PSI_PER_FT_PER_PPG * d).toLocaleString() + " psi";
    box?.classList.add("visible");
  } else {
    hpOut.textContent = "\u2014";
  }
}
mw?.addEventListener("input", run);
tvd?.addEventListener("input", run);
