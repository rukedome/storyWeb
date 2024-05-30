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
    document.body.classList.add('page5-custom-cursor');  
  } else {
    document.body.classList.remove('page5-custom-cursor'); // 다른 페이지에서는 기본 커서로 돌아갑니다.
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
  const gameIntro = pageObj.querySelector('#gameIntro');
  const gameContent = pageObj.querySelector('#gameContent');

  gameIntro.style.display = 'block';
  gameContent.style.display = 'none';

  setTimeout(() => {
    gameIntro.style.display = 'none';
    gameContent.style.display = 'block';
  }, 3000); // 3초 후에 전환
}

updateRemoteButtons();

pages[4].addEventListener('click', function(e) {
  const gifUrl = './image/heart-11534_512.gif'; // 여기에 실제 GIF URL을 넣으세요.
  const gif = document.createElement('img');
  gif.src = gifUrl;
  gif.classList.add('gif');
  gif.style.left = `${e.clientX}px`;
  gif.style.top = `${e.clientY}px`;
  pages[4].appendChild(gif);

  // 애니메이션이 끝난 후 GIF 이미지를 제거
  gif.addEventListener('animationend', function() {
      gif.remove();
  });
}); 

document.addEventListener('DOMContentLoaded', function() {
  const rainGifs = document.querySelectorAll('.rain');
  const rainContainer = document.querySelector('.rain-container');

  // 마우스 이동 이벤트 리스너
  pages[5].addEventListener('mousemove', function(e) {
    const containerWidth = pages[5].offsetWidth;
    const mouseX = e.clientX;
    const offset = (mouseX / containerWidth - 0.5) * 2; // -1에서 1 사이 값으로 변환

    rainGifs.forEach((gif, index) => {
      const speed = (index + 1) * 0.1; // 각 GIF마다 다른 속도로 움직이게 설정
      const translateX = offset * speed * 100; // X축 이동 거리
      const rotation = offset * speed * 20; // 회전 각도

      gif.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
    });
  });
});