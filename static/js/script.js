'use strict';

const BACKEND_URL = 'https://imagespot-backend.onrender.com';

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  $.ajax({
    url: `${BACKEND_URL}/login`,
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
    url: `${BACKEND_URL}/signup`,
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

async function uploadImage() {
  let fileInput = document.getElementById('image_input_field');
  let description = document.getElementById('description').value;

  let file = fileInput.files[0];

  if (typeof FileReader !== 'undefined') {
    let filesize = file.size;

    if (filesize > 10 * 1024 * 1024)
      return showToast('Image must be less than 10mb', false);
  }

  let formData = new FormData();
  formData.append('image', file);

  if (!file) return showToast('Please select image', false);
  if (!description) return showToast('Please enter description', false);

  if (description.length < 3)
    return showToast('Description must be at least 3 characters long', false);

  try {
    document.querySelector('.loader').classList.add('loading');

    const imageResponse = await $.ajax({
      url: `${BACKEND_URL}/images`,
      type: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      data: formData,
      processData: false,
      contentType: false,
    });

    await $.ajax({
      url: `${BACKEND_URL}/images/${imageResponse.id}`,
      type: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      data: JSON.stringify({ description: description }),
      contentType: 'application/json',
      dataType: 'json',
    });

    document.querySelector('.loader').classList.add('loading');

    showToast('Upload Successful', true);
    window.manualRoute('/images');
  } catch (err) {
    console.log(err);
  }
}

async function searchImages() {
  const searchQuery = document.getElementById('search').value;
  const images = window.images;
  let result = [];

  if (searchQuery !== '') {
    images.forEach((image) => {
      if (image.description.toLowerCase().includes(searchQuery)) {
        result.push(image);
      }
    });
    await window.setupImagesPage(result);
  } else {
    await window.setupImagesPage(images);
  }
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
  // mobile nav toggle
  const navbar = document.querySelector('[data-navbar]');
  const navToggler = document.querySelector('[data-nav-toggler]');

  const toggleNavbar = function () {
    navbar.classList.toggle('active');
  };

  navToggler.addEventListener('click', toggleNavbar);

  // set header to active on scroll
  const header = document.querySelector('[data-header]');

  const activeHeader = function () {
    window.scrollY > 50
      ? header.classList.add('active')
      : header.classList.remove('active');
  };

  window.addEventListener('scroll', activeHeader);
  window.showToast = showToast;
};
