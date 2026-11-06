
import './style.css';

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';

import {
  doc,
  onSnapshot
} from 'firebase/firestore';

import {
  auth,
  googleProvider,
  db
} from './firebase.js';

const base = import.meta.env.BASE_URL;
const app = document.querySelector('#app');

const courses = [
  { id: 'algebra', title: 'Algebra' },
  { id: 'geometry', title: 'Geometry' },
  { id: 'sat-math', title: 'SAT Math Practices' }
];

app.innerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a href="${base}" class="brand" aria-label="Mathematics home">
        <span class="logo-placeholder" aria-hidden="true">∑</span>
        <span class="brand-name">Mathematics</span>
      </a>

      <nav class="header-nav" aria-label="Main navigation">
        <a href="${base}">Home</a>
        <a href="${base}free.html">Explore</a>
        <a href="${base}#about">About</a>
        <a href="${base}account.html" aria-current="page">Account</a>
      </nav>
    </div>
  </header>

  <main class="container" style="padding-top: 40px; padding-bottom: 100px;">

    <a
      href="${base}"
      style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 34px;
        color: #2563eb;
        font-weight: 600;
        font-size: 16px;
        text-decoration: none;
      "
    >
      ← Back to Home
    </a>

    <div class="section-heading">
      <span class="eyebrow">YOUR LEARNING ACCOUNT</span>
      <h1>Account</h1>
      <p>
        Sign in to manage your account and access
        approved premium mathematics courses.
      </p>
    </div>

    <div style="
      max-width: 560px;
      margin: 36px auto 0;
      padding: 36px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);
    ">
      <div style="text-align: center;">
        <div style="
          width: 64px;
          height: 64px;
          margin: 0 auto 18px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          border-radius: 50%;
          font-size: 28px;
        ">👤</div>

        <h2 style="margin-bottom: 12px;">Welcome</h2>

        <p style="color: #64748b; line-height: 1.7;">
          Use your Google account to access your learning profile.
          Premium mathematics courses require individual
          administrator approval.
        </p>

        <button
          id="google-sign-in"
          type="button"
          class="btn btn-primary"
          style="margin-top: 22px;"
          disabled
        >
          Checking account...
        </button>

        <button
          id="google-sign-out"
          type="button"
          class="btn btn-outline"
          style="margin-top: 22px; display: none;"
        >
          Sign out
        </button>

        <p
          id="account-message"
          role="status"
          aria-live="polite"
          style="
            margin-top: 18px;
            font-size: 14px;
            color: #64748b;
          "
        ></p>

        <div
          id="account-details"
          style="
            display: none;
            margin-top: 24px;
            text-align: left;
            padding: 18px;
            background: #f8fafc;
            border-radius: 12px;
          "
        >
          <h3 style="margin-bottom: 14px;">Your Profile</h3>

          <p>
            <strong>Name:</strong>
            <span id="account-name"></span>
          </p>

          <p style="margin-top: 10px;">
            <strong>Email:</strong>
            <span id="account-email"></span>
          </p>
        </div>
      </div>

      <div style="
        margin-top: 30px;
        padding-top: 24px;
        border-top: 1px solid #e2e8f0;
      ">
        <h3 style="margin-bottom: 12px;">Premium Access</h3>

        <p style="color: #64748b; line-height: 1.7;">
          Premium mathematics courses are available
          with administrator approval.
          Access is granted individually for each course.
        </p>

        <p style="margin-top: 16px;">
          <strong>Account status:</strong>
          <span id="premium-status">Checking...</span>
        </p>

        <p
          id="approval-message"
          style="
            margin-top: 12px;
            color: #64748b;
            font-size: 14px;
            line-height: 1.6;
          "
        >
          Sign in to view your account information.
        </p>

        <div
          id="course-approvals"
          style="display: none; margin-top: 24px;"
        >
          <h3 style="margin-bottom: 16px;">
            Your Premium Courses
          </h3>

          <div id="course-approval-list"></div>
        </div>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <span>© ${new Date().getFullYear()} Mathematics</span>
      <span>Learn. Practice. Understand.</span>
    </div>
  </footer>
