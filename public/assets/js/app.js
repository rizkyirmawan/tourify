/* eslint-disable */

const signinForm = document.getElementById('sign-in');
const logoutBtn = document.getElementById('logout');
const mapBox = document.getElementById('map');

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
  signinForm.addEventListener('submit', el => {
    el.preventDefault();
    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;
    signin(emailValue, passwordValue);
  });
}

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3001/api/v1/users/logout'
    });

    if (res.data.status === 'Success') location.reload(true);
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
