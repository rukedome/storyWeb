const pages = document.querySelectorAll(".page");
const videos = document.querySelectorAll('.video');
let currentPageIndex = 0;
let isScrolling = false;

const remoteButtonsContainer = document.getElementById('remoteButtons');
const firstPageButton = document.getElementById('firstPageButton');
const lastPageButton = document.getElementById('lastPageButton');

function updateRemoteButtons() {
  remoteButtonsContainer.innerHTML = '';

  const totalPages = pages.length;
  const maxButtons = 5;
  const halfMaxButtons = Math.floor(maxButtons / 2);

  let startPage = Math.max(0, currentPageIndex - halfMaxButtons);
  let endPage = Math.min(totalPages - 1, currentPageIndex + halfMaxButtons);

  if (currentPageIndex <= halfMaxButtons) {
    endPage = Math.min(maxButtons - 1, totalPages - 1);
  } else if (currentPageIndex >= totalPages - halfMaxButtons - 1) {
    startPage = Math.max(totalPages - maxButtons, 0);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('div');
    button.className = 'button';
    button.textContent = i + 1;
    button.addEventListener('click', () => {
      scrollToPage(i);
    });
    remoteButtonsContainer.appendChild(button);
  }
}

function scrollToPage(index) {
  if (index < 0 || index >= pages.length) return;
  const nextPage = pages[index];
  window.scrollTo({ top: nextPage.offsetTop, behavior: "smooth" });
  currentPageIndex = index;

  playVideo(index);

  if (index >= 4) {
    showGameIntro(nextPage);
  }

  updateRemoteButtons();
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

firstPageButton.addEventListener('click', () => {
  scrollToPage(0);
});

lastPageButton.addEventListener('click', () => {
  scrollToPage(pages.length - 1);
});

function showGameIntro(pageObj) {
  const gameIntro = document.getElementById('gameIntro');
  const gameContent = document.getElementById('gameContent');

  gameIntro.style.display = 'block';
  gameContent.style.display = 'none';

  setTimeout(() => {
    gameIntro.style.display = 'none';
    gameContent.style.display = 'block';
  }, 3000); // 3초 후에 전환
}

updateRemoteButtons();