const img = document.querySelector("img");
if (img) {
  location.assign(img.src);
} else {
  console.error("No image found");
}
