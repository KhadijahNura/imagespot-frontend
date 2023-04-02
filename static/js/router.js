// All SPA routing logic is contained here
'use strict';

import Dashboard from './views/Dashboard.js';
import Images from './views/Images.js';
import Login from './views/Login.js';
import NotFound from './views/NotFound.js';
import Profile from './views/Profile.js';
import Signup from './views/Signup.js';
import Upload from './views/Upload.js';

const BACKEND_URL = 'https://imagespot-backend.onrender.com';
// const BACKEND_URL = 'http://localhost:5000';

const routes = [
  { path: '/', view: Dashboard },
  { path: '/index.html', view: Dashboard },
  { path: '/images', view: Images },
  { path: '/upload', view: Upload },
  { path: '/login', view: Login },
  { path: '/signup', view: Signup },
  { path: '/profile', view: Profile },
  { path: '/404', view: NotFound },
];

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  handleLocation();
};

const manualRoute = (path) => {
  window.history.pushState({}, '', path);
  handleLocation();
};

const setCorrectLinkActive = () => {
  const navbarLinks = document.querySelectorAll('.navbar-link');
  navbarLinks.forEach((navbarLink) => {
    navbarLink.classList.remove('active');

    if (location.pathname === '/' && navbarLink.id === 'home-link')
      navbarLink.classList.add('active');
    else if (location.pathname === '/images' && navbarLink.id === 'images-link')
      navbarLink.classList.add('active');
    else if (location.pathname === '/login' && navbarLink.id === 'login-link')
      navbarLink.classList.add('active');
    else if (location.pathname === '/signup' && navbarLink.id === 'signup-link')
      navbarLink.classList.add('active');
    else if (
      location.pathname === '/profile' &&
      navbarLink.id === 'profile-link'
    )
      navbarLink.classList.add('active');
  });
};

const handleLocation = async () => {
  const path = window.location.pathname;

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: route.path === path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match)
    match = {
      route: routes.find((route) => route.path === '/404'),
      result: [location.pathname],
    };

  if (path === '/upload') {
    const isLoggedIn = await isAuthenticated();
    if (!isLoggedIn) {
      localStorage.setItem('redirect', '/upload');
      window.manualRoute('/login');
      window.showToast('Log in to access uploads', false);
      return;
    }
  }

  if (path === '/profile') {
    const isLoggedIn = await isAuthenticated();
    if (!isLoggedIn) {
      localStorage.setItem('redirect', '/profile');
      window.manualRoute('/login');
      window.showToast('Log in to access profile', false);
      return;
    }
  }

  const view = new match.route.view();

  document.getElementById('app').style.visibility = 'hidden';
  document.querySelector('.loader').classList.add('loading');

  document.getElementById('app').innerHTML = await view.getHTML();

  if (path === '/images') {
    await fetchImages();
  }

  if (path === '/profile') {
    await fetchUploads();
  }

  setTimeout(() => {
    document.getElementById('app').style.visibility = 'visible';
    document.querySelector('.loader').classList.remove('loading');
  }, 500);

  setCorrectLinkActive();
};

document.addEventListener('DOMContentLoaded', () => {
  // changing the default behaviour of links on the pages
  document.body.addEventListener('click', async (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      route(e);

      // closing navbar on click of nav link
      document.querySelector('[data-navbar]').classList.remove('active');
    }
  });
});

// Authentication
async function isAuthenticated() {
  if (window.user) {
    console.log(window.user);
    return true;
  } else {
    console.log('TOH');
    return false;
  }
}

// populating image section
async function fetchImages() {
  try {
    document.querySelector('.loader').classList.add('loading');

    const images = await $.ajax({
      url: `${BACKEND_URL}/images`,
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
    });

    window.images = images;

    await setupImagesPage(images);
  } catch (err) {
    document.querySelector('.loader').classList.remove('loading');
    showToast('An error occured', false);
  }
}

// populate uploads page
async function fetchUploads() {
  try {
    document.querySelector('.loader').classList.add('loading');

    const uploads = await $.ajax({
      url: `${BACKEND_URL}/uploads`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
    });

    window.uploads = uploads;

    await setupUploadsPage(uploads);
  } catch (err) {
    document.querySelector('.loader').classList.remove('loading');
    showToast('An error occured', false);
  }
}

function downloadURI(uri) {
  fetch(uri)
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('Image successfully downloaded', true);
    })
    .catch(() => showToast('An error occurred', false));
}

