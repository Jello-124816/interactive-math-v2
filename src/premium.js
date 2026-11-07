
import './style.css';
import './free.css';
import './premium-library.css';

import {
  auth,
  googleProvider,
  db
} from './firebase.js';

import {
  createPremiumLibrary
} from './premium-library.js';

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import {
  doc,
  getDoc
} from 'firebase/firestore';

const base = import.meta.env.BASE_URL;
const app = document.querySelector('#app');

// -------------------------------------
// Premium course configuration
// -------------------------------------

const PREMIUM_COURSES = {
  algebra: {
    id: 'algebra',
    title: 'Algebra'
  },

  geometry: {
    id: 'geometry',
    title: 'Geometry'
  },

  'sat-math': {
    id: 'sat-math',
    title: 'SAT Math Practices'
  },

  'interactive-visualizations': {
    id: 'interactive-visualizations',
    title: 'Interactive Visualizations'
  }
};

// Read the selected course from the URL.
const params = new URLSearchParams(
  window.location.search
);

const courseId = params.get('course');
const selectedCourse = PREMIUM_COURSES[courseId];

// -------------------------------------
// Page layout
// -------------------------------------

app.innerHTML = `
  <div class="premium-page">

    <header class="site-header">
      <div class="container header-inner">

        <a
          href="${base}"
          class="brand"
          aria-label="Mathematics home"
        >
          <span
            class="logo-placeholder"
            aria-hidden="true"
          >∑</span>

          <span class="brand-name">
            Mathematics
          </span>
        </a>

        <nav
          class="header-nav"
          aria-label="Main navigation"
        >
          <a href="${base}">Home</a>

          <a href="${base}free.html">
            Explore
          </a>

          <a href="${base}#about">
            About
          </a>

          <a href="${base}account.html">
            Account
          </a>
        </nav>

        <div
          id="account-controls"
          class="account-controls"
          hidden
        >
          <button
            id="account-settings-button"
            class="account-settings-button"
            type="button"
            aria-expanded="false"
            aria-controls="account-settings-panel"
          >
            ⚙ Account
          </button>
        </div>

      </div>
    </header>

    <main class="library-page container">

      <a
        class="back-link"
        href="${base}free.html"
        style="
          display: inline-flex;
          align-items: center;
          color: #2563eb;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
        "
      >
        ← Back to Courses
      </a>

      <div id="auth-loading">
        <p>Checking your account...</p>
      </div>

      <section
        id="signed-out"
        class="premium-auth-screen"
        hidden
      >
        <div class="library-heading">
          <h1>
            ${selectedCourse
              ? `${selectedCourse.title} Premium`
              : 'Premium Mathematics'}
          </h1>

          <p>
            Sign in with Google to access this
            Premium mathematics course.
          </p>
        </div>

        <button
          id="google-login"
          class="btn btn-primary"
          type="button"
        >
          Sign in with Google
        </button>
      </section>

      <section
        id="premium-pending"
        class="premium-auth-screen"
        hidden
      >
        <div class="library-heading">
          <h1>
            Premium Access Required
          </h1>

          <p id="pending-description">
            This course requires individual
            administrator approval.
          </p>
        </div>

        <p id="pending-email"></p>

        <p id="pending-status">
          Checking Premium access...
        </p>
      </section>

      <section
        id="premium-approved"
        hidden
      >
        <div id="premium-library-root"></div>
      </section>

      <p
        id="auth-error"
        role="alert"
        aria-live="polite"
      ></p>

    </main>

    <div
      id="account-settings-panel"
      class="account-settings-panel"
      hidden
    >
      <div class="account-settings-heading">

        <h2>Account Settings</h2>

        <button
          id="close-account-settings"
          type="button"
          aria-label="Close account settings"
        >
          ×
        </button>

      </div>

      <div class="account-profile">

        <img
          id="account-photo"
          class="account-photo"
          alt="Google profile"
          hidden
        />

        <div>
          <strong id="account-name">
            Student
          </strong>

          <p id="account-email"></p>
        </div>

      </div>

      <div class="account-setting-row">
        <span>Premium Access</span>
        <strong id="account-access">
          Checking...
        </strong>
      </div>

      <div class="account-setting-row">
        <span>Account Role</span>
        <strong id="account-role">
          Student
        </strong>
      </div>

      <button
        id="logout"
        class="account-logout"
        type="button"
      >
        Sign Out
      </button>

    </div>

    <footer class="site-footer">
      <div class="container footer-inner">
        <span>
          © ${new Date().getFullYear()} Mathematics
        </span>

        <span>
          Learn. Practice. Understand.
        </span>
      </div>
    </footer>

  </div>
`;

// -------------------------------------
// DOM elements
// -------------------------------------

const $ = (selector) =>
  document.querySelector(selector);

const loading = $('#auth-loading');

const signedOut = $('#signed-out');
const premiumPending = $('#premium-pending');
const premiumApproved = $('#premium-approved');

const errorMessage = $('#auth-error');

const libraryRoot = $('#premium-library-root');

const accountControls = $('#account-controls');
const accountButton = $('#account-settings-button');
const accountPanel = $('#account-settings-panel');
const closeAccountButton = $('#close-account-settings');

let accountCheck = 0;
let libraryInstance = null;

// -------------------------------------
// Account settings
// -------------------------------------

function closeAccountSettings() {
  accountPanel.hidden = true;

  accountButton.setAttribute(
    'aria-expanded',
    'false'
  );
}

function openAccountSettings() {
  if (accountControls.hidden) return;

  accountPanel.hidden = false;

  accountButton.setAttribute(
    'aria-expanded',
    'true'
  );
}

// -------------------------------------
// Premium Library
// -------------------------------------

