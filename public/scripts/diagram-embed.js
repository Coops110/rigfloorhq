document.addEventListener("click", (e) => {
  const btn = e.target?.closest(".embed-copy");
  if (!btn) return;
  const scope = btn.closest(".embed-field") || btn.closest(".embed-offer");
  const box = scope?.querySelector(".embed-code");
  if (!box) return;
  const flash = (msg, success) => {
    if (btn.dataset.busy) return;
    btn.dataset.busy = "1";
    const original = btn.textContent;
    btn.textContent = msg;
    btn.classList.toggle("is-copied", success);
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("is-copied");
      delete btn.dataset.busy;
    }, 2200);
  };
  const copied = () => flash(btn.dataset.copied || "Copied", true);
  const selectOnly = () => {
    box.focus();
    box.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    if (ok) copied();
    else flash(btn.dataset.selected || "Selected \u2014 press Ctrl+C", false);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(box.value).then(copied).catch(selectOnly);
  } else {
    selectOnly();
  }
});
