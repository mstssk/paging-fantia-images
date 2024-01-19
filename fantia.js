document.body.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
    return; // 修飾キー付きはブラウザのホットキーなどの場合があるので無視
  }
  if (e.key === "ArrowRight") {
    document.querySelector(".move-button.clickable.next")?.click();
  } else if (e.key === "ArrowLeft") {
    document.querySelector(".move-button.clickable.prev")?.click();
  } else if (e.key === "Escape") {
    document.querySelector("a > .fa-close")?.closest("a")?.click();
  } else if (e.key === "o") {
    const path = `${location.pathname}/post_content_photo/`.replace("//", "/");
    document.querySelector(`a[href^="${path}"]`)?.click();
  }
});
