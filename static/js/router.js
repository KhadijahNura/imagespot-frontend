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

  const view = new match.route.view();
  document.getElementById('app').innerHTML = await view.getHTML();

  setCorrectLinkActive();
};

// routing when the user navigates through history
window.onpopstate = handleLocation;
window.route = route;

document.addEventListener('DOMContentLoaded', (e) => {
  // changing the default behaviour of links on the pages
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      route(e);

      // closing navbar on click of nav link
      document.querySelector('[data-navbar]').classList.remove('active');
    }
  });
});

handleLocation();
