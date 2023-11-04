document.body.addEventListener("keydown", (e) => {
  if ([e.altKey, e.ctrlKey, e.shiftKey, e.metaKey].some((b) => b)) {
    return; // 修飾キー付きはブラウザのホットキーなどの場合があるので無視
  }
  if (e.key === "o") {
    // オリジナルサイズで表示
    document.querySelector("a[class^=PostImageModal__Anchor]")?.click();
  }
});
