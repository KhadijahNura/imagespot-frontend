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
