// content scriptの読み込みタイミングだと若干早いので、setTimeoutで遅延させる。
setTimeout(() => {
  const firstImgElemContainer = document.querySelector(
    "article [class^='styled__FullWidthWrapper'] [class^='PostImage__Wrapper-sc-xvj0xk-0 IXhFz']"
  );
  const galleryElem = firstImgElemContainer.closest(
    "[class^='styled__FullWidthWrapper']"
  );

  addBatchDownloadButton(galleryElem);
}, 10);

function addBatchDownloadButton(galleryElem) {
  const button = document.createElement("button");
  button.style.position = "absolute"; // 既存スタイルを壊さないよう、別のスタックコンテキストに置く。
  button.style.transform = "translateY(-100%)";
  button.textContent = "⬇️";
  galleryElem.insertBefore(button, galleryElem.firstChild);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const anchors = Array.from(galleryElem.querySelectorAll("a[href]"));
      downloadImages(anchors)
        .then(() => console.log("done"))
        .catch(console.warn);
    } catch (e) {
      console.warn(e);
    }
  });
}

async function downloadImages(anchors) {
  const author = document.querySelector("h1").textContent.trim();
  const title = document.querySelector("article h1").textContent.trim();

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

  let i = 0;
  for (const anchor of anchors) {
    const extension = new URL(anchor.href).pathname.split(".").pop();
    const fileNo = `000${++i}`.slice(-3);
    const filename = `${directory}/${fileNo}.${extension}`;
    const downloadOption = { filename, url: anchor.href };
    const message = { type: "download", payload: downloadOption };
    await chrome.runtime.sendMessage(message);
    await sleep(200 + Math.floor(Math.random() * 100));
  }
  await chrome.runtime.sendMessage({ type: "showDownloadFolder" });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
