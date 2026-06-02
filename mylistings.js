import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  collection,
  query,
  where,
  getDocs
} from "./firebase-config.js";

onAuthStateChanged(auth, async (user) => {
  // Redirect if not signed in
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Show user email in navbar
  document.querySelectorAll("[data-user-email]").forEach((el) => {
    el.textContent = user.email;
  });

  // Sign out button
  document.querySelectorAll("[data-sign-out]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "login.html";
    });
  });

  // Fetch only this user's items from Firestore
  try {
    const q = query(collection(db, "items"), where("sellerId", "==", user.uid));
    const snapshot = await getDocs(q);

    // Hide spinner
    document.getElementById("loading-spinner").classList.add("d-none");

    if (snapshot.empty) {
      document.getElementById("empty-state").classList.remove("d-none");
      document.getElementById("listing-count").textContent = "0 items listed";
      return;
    }

    document.getElementById("listing-count").textContent =
      `${snapshot.size} item${snapshot.size !== 1 ? "s" : ""} listed`;

    const grid = document.getElementById("listings-grid");

    snapshot.forEach((docSnap) => {
      const item = docSnap.data();

      // Handle trade items
      const isTrade = !item.price || item.price === "Trade" || item.price === 0;
      const priceDisplay = isTrade ? "Trade" : `$${item.price}`;

      // Handle image falls back to placeholder if missing
      const imgHtml = item.image
  ? `<img src="images/${item.image}" class="card-img-top" style="height:180px; object-fit:cover;" alt="${item.name}"
       onerror="this.style.background='#e0e0e0'">`
  : `<div style="height:180px; background:#e0e0e0;"></div>`;
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.innerHTML = `
        <div class="card shadow-sm h-100">
          ${imgHtml}
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="text-muted small">${item.description}</p>
            <p class="fw-bold mb-1">${priceDisplay}</p>
            <p class="small text-muted mb-1">Category: ${item.category}</p>
            <p class="small text-muted mb-0">Seller: ${item.sellerEmail}</p>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });

  } catch (error) {
    document.getElementById("loading-spinner").classList.add("d-none");
    document.getElementById("listing-count").textContent = "Error loading listings.";
    console.error("Error fetching listings:", error);
  }
});