`;

const signInButton = document.querySelector('#google-sign-in');
const signOutButton = document.querySelector('#google-sign-out');

const accountMessage = document.querySelector('#account-message');
const accountDetails = document.querySelector('#account-details');

const accountName = document.querySelector('#account-name');
const accountEmail = document.querySelector('#account-email');

const accountStatus = document.querySelector('#premium-status');
const approvalMessage = document.querySelector('#approval-message');

const courseApprovals = document.querySelector('#course-approvals');
const courseApprovalList = document.querySelector('#course-approval-list');

let stopUserListener = null;

function clearUserListener() {
  if (stopUserListener) {
    stopUserListener();
    stopUserListener = null;
  }
}

function hideApprovals() {
  courseApprovals.style.display = 'none';
  courseApprovalList.replaceChildren();
}

function showApprovals(approvedCourses, isAdmin) {
  courseApprovalList.replaceChildren();

  for (const course of courses) {
    const approved =
      isAdmin || approvedCourses[course.id] === true;

    const row = document.createElement('div');

    row.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid #e2e8f0;
    `;

    const title = document.createElement('span');
    title.textContent = course.title;

    const status = document.createElement('span');
    status.textContent = approved
      ? 'Approved'
      : 'Not approved';

    status.style.cssText = `
      font-weight: 600;
      font-size: 14px;
      color: ${approved ? '#15803d' : '#64748b'};
    `;

    row.append(title, status);
    courseApprovalList.append(row);
  }

  courseApprovals.style.display = 'block';
}

onAuthStateChanged(
  auth,

  (user) => {
    clearUserListener();
    hideApprovals();

    if (!user) {
      signInButton.style.display = 'inline-flex';
      signInButton.disabled = false;
      signInButton.textContent = 'Sign in with Google';

      signOutButton.style.display = 'none';
      accountDetails.style.display = 'none';

      accountName.textContent = '';
      accountEmail.textContent = '';

      accountStatus.textContent = 'Not signed in';
      accountMessage.textContent = '';

      approvalMessage.textContent =
        'Sign in to view your account information.';

      return;
    }

    signInButton.style.display = 'none';
    signOutButton.style.display = 'inline-flex';
    signOutButton.disabled = false;

    accountDetails.style.display = 'block';

    accountName.textContent =
      user.displayName || 'Not provided';

    accountEmail.textContent =
      user.email || 'Not provided';

    accountMessage.textContent =
      'Successfully signed in with Google.';

    accountStatus.textContent = 'Checking permissions...';
    approvalMessage.textContent = 'Loading course approvals...';

    const userReference = doc(db, 'users', user.uid);

    stopUserListener = onSnapshot(
      userReference,

      (snapshot) => {
        if (!snapshot.exists()) {
          hideApprovals();

          accountStatus.textContent = 'Account setup pending';

          approvalMessage.textContent =
            'Your account has no Firestore profile yet. Contact the administrator to request access.';

          return;
        }

        const data = snapshot.data();

        const isAdmin = data.role === 'admin';

        const approvedCourses =
          data.approvedCourses &&
          typeof data.approvedCourses === 'object'
            ? data.approvedCourses
            : {};

        accountStatus.textContent = isAdmin
          ? 'Administrator'
          : 'Student';

        approvalMessage.textContent = isAdmin
          ? 'Administrator access is enabled.'
          : 'Your course approvals are shown below.';

        showApprovals(approvedCourses, isAdmin);
      },

      (error) => {
        console.error('Firestore profile error:', error);

        hideApprovals();

        accountStatus.textContent =
          'Unable to load permissions';

        approvalMessage.textContent =
          'Could not read your account permissions. Please try again later.';
      }
    );
  },

  (error) => {
    clearUserListener();
    hideApprovals();

    signInButton.style.display = 'inline-flex';
    signInButton.disabled = false;
    signInButton.textContent = 'Sign in with Google';

    signOutButton.style.display = 'none';

    accountStatus.textContent =
      'Authentication unavailable';

    accountMessage.textContent =
      `Authentication error: ${error.message}`;
  }
);

signInButton.addEventListener('click', async () => {
  signInButton.disabled = true;

  accountMessage.textContent =
    'Opening Google sign-in...';

  try {
    await signInWithPopup(auth, googleProvider);

  } catch (error) {
    console.error('Google sign-in error:', error);

    if (error.code === 'auth/popup-closed-by-user') {
      accountMessage.textContent =
        'Google sign-in was cancelled.';

    } else if (error.code === 'auth/popup-blocked') {
      accountMessage.textContent =
        'Your browser blocked the sign-in popup. Allow popups and try again.';

    } else if (error.code === 'auth/unauthorized-domain') {
      accountMessage.textContent =
        'This website domain is not authorized in Firebase Authentication.';

    } else {
      accountMessage.textContent =
        `Google sign-in failed: ${error.message}`;
    }

  } finally {
    signInButton.disabled = false;
  }
});

signOutButton.addEventListener('click', async () => {
  signOutButton.disabled = true;

  accountMessage.textContent =
    'Signing out...';

  try {
    await signOut(auth);

  } catch (error) {
    console.error('Google sign-out error:', error);

    accountMessage.textContent =
      `Sign-out failed: ${error.message}`;

  } finally {
    signOutButton.disabled = false;
  }
});
