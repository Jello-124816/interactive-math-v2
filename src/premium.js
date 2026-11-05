
import './style.css';
import './free.css';
import './premium-library.css';

import { auth, googleProvider, db } from './firebase.js';
import { createPremiumLibrary } from './premium-library.js';

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';

const base = import.meta.env.BASE_URL;
const app = document.querySelector('#app');

app.innerHTML = `
  <div class="premium-page">
    <header class="site-header">
      <div class="container header-inner">
        <a href="${base}" class="brand">
          <span class="logo-placeholder">∑</span>
          <span class="brand-name">Interactive Mathematics</span>
        </a>

        <nav class="header-nav" aria-label="Main navigation">
          <a href="${base}">Home</a>
          <a href="${base}free.html">Free</a>
          <a href="${base}premium.html" aria-current="page">
            Premium
          </a>
        </nav>

        <div id="account-controls" class="account-controls" hidden>
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
      <a class="back-link" href="${base}">
        ← Back to Home
      </a>

      <div id="auth-loading">
        <p>Checking your account...</p>
      </div>

      <section id="signed-out" class="premium-auth-screen" hidden>
        <div class="library-heading">
          <h1>Premium Mathematics</h1>
          <p>
            Sign in with Google to access premium mathematics
            courses and interactive lessons.
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

      <section id="premium-pending" class="premium-auth-screen" hidden>
        <div class="library-heading">
          <h1>Premium Access Pending</h1>
          <p>
            Your Google account is connected, but premium
            access requires payment verification and
            administrator approval.
          </p>
        </div>

        <p id="pending-email"></p>
        <p id="pending-status">Premium access: Not approved</p>
      </section>

      <section id="premium-approved" hidden>
        <div id="premium-library-root"></div>
      </section>

      <p id="auth-error" role="alert" aria-live="polite"></p>
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
          <strong id="account-name">Student</strong>
          <p id="account-email"></p>
        </div>
      </div>

      <div class="account-setting-row">
        <span>Premium Access</span>
        <strong id="account-access">Checking...</strong>
      </div>

      <div class="account-setting-row">
        <span>Account Role</span>
        <strong id="account-role">Student</strong>
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
        <span>Interactive Mathematics</span>
        <span>Explore mathematics visually.</span>
      </div>
    </footer>
  </div>
`;

const $ = (selector) => document.querySelector(selector);

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

function closeAccountSettings() {
  accountPanel.hidden = true;
  accountButton.setAttribute('aria-expanded', 'false');
}

function openAccountSettings() {
  if (accountControls.hidden) return;

  accountPanel.hidden = false;
  accountButton.setAttribute('aria-expanded', 'true');
}

function hidePremiumLibrary() {
  libraryInstance?.destroy();
  libraryInstance = null;

  libraryRoot.replaceChildren();
  premiumApproved.hidden = true;
}

function showPremiumLibrary() {
  hidePremiumLibrary();

  premiumApproved.hidden = false;
  libraryInstance = createPremiumLibrary(libraryRoot, db);
}

function resetPage() {
  closeAccountSettings();
  hidePremiumLibrary();

  signedOut.hidden = true;
  premiumPending.hidden = true;
  accountControls.hidden = true;

  $('#account-name').textContent = 'Student';
  $('#account-email').textContent = '';
  $('#account-access').textContent = 'Checking...';
  $('#account-role').textContent = 'Student';
  $('#pending-email').textContent = '';

  const photo = $('#account-photo');
  photo.hidden = true;
  photo.removeAttribute('src');
}

function setAccountProfile(user) {
  $('#account-name').textContent =
    user.displayName || 'Student';

  $('#account-email').textContent = user.email || '';
  $('#pending-email').textContent = user.email || '';

  const photo = $('#account-photo');

  if (user.photoURL) {
    photo.src = user.photoURL;
    photo.hidden = false;
  } else {
    photo.hidden = true;
    photo.removeAttribute('src');
  }
}

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

$('#google-login').addEventListener('click', async () => {
  errorMessage.textContent = '';

  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    if (error.code !== 'auth/popup-closed-by-user') {
      errorMessage.textContent =
        `Google sign-in failed: ${error.message}`;
    }
  }
});

$('#logout').addEventListener('click', async () => {
  errorMessage.textContent = '';

  try {
    await signOut(auth);
  } catch (error) {
    errorMessage.textContent =
      `Sign-out failed: ${error.message}`;
  }
});

onAuthStateChanged(
  auth,
  async (user) => {
    const currentCheck = ++accountCheck;

    loading.hidden = true;
    errorMessage.textContent = '';

    resetPage();

    if (!user) {
      signedOut.hidden = false;
      return;
    }

    accountControls.hidden = false;
    setAccountProfile(user);

    premiumPending.hidden = false;
    $('#pending-status').textContent =
      'Checking premium approval...';

    try {
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);

      if (currentCheck !== accountCheck) return;

      if (!snapshot.exists()) {
        $('#account-access').textContent = 'Not Approved';
        $('#pending-status').textContent =
          'Premium access: Not approved';
        return;
      }

      const userData = snapshot.data();

      const isApproved =
        userData.premiumApproved === true;

      const isAdmin =
        userData.role === 'admin';

      $('#account-role').textContent =
        isAdmin ? 'Administrator' : 'Student';

      $('#account-access').textContent =
        isApproved ? 'Approved' : 'Not Approved';

      if (isApproved) {
        premiumPending.hidden = true;
        showPremiumLibrary();
      } else {
        $('#pending-status').textContent =
          'Premium access: Not approved';
      }

    } catch (error) {
      if (currentCheck !== accountCheck) return;

      hidePremiumLibrary();

      $('#account-access').textContent = 'Unavailable';
      $('#pending-status').textContent =
        'Unable to verify premium access.';

      console.error('Premium approval check failed:', error);

      errorMessage.textContent =
        'Unable to verify premium access. Please try again.';
    }
  },
  (error) => {
    accountCheck++;
    loading.hidden = true;

    resetPage();
    signedOut.hidden = false;

    console.error('Authentication error:', error);

    errorMessage.textContent =
      `Authentication error: ${error.message}`;
  }
);
