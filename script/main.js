const pages = document.querySelectorAll(".page");
const buttons = document.querySelectorAll('.button');
const videos = document.querySelectorAll('.video');
let currentPageIndex = 0;
let isScrolling = false;

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    scrollToPage(index);
    playVideo(index);
  });
});

function scrollToPage(index) {
  if (index < 0 || index >= pages.length) return;
  const nextPage = pages[index];
  window.scrollTo({ top: nextPage.offsetTop, behavior: "smooth" });
  currentPageIndex = index;

  playVideo(index);
}

function playVideo(index) {
  videos.forEach(video => {
    video.pause();
    video.currentTime = 0;
  });

  if (index >= 0 && index < videos.length) {
    videos[index].play();
  }
}

window.addEventListener("wheel", (event) => {
  if (isScrolling) return;
  isScrolling = true;

  const delta = Math.sign(event.deltaY);
  let nextPageIndex = currentPageIndex + delta;
  scrollToPage(nextPageIndex);

  setTimeout(() => {
    isScrolling = false;
  }, 800);
});
