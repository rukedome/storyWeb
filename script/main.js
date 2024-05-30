const pages = document.querySelectorAll('.page');
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
  window.scrollTo({ top: nextPage.offsetTop, behavior: 'smooth' });
  currentPageIndex = index;

  playVideo(index);
  // 오리발바닥 커서 이미지 숨기기
  document.getElementById('page5Cursor').style.display = "none";
  // 각 page별로 적용될 내용 
  if (index == 4) { // page5
    showGameIntro(nextPage, 3000);
    // 오리발바닥 커서 이미지 표시하기
    document.getElementById('page5Cursor').style.display = "block";
  } else if (index == 5) { // page6
    // 우산쓴 오리 이미지 지우기
    removeRandomRainImage();
    showGameIntro(nextPage, 3000);
    // 우산쓴 오리 이미지 개수
    const imgCnt = 20;
    for (let i = 0; i < imgCnt; i++) {
      setTimeout(addRandomRainImage, i * 1000);
    }
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

window.addEventListener('wheel', (event) => {
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

// pageObj: 화면전환이 필요한 대상 page div
// milSec: 화면전환시 몇 초 후에 전환할것인지 밀리세컨
function showGameIntro(pageObj, milSec) {
  const gameIntro = pageObj.querySelector('#gameIntro');
  const gameContent = pageObj.querySelector('#gameContent');

  gameIntro.style.display = 'block';
  gameContent.style.display = 'none';

  setTimeout(() => {
    gameIntro.style.display = 'none';
    gameContent.style.display = 'block';
  }, milSec); // 3초 후에 전환
}

updateRemoteButtons();

pages[4].addEventListener('click', function(e) {
  const gifUrl = './image/wave.gif'; // 여기에 실제 GIF URL을 넣으세요.
  const gif = document.createElement('img');
  gif.src = gifUrl;
  gif.width = '10rem';
  gif.height = '10rem';
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

  pages[4].addEventListener('mousemove', function(e) {
      const cursor = document.getElementById('page5Cursor');
      cursor.style.left = e.pageX + 'px';
      cursor.style.top = e.pageY + 'px';
  });

  // 마우스 이동 이벤트 리스너
  pages[5].addEventListener('mousemove', function(e) {
    // 우산쓴 오리 이미지들을 선택합니다.
    const rainImages = document.querySelectorAll('.rain');
    // // 각도, 좌우 움직을 위한 세팅 값을 가져옵니다
    const containerWidth = pages[5].offsetWidth;
    const mouseX = e.clientX;
    const moveAmount = (mouseX / containerWidth) * 1000 - 500; // -50%에서 50% 사이의 값
    const offset = (mouseX / containerWidth - 0.5) * 2;

    rainImages.forEach((img, index) => {
      const speed = (index + 1) * 0.1;
      const rotation = offset * speed * 20;
      img.style.transform = `translateX(${moveAmount}px) rotate(${rotation}deg)`;
    });
  });
});

// 우산을 쓴 오리 이미지를 생성하는 함수
function addRandomRainImage() {
  const rainContainer = document.getElementById('rainContainer');
  const img = document.createElement('img');
  img.src = './image/umbrella_duck.gif';
  img.className = 'rain';

  // 랜덤 크기 설정
  const randomSize = Math.random() * (20 - 10) + 10; // 10rem에서 20rem 사이의 크기
  img.style.width = randomSize + 'rem';
  img.style.height = randomSize + 'rem';

  // 랜덤 위치 설정
  const containerWidth = document.getElementById('page6').clientWidth;
  const containerHeight = document.getElementById('page6').clientHeight;
  const randomLeft = Math.floor(Math.random() * containerWidth);
  const randomTop = Math.floor(Math.random() * containerHeight) / 2;
  img.style.left = randomLeft + 'px';
  img.style.top = '0px';  // 필요에 따라 조정 가능

  const duration = Math.random() * (10 - 5) + 5; // 5초에서 10초 사이의 지속 시간
  img.style.animation = `rain-fall ${duration}s linear infinite`;


  rainContainer.appendChild(img);
}

// 우산 쓴 오리 이미지를 지우는 함수
function removeRandomRainImage() {
  const rainContainer = document.getElementById('rainContainer');
  rainContainer.innerHTML = '';
}