function hidePremiumLibrary() {
  libraryInstance?.destroy();
  libraryInstance = null;

  libraryRoot.replaceChildren();
  premiumApproved.hidden = true;
}

function showPremiumLibrary() {
  if (!selectedCourse) return;

  hidePremiumLibrary();

  premiumApproved.hidden = false;

  // Pass only the selected course.
  libraryInstance = createPremiumLibrary(
    libraryRoot,
    db,
    selectedCourse.id
  );
}

// -------------------------------------
// Reset account page
// -------------------------------------

function resetPage() {
  closeAccountSettings();
  hidePremiumLibrary();

  signedOut.hidden = true;
  premiumPending.hidden = true;

  accountControls.hidden = true;

  $('#account-name').textContent =
    'Student';

  $('#account-email').textContent = '';

  $('#account-access').textContent =
    'Checking...';

  $('#account-role').textContent =
    'Student';

  $('#pending-email').textContent = '';

  const photo = $('#account-photo');

  photo.hidden = true;
  photo.removeAttribute('src');
}

// -------------------------------------
// Google profile
// -------------------------------------

function setAccountProfile(user) {
  $('#account-name').textContent =
    user.displayName || 'Student';

  $('#account-email').textContent =
    user.email || '';

  $('#pending-email').textContent =
    user.email || '';

  const photo = $('#account-photo');

  if (user.photoURL) {
    photo.src = user.photoURL;
    photo.hidden = false;
  } else {
    photo.hidden = true;
    photo.removeAttribute('src');
  }
}

// -------------------------------------
// Account settings events
// -------------------------------------

accountButton.addEventListener('click', () => {
  if (accountPanel.hidden) {
    openAccountSettings();
  } else {
    closeAccountSettings();
  }
});

closeAccountButton.addEventListener(
  'click',
  closeAccountSettings
);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeAccountSettings();
  }
});

document.addEventListener('click', (event) => {
  if (accountPanel.hidden) return;

  if (
    !accountPanel.contains(event.target) &&
    !accountButton.contains(event.target)
  ) {
    closeAccountSettings();
  }
});

// -------------------------------------
// Google sign-in
// -------------------------------------

$('#google-login').addEventListener(
  'click',
  async () => {
    errorMessage.textContent = '';

    try {
      await signInWithPopup(
        auth,
        googleProvider
      );
    } catch (error) {
      if (
        error.code !==
        'auth/popup-closed-by-user'
      ) {
        console.error(
          'Google sign-in error:',
          error
        );

        errorMessage.textContent =
          `Google sign-in failed: ${error.message}`;
      }
    }
  }
);

// -------------------------------------
// Sign out
// -------------------------------------

$('#logout').addEventListener(
  'click',
  async () => {
    errorMessage.textContent = '';

    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        'Google sign-out error:',
        error
      );

      errorMessage.textContent =
        `Sign-out failed: ${error.message}`;
    }
  }
);

// -------------------------------------
// Authentication and course approval
// -------------------------------------

onAuthStateChanged(
  auth,

  async (user) => {
    const currentCheck = ++accountCheck;

    loading.hidden = true;
    errorMessage.textContent = '';

    resetPage();

    // Invalid or missing course URL.
    if (!selectedCourse) {
      premiumPending.hidden = false;

      $('#pending-description').textContent =
        'Please select a Premium course from the Explore page.';

      $('#pending-status').textContent =
        'No valid course selected.';

      return;
    }

    // User not signed in.
    if (!user) {
      signedOut.hidden = false;
      return;
    }

    accountControls.hidden = false;
    setAccountProfile(user);

    premiumPending.hidden = false;

    $('#pending-description').textContent =
      `Checking access to ${selectedCourse.title} Premium.`;

    $('#pending-status').textContent =
      'Checking course approval...';

    try {
      const userRef = doc(
        db,
        'users',
        user.uid
      );

      const snapshot = await getDoc(userRef);

      // Ignore outdated authentication requests.
      if (currentCheck !== accountCheck) return;

      if (!snapshot.exists()) {
        $('#account-access').textContent =
          'Not Approved';

        $('#pending-status').textContent =
          'Your account has no approval record. Contact the administrator.';

        return;
      }

      const userData = snapshot.data();

      const isAdmin =
        userData.role === 'admin';

      const approvedCourses =
        userData.approvedCourses &&
        typeof userData.approvedCourses === 'object'
          ? userData.approvedCourses
          : {};

      // Check only the requested course.
      const isApproved =
        isAdmin ||
        approvedCourses[selectedCourse.id] === true;

      $('#account-role').textContent =
        isAdmin
          ? 'Administrator'
          : 'Student';

      $('#account-access').textContent =
        isApproved
          ? `${selectedCourse.title}: Approved`
          : `${selectedCourse.title}: Not Approved`;

      if (isApproved) {
        premiumPending.hidden = true;

        showPremiumLibrary();
      } else {
        $('#pending-description').textContent =
          `Your account does not have Premium access to ${selectedCourse.title}.`;

        $('#pending-status').textContent =
          'Please complete the required payment and contact the administrator for approval.';
      }

    } catch (error) {
      if (currentCheck !== accountCheck) return;

      hidePremiumLibrary();

      $('#account-access').textContent =
        'Unavailable';

      $('#pending-status').textContent =
        'Unable to verify Premium access.';

      console.error(
        'Premium approval check failed:',
        error
      );

      errorMessage.textContent =
        'Unable to verify Premium access. Please try again.';
    }
  },

  (error) => {
    accountCheck++;

    loading.hidden = true;

    resetPage();

    signedOut.hidden = false;

    console.error(
      'Authentication error:',
      error
    );

    errorMessage.textContent =
      `Authentication error: ${error.message}`;
  }
);
