/* eslint-disable */

const signinForm = document.getElementById('sign-in');
const logoutBtn = document.getElementById('logout');
const mapBox = document.getElementById('map');
const customFile = document.querySelector('.custom-file-input');
const updateUserForm = document.getElementById('update-userdata');
const updatePasswordForm = document.getElementById('update-password');

const signin = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3001/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'Success') {
      await Swal.fire({
        icon: 'success',
        title: 'You are now signed in!',
        showConfirmButton: false,
        timer: 1500
      });

      location.assign('/');
    }
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: err.response.data.message,
      confirmButtonText: 'Try Again'
    });
  }
};

if (signinForm) {
  signinForm.addEventListener('submit', async el => {
    el.preventDefault();
    document.getElementById('btn-signin').textContent = 'SIGNING IN...';
    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;
    await signin(emailValue, passwordValue);
    document.getElementById('btn-signin').textContent = 'SIGN IN';
  });
}

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3001/api/v1/users/logout'
    });

    if (
      res.data.status === 'Success' &&
      window.location.pathname !== '/profile'
    ) {
      location.reload(true);
    } else if (res.data.status === 'Success') {
      location.assign('/');
    }
  } catch (err) {
    console.log(err);
    await Swal.fire({
      icon: 'error',
      title: 'Something went wrong. Try again!',
      confirmButtonText: 'Try Again'
    });
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const res = await Swal.fire({
      title: 'Are you sure want to leave?',
      text: 'Feel free to check back here again later!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Yes, I'm sure!"
    });

    if (res.value) await logout();
  });
}

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  mapboxgl.accessToken =
    'pk.eyJ1IjoicnpreWlybXduIiwiYSI6ImNrMnduMWg1bDAzZW0zZXFoa2hhMm5nb2gifQ.YLofsvvnJW6QA1ISlQ5UrA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rzkyirmwn/ck2wnoo9j0z991cmu1exjk83m'
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Add Marker Element
    const el = document.createElement('div');
    el.className = 'marker';

    // Set Marker
    new mapboxgl.Marker({
      elemet: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Set Popup
    new mapboxgl.Popup({
      offset: 50
    })
      .setLngLat(loc.coordinates)
      .setHTML(`Day ${loc.day} - ${loc.description}`)
      .addTo(map);

    // Extend Map Bounds
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 130,
      bottom: 50,
      left: 50,
      right: 50
    }
  });
}

if (customFile) {
  $(document).ready(function() {
    bsCustomFileInput.init();
  });
}

const updateUser = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3001/api/v1/users/update-me',
      data: {
        name,
        email
      }
    });

    if (res.data.status === 'Success') {
      Swal.fire({
        icon: 'success',
        title: 'Data updated successfully!',
        showConfirmButton: false,
        timer: 2000
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Something is wrong!',
      text: err.response.data.message,
      showConfirmButton: false,
      timer: 2000
    });
  }
};

if (updateUserForm) {
  updateUserForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.getElementById('btn-savedata').textContent = 'Updating...';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    await updateUser(name, email);
    document.getElementById('btn-savedata').textContent = 'Save Changes';
  });
}

const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3001/api/v1/users/update-password',
      data: {
        passwordCurrent,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'Success') {
      Swal.fire({
        icon: 'success',
        title: 'Password successfully updated!',
        showConfirmButton: false,
        timer: 2000
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Something not right!',
      text: err.response.data.message,
      showConfirmButton: false,
      timer: 2000
    });
  }
};

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.getElementById('btn-savepass').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('curr-pass').value;
    const password = document.getElementById('new-pass').value;
    const passwordConfirm = document.getElementById('pass-conf').value;
    await updatePassword(passwordCurrent, password, passwordConfirm);

    document.getElementById('btn-savepass').textContent = 'Save Changes';
    document.getElementById('curr-pass').value = '';
    document.getElementById('new-pass').value = '';
    document.getElementById('pass-conf').value = '';
  });
}
