/* eslint-disable */
const signinForm = document.getElementById('sign-in');
const logoutBtn = document.getElementById('logout');
const mapBox = document.getElementById('map');
const customFile = document.querySelector('.custom-file-input');
const updateUserForm = document.getElementById('update-userdata');
const updatePasswordForm = document.getElementById('update-password');
const bookTourBtn = document.getElementById('book-btn');

const signin = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
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
    console.log(err.response.data);
    await Swal.fire({
      icon: 'error',
      title: err.response.data.message,
      confirmButtonText: 'Try Again'
    });

    document.getElementById('password').value = '';
  }
};

if (signinForm) {
  signinForm.addEventListener('submit', async el => {
    el.preventDefault();
    document.getElementById('btn-signin').textContent = 'SIGNING IN...';
    document.getElementById('btn-signin').classList.add('disabled');

    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;
    await signin(emailValue, passwordValue);

    document.getElementById('btn-signin').textContent = 'SIGN IN';
    document.getElementById('btn-signin').classList.remove('disabled');
  });
}

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
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

const updateSettings = async (data, type) => {
  const url =
    type === 'Data'
      ? '/api/v1/users/update-me'
      : '/api/v1/users/update-password';

  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'Success') {
      await Swal.fire({
        icon: 'success',
        title: `${type} updated successfully!`,
        showConfirmButton: false,
        timer: 2000
      });

      location.reload(true);
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

    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'Data');
    document.getElementById('btn-savedata').textContent = 'Save Changes';
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.getElementById('btn-savepass').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('curr-pass').value;
    const password = document.getElementById('new-pass').value;
    const passwordConfirm = document.getElementById('pass-conf').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'Password'
    );

    document.getElementById('btn-savepass').textContent = 'Save Changes';
    document.getElementById('curr-pass').value = '';
    document.getElementById('new-pass').value = '';
    document.getElementById('pass-conf').value = '';
  });
}

const bookTour = async tourId => {
  const stripe = Stripe('pk_test_xNV1ffQZPA2jN69xTWif014y00cGwyFMJy');
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong!',
      showConfirmButton: false,
      timer: 1500
    });
  }
};

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';

    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
