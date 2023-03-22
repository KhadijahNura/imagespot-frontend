// All SPA routing logic is contained here
'use strict';

import Dashboard from './views/Dashboard.js';
import Images from './views/Images.js';
import Login from './views/Login.js';
import NotFound from './views/NotFound.js';
import Signup from './views/Signup.js';
import Upload from './views/Upload.js';

const routes = [
  { path: '/', view: Dashboard },
  { path: '/images', view: Images },
  { path: '/upload', view: Upload },
  { path: '/login', view: Login },
  { path: '/signup', view: Signup },
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
    else if (location.pathname === '/upload' && navbarLink.id === 'images-link')
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
      window.manualRoute('/login');
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

  setTimeout(() => {
    document.getElementById('app').style.visibility = 'visible';
    document.querySelector('.loader').classList.remove('loading');
  }, 500);

  setCorrectLinkActive();
};

// routing when the user navigates through history
window.onpopstate = handleLocation;
window.route = route;
window.manualRoute = manualRoute;

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

handleLocation();

// Authentication
async function isAuthenticated() {
  const token = localStorage.getItem('token');

  if (!token) return false;

  try {
    const response = await $.ajax({
      url: 'http://localhost:5000/profile',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      contentType: 'application/json',
      dataType: 'json',
    });

    window.user = response;
    return true;
  } catch (err) {
    return false;
  }
}

// populating image section
async function fetchImages() {
  try {
    document.querySelector('.loader').classList.add('loading');

    const images = await $.ajax({
      url: 'http://localhost:5000/images',
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
    });

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      const card = document.createElement('div');
      card.classList.add('card');

      const cardImageContainer = document.createElement('div');
      cardImageContainer.classList.add('card-image-container');

      const cardImage = document.createElement('img');
      cardImage.classList.add('card__image');
      cardImage.src = `http://localhost:5000/${image.image_url}`;
      cardImage.alt = image.description;

      const cardImageOverlay = document.createElement('div');
      cardImageOverlay.classList.add('card__image-overlay');

      const cardBtn = document.createElement('btn');
      cardBtn.onclick = () =>
        downloadURI('http://localhost:5000/' + image.image_url);
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
      cardContentSecondSubtitle.innerText = 'Author: ';
      cardContentSecondDesc.innerHTML = `${cardContentSecondSubtitle.outerHTML} ${image.author_data.username}`;

      cardContent.append(cardContentFirstDesc, cardContentSecondDesc);

      const cardInfo = document.createElement('div');
      cardInfo.classList.add('card__info');

      const cardInfoLink = document.createElement('a');
      cardInfoLink.classList.add('card__link');
      cardInfoLink.target = '_blank';
      cardInfoLink.href = `http://localhost:5000/${image.image_url}`;
      cardInfoLink.innerText = 'View';

      cardInfo.appendChild(cardInfoLink);
      card.append(cardImageContainer, cardContent, cardInfo);

      document.querySelector('.image-cards-container').appendChild(card);
    }
    // document.querySelector('.loader').classList.remove('loading');
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
      // the filename you want
      a.download = 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('Image successfully downloaded', true);
    })
    .catch((err) => showToast('An error occurred', false));
}
