
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

import {
  doc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore';

const base = import.meta.env.BASE_URL;
const app = document.querySelector('#app');

app.innerHTML = `
  <div class="math-page">
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${base}">
          <span class="brand-mark">∑</span>
          <span class="brand-name">Interactive Mathematics</span>
        </a>

        <nav class="header-nav">
          <a href="${base}">Home</a>
          <a href="${base}free.html">Free</a>
          <a href="${base}premium.html">Premium</a>
        </nav>
      </div>
    </header>

    <main class="math-content"
      style="max-width:760px;margin:60px auto;padding:0 20px;">

      <a class="back-link" href="${base}">← Back to Home</a>

      <h1>Premium Mathematics</h1>
      <p>Sign in with Google to manage your premium access.</p>

      <section class="interactive-card"
        style="padding:30px;margin-top:28px;">

        <div id="auth-loading">
          Checking your account...
        </div>

        <div id="signed-out" hidden>
          <h2>Welcome to Premium Mathematics</h2>
          <p>Use your Google account to sign in.</p>

          <button
            id="google-login"
            class="btn btn-primary"
            type="button">
            Sign in with Google
          </button>
        </div>

        <div id="signed-in" hidden>
          <h2 id="welcome-message"></h2>
          <p id="user-email"></p>

          <p id="access-message" aria-live="polite">
            Checking premium approval...
          </p>

          <div id="premium-granted" hidden>
            <h3>Premium Access Granted</h3>
            <p>
              Your account has been approved for
              premium mathematics notes.
            </p>
          </div>

          <div id="premium-pending" hidden>
            <h3>Awaiting Premium Approval</h3>
            <p>
              Your Google account is connected.
              Premium access requires payment
              verification and administrator approval.
            </p>
          </div>

          <p id="admin-message" hidden>
            Administrator account
          </p>

          <button
            id="logout"
            class="btn btn-secondary"
            type="button">
            Sign out
          </button>
        </div>

        <p
          id="auth-error"
          role="alert"
          style="color:#b91c1c;">
        </p>
      </section>

      <div id="premium-library-root" hidden></div>

      <section
        id="premium-library"
        class="interactive-card"
        style="padding:30px;margin-top:28px;"
        hidden>

        <h2>Existing Premium Lessons</h2>

        <p>
          These lessons are preserved from your
          original premium collection.
        </p>

        <div id="premium-lessons" aria-live="polite"></div>
      </section>
    </main>
  </div>
`;

const $ = (selector) => document.querySelector(selector);

const loading = $('#auth-loading');
const signedOut = $('#signed-out');
const signedIn = $('#signed-in');
const errorMessage = $('#auth-error');

const accessMessage = $('#access-message');
const premiumGranted = $('#premium-granted');
const premiumPending = $('#premium-pending');
const adminMessage = $('#admin-message');

const premiumLibrary = $('#premium-library');
const premiumLessons = $('#premium-lessons');
const libraryRoot = $('#premium-library-root');

let accountCheck = 0;
let libraryInstance = null;

function hidePremiumLibrary() {
  libraryInstance?.destroy();
  libraryInstance = null;
  libraryRoot.hidden = true;
}

function showPremiumLibrary() {
  hidePremiumLibrary();
  libraryRoot.hidden = false;
  libraryInstance = createPremiumLibrary(libraryRoot, db);
}

function resetAccess() {
  premiumGranted.hidden = true;
  premiumPending.hidden = true;
  adminMessage.hidden = true;

  hidePremiumLibrary();

  premiumLibrary.hidden = true;
  premiumLessons.replaceChildren();

  accessMessage.textContent = '';
}

async function loadPremiumLessons(currentCheck) {
  premiumLessons.textContent = 'Loading premium lessons...';

  try {
    const lessonsRef = collection(db, 'premiumLessons');
    const snapshot = await getDocs(lessonsRef);

    if (currentCheck !== accountCheck) return;

    premiumLessons.replaceChildren();

    if (snapshot.empty) {
      premiumLessons.textContent =
        'No existing premium lessons are available yet.';
      return;
    }

    const lessons = snapshot.docs.map((lessonDoc) => ({
      id: lessonDoc.id,
      ...lessonDoc.data()
    }));

    lessons.sort((a, b) =>
      String(a.title || '').localeCompare(
        String(b.title || '')
      )
    );

    lessons.forEach((lesson) => {
      const article = document.createElement('article');

      article.style.cssText = `
        padding: 22px;
        margin-top: 18px;
        border: 1px solid #dbe4f0;
        border-radius: 14px;
        background: #ffffff;
      `;

      const title = document.createElement('h3');
      title.textContent = lesson.title || 'Untitled Lesson';
      title.style.marginTop = '0';

      const content = document.createElement('p');
      content.textContent = lesson.content || '';
      content.style.whiteSpace = 'pre-wrap';

      article.append(title, content);
      premiumLessons.append(article);
    });

  } catch (error) {
    if (currentCheck !== accountCheck) return;

    console.error('Premium lesson loading error:', error);

    premiumLessons.textContent =
      'Unable to load existing premium lessons. Please check your Firestore rules.';
  }
}

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

onAuthStateChanged(auth, async (user) => {
  const currentCheck = ++accountCheck;

  loading.hidden = true;
  errorMessage.textContent = '';

  resetAccess();

  signedOut.hidden = Boolean(user);
  signedIn.hidden = !user;

  if (!user) return;

  $('#welcome-message').textContent =
    `Welcome, ${user.displayName || 'Student'}!`;

  $('#user-email').textContent = user.email || '';

  accessMessage.textContent = 'Checking premium approval...';

  try {
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (currentCheck !== accountCheck) return;

    if (!snapshot.exists()) {
      accessMessage.textContent =
        'Premium access: Not approved';

      premiumPending.hidden = false;
      return;
    }

    const userData = snapshot.data();

    const isApproved = userData.premiumApproved === true;
    const isAdmin = userData.role === 'admin';

    if (isAdmin) {
      adminMessage.hidden = false;
    }

    if (isApproved) {
      accessMessage.textContent =
        'Premium access: Approved';

      premiumGranted.hidden = false;

      showPremiumLibrary();

      premiumLibrary.hidden = false;
      await loadPremiumLessons(currentCheck);

    } else {
      accessMessage.textContent =
        'Premium access: Not approved';

      premiumPending.hidden = false;
    }

  } catch (error) {
    if (currentCheck !== accountCheck) return;

    resetAccess();

    accessMessage.textContent =
      'Unable to verify premium access.';

    errorMessage.textContent =
      `Firestore error: ${error.message}`;
  }

}, (error) => {
  accountCheck++;
  loading.hidden = true;
  resetAccess();

  errorMessage.textContent =
    `Authentication error: ${error.message}`;
});
