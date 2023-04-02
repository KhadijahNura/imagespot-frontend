'use strict';

const BACKEND_URL = 'https://imagespot-backend.onrender.com';
// const BACKEND_URL = 'http://localhost:5000';

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const loginBtn = document.getElementById('login-btn');

  if (!username) return showToast('Please enter username', false);
  if (!password) return showToast('Please enter username', false);

  if (username.length < 3)
    return showToast('Username must be at least 3 characters long', false);
  if (password.length < 8) {
    return showToast('Password must be at least 8 characters long', false);
  }

  loginBtn.disabled = true;
  loginBtn.innerText = 'Loading...';

  $.ajax({
    url: `${BACKEND_URL}/login`,
    type: 'POST',
    data: JSON.stringify({ username, password }),
    contentType: 'application/json',
    dataType: 'json',
    success: async function (result, _, __) {
      loginBtn.disabled = false;
      loginBtn.innerText = 'Login';

      localStorage.setItem('token', result.token);
      await getUserDetails();

      window.manualRoute(localStorage.getItem('redirect') || '/images');
      localStorage.setItem('redirect', '');
      showToast('Login Successful', true);
    },
    error: function (xhr, _, __) {
      loginBtn.disabled = false;
      loginBtn.innerText = 'Login';

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
  const email = document.getElementById('email').value;
  const first_name = document.getElementById('first_name').value;
  const last_name = document.getElementById('last_name').value;

  const signupBtn = document.getElementById('signup-btn');

  if (!username) return showToast('Please enter username', false);
  if (!password) return showToast('Please enter username', false);
  if (!email) return showToast('Please enter email', false);
  if (!first_name) return showToast('Please enter first name', false);
  if (!last_name) return showToast('Please enter last name', false);

  if (username.length < 3)
    return showToast('Username must be at least 3 characters long', false);
  if (first_name.length < 3)
    return showToast('First name must be at least 3 characters long', false);
  if (last_name.length < 3)
    return showToast('Last name must be at least 3 characters long', false);
  if (email.length < 3)
    return showToast('Email must be at least 3 characters long', false);
  if (password.length < 8) {
    return showToast('Password must be at least 8 characters long', false);
  }

  signupBtn.disabled = true;
  signupBtn.innerText = 'Loading...';

  $.ajax({
    url: `${BACKEND_URL}/signup`,
    type: 'POST',
    data: JSON.stringify({ username, email, first_name, last_name, password }),
    contentType: 'application/json',
    dataType: 'json',
    success: async function (result, _, __) {
      signupBtn.disabled = false;
      signupBtn.innerText = 'Sign Up';

      localStorage.setItem('token', result.token);
      await getUserDetails();

      window.manualRoute('/images');
      showToast('Signup Successful', true);
    },
    error: function (xhr, _, __) {
      signupBtn.disabled = false;
      signupBtn.innerText = 'Sign Up';

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
      data: JSON.stringify({ description }),
      contentType: 'application/json',
      dataType: 'json',
    });

    document.querySelector('.loader').classList.remove('loading');

    showToast('Upload Successful', true);
    window.manualRoute('/images');
  } catch (err) {
    document.querySelector('.loader').classList.remove('loading');
    showToast(
      err.responseJSON.message
        ? err.responseJSON.message
        : err.responseJSON.error
        ? err.responseJSON.error
        : 'An error occurred',
      false
    );
    console.log(err);
  }
}

async function deleteImage(id) {
  const response = prompt(
    "Are you sure you want to delete this item? Type 'yes' to proceed"
  );

  if (response && response.toLowerCase() === 'yes') {
    try {
      document.querySelector('.loader').classList.add('loading');

      await $.ajax({
        url: `${BACKEND_URL}/images/${id}`,
        type: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        processData: false,
        contentType: false,
      });

      document.querySelector('.loader').classList.remove('loading');

      showToast('Delete Successful', true);
      window.uploads = window.uploads.filter(
        (upload) => upload.id !== parseInt(id)
      );
      await window.setupUploadsPage(window.uploads);
    } catch (err) {
      document.querySelector('.loader').classList.remove('loading');
      showToast(
        err.responseJSON.message
          ? err.responseJSON.message
          : err.responseJSON.error
          ? err.responseJSON.error
          : 'An error occurred',
        false
      );
      console.log(err);
    }
  }
}

async function searchImages() {
  const searchQuery = document.getElementById('search').value;
  const images = window.images;
  let result = [];

  if (searchQuery !== '') {
    images.forEach((image) => {
      if (image.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        result.push(image);
      }
    });

    await window.setupImagesPage(result);
  } else {
    await window.setupImagesPage(images);
  }
}

async function searchUploads() {
  const searchQuery = document.getElementById('search').value;
  const images = window.uploads;
  let result = [];

  if (searchQuery !== '') {
    images.forEach((image) => {
      if (image.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        result.push(image);
      }
    });

    if (result.length === 0) {
      document.querySelector('.cards').innerText = 'No images found';
      return;
    }

    await window.setupUploadsPage(result);
  } else {
    await window.setupUploadsPage(images);
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

window.onload = async function () {
  document.querySelector('li:has(#login-link)').classList.remove('hidden');
  document.querySelector('li:has(#signup-link)').classList.remove('hidden');
  document.querySelector('li:has(#profile-link)').classList.add('hidden');

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

  document.body.addEventListener('mousedown', (e) => {
    if (navbar.classList.contains('active')) {
      if (!navToggler.contains(e.target)) navbar.classList.remove('active');
    }
  });

  await getUserDetails();

  window.addEventListener('scroll', activeHeader);
  window.showToast = showToast;
};

async function getUserDetails() {
  const token = localStorage.getItem('token');

  try {
    if (!token) throw new Error();

    const response = await $.ajax({
      url: `${BACKEND_URL}/profile`,
      type: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      contentType: 'application/json',
      dataType: 'json',
    });

    document.querySelector('li:has(#login-link)').classList.add('hidden');
    document.querySelector('li:has(#signup-link)').classList.add('hidden');
    document.querySelector('li:has(#profile-link)').classList.remove('hidden');

    window.user = response;
  } catch (err) {
    document.querySelector('li:has(#login-link)').classList.remove('hidden');
    document.querySelector('li:has(#signup-link)').classList.remove('hidden');
    document.querySelector('li:has(#profile-link)').classList.add('hidden');
  }
}
