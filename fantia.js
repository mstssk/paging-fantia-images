document.body.addEventListener("keydown", (e) => {
  if ([e.altKey, e.ctrlKey, e.shiftKey, e.metaKey].some((b) => b)) {
    return; // 修飾キー付きはブラウザのホットキーなどの場合があるので無視
  }
  if (e.key === "ArrowRight") {
    document.querySelector(".move-button.clickable.next")?.click();
  } else if (e.key === "ArrowLeft") {
    document.querySelector(".move-button.clickable.prev")?.click();
  } else if (e.key === "Escape") {
    document.querySelector(`a[ng-click="slideshow.close()"]`)?.click();
  } else if (e.key === "o") {
    document.querySelector(`a[ng-if="array[index].url.original"]`)?.click();
  }
});
