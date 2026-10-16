const DECIMALS = {
  "u-ppg": 3,
  "u-sg": 4,
  "u-psift": 4,
  "u-lbft3": 2,
  "u-kgm3": 1,
  "u-bar10m": 4,
  "p-psi": 1,
  "p-bar": 4,
  "p-kpa": 2,
  "p-kgcm2": 4,
  "d-ft": 1,
  "d-m": 2
};
const inputs = Array.from(document.querySelectorAll("input.conv"));
function trim(n, places) {
  return n.toFixed(places).replace(/\.?0+$/, "") || "0";
}
function spread(source) {
  const group = source.dataset.group;
  const raw = source.value.trim();
  const peers = inputs.filter((i) => i.dataset.group === group && i !== source);
  if (raw === "") {
    peers.forEach((i) => {
      i.value = "";
    });
    return;
  }
  const val = parseFloat(raw);
  if (!isFinite(val)) return;
  const base = val * parseFloat(source.dataset.factor);
  peers.forEach((peer) => {
    const converted = base / parseFloat(peer.dataset.factor);
    peer.value = trim(converted, DECIMALS[peer.id] ?? 4);
  });
}
inputs.forEach((input) => {
  input.addEventListener("input", () => spread(input));
});
document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const ppg = document.getElementById("u-ppg");
    ppg.value = btn.dataset.ppg;
    spread(ppg);
    ppg.focus();
  });
});
