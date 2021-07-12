const galleryItems = [
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825_1280.jpg',
    description: 'Hokkaido Flower',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    description: 'Container Haulage Freight',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    description: 'Aerial Beach View',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    description: 'Flower Blooms',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    description: 'Alpine Mountains',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    description: 'Mountain Lake Sailing',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    description: 'Alpine Spring Meadows',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    description: 'Nature Landscape',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    description: 'Lighthouse Coast Sea',
  },
];

const galleryEl = document.querySelector('ul.js-gallery');
const lightboxEl = document.querySelector('.js-lightbox');
const lightboxImageEl = document.querySelector('img.lightbox__image');
const closeLightboxEl = document.querySelector('button[data-action="close-lightbox"]');
const lightboxOverlayEl = document.querySelector('div.lightbox__overlay');

galleryEl.innerHTML = createGallery(galleryItems);
// galleryEl.insertAdjacentHTML("afterbegin", createGallery(galleryItems)); //вариант, если эл., в который вставляем, не пустой

let xMousePosition = 0;

galleryEl.addEventListener('click', onOpenLightboxMouse);
closeLightboxEl.addEventListener('click', onCloseLightbox);
lightboxOverlayEl.addEventListener('click', onCloseLightboxOverlay);
window.addEventListener('keydown', onKeyPress);

function createGallery(items) {
  return items
    .map(({ preview, original, description }) => {
        return  `
          <li class="gallery__item">
            <a
              class="gallery__link"
              href="${original}"
              >
              <img
                class="gallery__image"
                loading="lazy"
                src="${preview}"
                data-source="${original}"
                alt="${description}"
              />
            </a>
          </li>
        `;
      })
    .join('');
};

function onOpenLightboxMouse(evt) {
  evt.preventDefault();
  onOpenLightbox();
}

function onOpenLightbox() {
  const activeGalleryImgEl = document.activeElement.firstElementChild;

  if (!activeGalleryImgEl.classList.contains("gallery__image")) {
    return;
  };

  lightboxEl.classList.add('is-open');
  lightboxImageEl.src = `${activeGalleryImgEl.dataset.source}`;
  lightboxImageEl.alt = `${activeGalleryImgEl.alt}`;
  
  document.body.style.overflow = "hidden"; // остановка скролла под модальным окном
  document.body.style.height = "100wh"; // остановка скролла под модальным окном

  lightboxImageEl.addEventListener('mousemove', _.throttle(onMouseMove, 500));
  lightboxImageEl.addEventListener('click', onNextImageNextMouseClick);
};

function onCloseLightbox() {
  lightboxImageEl.removeEventListener('mousemove', _.throttle(onMouseMove, 500));
  lightboxImageEl.removeEventListener('click', onNextImageNextMouseClick);

  lightboxImageEl.src = "";
  lightboxImageEl.alt = "";

  lightboxEl.classList.remove('is-open');

  document.body.style.overflow = "auto"; // запуск скролла после закрытия модального окна
  document.body.style.height = "auto"; // запуск скролла после закрытия модального окна
};

function onMouseMove(evt) {
  xMousePosition = evt.clientX;
  // console.log(evt.clientX);
};

function onCloseLightboxOverlay(evt) {
  
  if (evt.target !== evt.currentTarget) {
    return;
  };
  
  onCloseLightbox();
};

function onKeyPress(evt) {
  if(evt.code === "Enter") {
    onOpenLightbox();
  };

  let modalIsOpen = lightboxEl.classList.contains('is-open');
  
  if (modalIsOpen) {
   if (evt.code === "Escape") {
    onCloseLightbox();
  };
  
  if (evt.code === "ArrowRight") {
    lightboxImageRight();
  };

  if (evt.code === "ArrowLeft") {
    lightboxImageLeft();
  }; 
  };
  
};

function onNextImageNextMouseClick() {
  if (xMousePosition < (window.innerWidth / 2)) {
    lightboxImageLeft();
  } else {
    lightboxImageRight();
  };
};

function lightboxImageRight() {
  const currentImgElIndex = galleryItems.indexOf(galleryItems.find(item => item.original === lightboxImageEl.src));

  let nextImgEl = {};

  currentImgElIndex === galleryItems.length - 1 ?
    nextImgEl = galleryItems[0] :
    nextImgEl = galleryItems[currentImgElIndex + 1];

  lightboxImageEl.src = `${nextImgEl.original}`;
  lightboxImageEl.alt = `${nextImgEl.description}`;
};

function lightboxImageLeft() {
const currentImgElIndex = galleryItems.indexOf(galleryItems.find(item => item.original === lightboxImageEl.src));
  let previousImgEl = {};

  currentImgElIndex === 0 ?
    previousImgEl = galleryItems[galleryItems.length - 1] :
    previousImgEl = galleryItems[currentImgElIndex - 1];

  lightboxImageEl.src = `${previousImgEl.original}`;
  lightboxImageEl.alt = `${previousImgEl.description}`;
};




