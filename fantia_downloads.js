// 記事本文は遅延読み込みなのでMutationObserverで監視
document.querySelectorAll("post-show").forEach((postBody) => {
  const observer = new MutationObserver(() => {
    observer.disconnect();

    postBody.querySelectorAll(".type-photo-gallery").forEach((el) => {
      addBatchDownloadButton(el);
    });
  });
  observer.observe(postBody, { childList: true });
});

function addBatchDownloadButton(galleryElem) {
  const button = document.createElement("button");
  button.style.position = "absolute"; // 既存スタイルを壊さないよう、別のスタックコンテキストに置く。
  button.textContent = "⬇️";
  galleryElem.insertBefore(button, galleryElem.firstChild);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const anchors = Array.from(
        galleryElem.querySelectorAll(".image-module a")
      );
      downloadImages(anchors)
        .then(() => console.log("done"))
        .catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  });
}

async function downloadImages(anchors) {
  for (let i = 0; i < anchors.length; i++) {
    if (i === 0) {
      anchors.at(0).click(); // 最初の画像を開く
    } else {
      document.querySelector(".move-button.clickable.next")?.click(); // 次の画像へ
    }
    await sleep(200 + Math.floor(Math.random() * 100));

    const href = document.querySelector(
      `a[href^="${location.pathname}/post_content_photo/"]`
    ).href;
    const imgPageHTML = await fetch(href).then((r) => r.text());
    const img = new DOMParser()
      .parseFromString(imgPageHTML, "text/html")
      .querySelector("img");
    const extension = new URL(img.src).pathname.split(".").pop();
    const fileNo = `000${i + 1}`.slice(-3);
    const filename = `${fileNo}.${extension}`;
    const downloadOption = { filename, url: img.src };
    const message = { type: "download", payload: downloadOption };
    await chrome.runtime.sendMessage(message);
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
