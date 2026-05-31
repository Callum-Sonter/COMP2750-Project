import { requireAuth, setupSignOutButtons, showCurrentUser } from "./auth.js";

// Welcome page setup for signed-in users
requireAuth((user) => {
  showCurrentUser(user);
  setupSignOutButtons();
});
