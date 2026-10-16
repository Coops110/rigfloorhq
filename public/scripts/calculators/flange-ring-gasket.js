const boreSel = document.getElementById("fl-bore");
const pressSel = document.getElementById("fl-press");
const rows = Array.from(document.querySelectorAll("#fl-table tbody tr"));
function applyFilter() {
  const bore = boreSel?.value ?? "";
  const press = pressSel?.value ?? "";
  rows.forEach((row) => {
    const matches = (!bore || row.dataset.bore === bore) && (!press || row.dataset.press === press);
    row.style.display = matches ? "" : "none";
  });
}
boreSel?.addEventListener("change", applyFilter);
pressSel?.addEventListener("change", applyFilter);