async function setupImagesPage(images) {
  const imagesCardContainer = document.querySelector('.image-cards-container');
  imagesCardContainer.innerHTML = '';

  if (images.length === 0) {
    imagesCardContainer.innerText = 'No images found';
    return;
  }

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    const card = document.createElement('div');
    card.classList.add('card');

    const cardImageContainer = document.createElement('div');
    cardImageContainer.classList.add('card-image-container');

    const cardImage = document.createElement('img');
    cardImage.classList.add('card__image');
    cardImage.src = `${BACKEND_URL}/${image.image_url}`;
    cardImage.alt = image.description;

    const cardImageOverlay = document.createElement('div');
    cardImageOverlay.classList.add('card__image-overlay');

    const cardBtn = document.createElement('btn');
    cardBtn.onclick = () => downloadURI(`${BACKEND_URL}/${image.image_url}`);
    cardBtn.innerText = 'Download';
    cardBtn.classList.add('card-btn');

    cardImageContainer.append(cardImage, cardImageOverlay, cardBtn);

    const cardContent = document.createElement('div');
    cardContent.classList.add('card__content');

    const cardContentFirstDesc = document.createElement('p');
    const cardContentFirstSubtitle = document.createElement('span');

    cardContentFirstSubtitle.classList.add('card__content-title');
    cardContentFirstSubtitle.innerText = 'Description: ';
    cardContentFirstDesc.innerHTML = `${cardContentFirstSubtitle.outerHTML} ${image.description}`;

    const cardContentSecondDesc = document.createElement('p');
    const cardContentSecondSubtitle = document.createElement('span');

    cardContentSecondSubtitle.classList.add('card__content-title');
    cardContentSecondSubtitle.innerText = 'Uploaded by: ';
    cardContentSecondDesc.innerHTML = `${cardContentSecondSubtitle.outerHTML} ${image.author_data.username}`;

    cardContent.append(cardContentFirstDesc, cardContentSecondDesc);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');

    const cardInfoLink = document.createElement('a');
    cardInfoLink.classList.add('card__link');
    cardInfoLink.target = '_blank';
    cardInfoLink.href = `${BACKEND_URL}/${image.image_url}`;
    cardInfoLink.innerText = 'View';

    cardInfo.appendChild(cardInfoLink);
    card.append(cardImageContainer, cardContent, cardInfo);

    imagesCardContainer.appendChild(card);
  }
}

async function setupUploadsPage(images) {
  document.getElementById('first_name').innerText = window.user.first_name;
  document.getElementById('last_name').innerText = window.user.last_name;
  document.getElementById('username').innerText = window.user.username;
  document.getElementById('email').innerText = window.user.email;

  const imagesCardContainer = document.querySelector('.image-cards-container');
  imagesCardContainer.innerHTML = '';
  document.querySelector('.search-form-container').style.display = 'flex';

  if (images.length === 0) {
    document.querySelector('.search-form-container').style.display = 'none';

    imagesCardContainer.outerHTML = `
      <div style="display: grid; place-items: center;">
        <p style="margin-block: 1rem">You haven't uploaded any images yet</p>
        <a href="/upload" class="btn btn-primary" data-link>Upload an image</a>
      </div>
    `;
    return;
  }

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const card = prepareCard(image);

    imagesCardContainer.appendChild(card);
  }

  function prepareCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardImageContainer = document.createElement('div');
    cardImageContainer.classList.add('card-image-container');

    const cardImage = document.createElement('img');
    cardImage.classList.add('card__image');
    cardImage.src = `${BACKEND_URL}/${image.image_url}`;
    cardImage.alt = image.description;

    const cardImageOverlay = document.createElement('div');
    cardImageOverlay.classList.add('card__image-overlay');

    const cardBtn = document.createElement('btn');
    cardBtn.onclick = () => deleteImage(`${image.id}`);
    cardBtn.innerText = 'Delete';
    cardBtn.classList.add('card-btn');

    cardImageContainer.append(cardImage, cardImageOverlay, cardBtn);

    const cardContent = document.createElement('div');
    cardContent.classList.add('card__content');

    const cardContentFirstDesc = document.createElement('p');
    const cardContentFirstSubtitle = document.createElement('span');

    cardContentFirstSubtitle.classList.add('card__content-title');
    cardContentFirstSubtitle.innerText = 'Description: ';
    cardContentFirstDesc.innerHTML = `${cardContentFirstSubtitle.outerHTML} ${image.description}`;

    cardContent.append(cardContentFirstDesc);

    card.append(cardImageContainer, cardContent);
    return card;
  }
}

// handle location on page load
handleLocation();

// routing when the user navigates through history
window.onpopstate = handleLocation;
window.route = route;
window.manualRoute = manualRoute;
window.setupImagesPage = setupImagesPage;
window.setupUploadsPage = setupUploadsPage;
