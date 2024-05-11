chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "download") {
    console.log(message);
    const downloadOption = message.payload;
    chrome.downloads.download(downloadOption).then(() => {
      sendResponse();
    });
    return true; // sendResponseを非同期にするために必要
  } else if (message.type === "showDownloadFolder") {
    chrome.downloads.showDefaultFolder();
  }
});
