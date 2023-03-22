'use strict';

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  $.ajax({
    url: 'http://localhost:5000/login',
    type: 'POST',
    data: JSON.stringify({ username: username, password: password }),
    contentType: 'application/json',
    dataType: 'json',
    success: function (result, _, __) {
      localStorage.setItem('token', result.token);
      window.manualRoute('/images');
      showToast('Login Successful', true);
    },
    error: function (xhr, _, __) {
      xhr.responseJSON.error
        ? showToast(xhr.responseJSON.error, false)
        : xhr.responseJSON.message
        ? showToast(xhr.responseJSON.message, false)
        : showToast('An error occured', false);
    },
  });
}

function signup() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username) return showToast('Please enter username', false);
  if (!password) return showToast('Please enter username', false);

  if (username.length < 3)
    return showToast('Username must be at least 3 characters long', false);
  if (password.length < 8) {
    return showToast('Password must be at least 8 characters long', false);
  }

  $.ajax({
    url: 'http://localhost:5000/signup',
    type: 'POST',
    data: JSON.stringify({ username: username, password: password }),
    contentType: 'application/json',
    dataType: 'json',
    success: function (result, _, __) {
      localStorage.setItem('token', result.token);
      window.manualRoute('/images');
      showToast('Signup Successful', true);
    },
    error: function (xhr, _, __) {
      xhr.responseJSON.error
        ? showToast(xhr.responseJSON.error, false)
        : xhr.responseJSON.message
        ? showToast(xhr.responseJSON.message, false)
        : showToast('An error occured', false);
    },
  });
}

function showToast(text, isSuccess) {
  let toast = document.querySelector('.toast');
  let toastBottomBar = document.querySelector('.bottom-bar');
  let successIcon = document.querySelector('.success-icon');
  let errorIcon = document.querySelector('.error-icon');
  let toastText = document.querySelector('.toast-text');

  toast.onclick = () => {
    toast.style.display = 'none';
    toastBottomBar.style.animation = 'none';
  };

  toastText.innerText = text;

  if (isSuccess) {
    successIcon.classList.remove('hidden');
    errorIcon.classList.add('hidden');
  } else {
    successIcon.classList.add('hidden');
    errorIcon.classList.remove('hidden');
  }

  toast.style.display = 'grid';
  toastBottomBar.style.animation = 'animate-bar 3s linear forwards';

  setTimeout(() => {
    toast.style.display = 'none';
    toastBottomBar.style.animation = 'none';
  }, 3000);
}

window.onload = function () {
  /**
   * Add eventListener on multiple elements
   */

  const addEventOnElements = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
      elements[i].addEventListener(eventType, callback);
    }
  };

  /**
   * MOBILE NAV TOGGLE
   */

  const navbar = document.querySelector('[data-navbar]');
  const navToggler = document.querySelector('[data-nav-toggler]');

  const toggleNavbar = function () {
    navbar.classList.toggle('active');
  };

  navToggler.addEventListener('click', toggleNavbar);

  /**
   * HEADER
   *
   * active header when window scrolled to 50px
   */

  const header = document.querySelector('[data-header]');

  const activeHeader = function () {
    window.scrollY > 50
      ? header.classList.add('active')
      : header.classList.remove('active');
  };

  window.addEventListener('scroll', activeHeader);
  window.showToast = showToast;
};
