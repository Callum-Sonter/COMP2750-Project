import { auth, signInWithEmailAndPassword } from "./firebase-config.js";
import { redirectIfSignedIn } from "./auth.js";

// Redirect users who are already logged in
redirectIfSignedIn();

// Login form elements
const form = document.querySelector("#loginForm");
const alertBox = document.querySelector("#loginAlert");


// Send email and password to Firebase Authentication
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    alertBox.classList.add("d-none");

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      // If sign-in succeeds, move the user to the welcome page
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (error) {
      // If sign-in fails, keep the user on the page and show feedback
      alertBox.textContent = "Sign-in failed. Check the email and password, then try again.";
      alertBox.classList.remove("d-none");
    }
  });
}