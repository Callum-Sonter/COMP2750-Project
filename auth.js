import { auth, onAuthStateChanged, signOut } from "./firebase-config.js";

// Protect pages that require a signed-in user
export function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    callback(user);
  });
}

// Keep signed-in users away from the login page
export function redirectIfSignedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "index.html";
    }
  });
}

// Connect all Sign Out buttons to Firebase sign-out
export function setupSignOutButtons() {
  document.querySelectorAll("[data-sign-out]").forEach((button) => {
    button.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "login.html";
    });
  });
}

// Display the current user on pages that show user details
export function showCurrentUser(user) {
  document.querySelectorAll("[data-user-email]").forEach((element) => {
    element.textContent = user.email;
  });

  document.querySelectorAll("[data-user-name]").forEach((element) => {
    element.textContent = displayNameFromEmail(user.email);
  });

  document.querySelectorAll("[data-user-initials]").forEach((element) => {
    element.textContent = initialsFromEmail(user.email);
  });
}

// Convert testuser1@mq.com into User 1 for a cleaner welcome page
function displayNameFromEmail(email) {
  const testUserMatch = email.match(/^testuser(\d+)@mq\.com$/i);

  if (testUserMatch) {
    return `User ${testUserMatch[1]}`;
  }

  return email.split("@")[0];
}

// Create short initials if a page ever needs a user avatar
function initialsFromEmail(email) {
  const name = email.split("@")[0] || "CM";
  const parts = name.replace(/[0-9]/g, "").split(/[._-]/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
