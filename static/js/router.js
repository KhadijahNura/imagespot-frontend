// All SPA routing logic is contained here
'use strict';

import Dashboard from './views/Dashboard.js';
import Images from './views/Images.js';
import Login from './views/Login.js';
import NotFound from './views/NotFound.js';
import Signup from './views/Signup.js';
import Upload from './views/Upload.js';

const pathToRegex = (path) =>
  new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: '/', view: Dashboard },
    { path: '/images', view: Images },
    { path: '/upload', view: Upload },
    { path: '/login', view: Login },
    { path: '/signup', view: Signup },
    { path: '/404', view: NotFound },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match)
    match = {
      route: routes.find((route) => route.path === '/404'),
      result: [location.pathname],
    };

  const view = new match.route.view(getParams(match));
  document.getElementById('app').innerHTML = await view.getHTML();

  // setting correct link active
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
      (location.pathname.includes('images') ||
        location.pathname.includes('upload')) &&
      navbarLink.id === 'images-link'
    )
      navbarLink.classList.add('active');
  });
};

// routing when the user navigates through history
window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', (e) => {
  // changing the default behaviour of links on the pages
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});
