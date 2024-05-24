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
  const [author, title] = Array.from(document.querySelectorAll("h1")).map((e) =>
    esc(e.textContent.trim())
  );

  // e.g. '2024-05-11 20-07-36'
  const timestamp = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Tokyo",
  })
    .format(new Date())
    .replace(/[:/]/g, "-");

  const directory = `${timestamp} [${author}]${title}`;

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
    const filename = `${directory}/${fileNo}.${extension}`;
    const downloadOption = { filename, url: img.src };
    const message = { type: "download", payload: downloadOption };
    await chrome.runtime.sendMessage(message);
  }

  await chrome.runtime.sendMessage({ type: "showDownloadFolder" });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ローカルファイルシステム向けにエスケープ
function esc(str) {
  return str.replace(/[:\/]/g, "_");
}
