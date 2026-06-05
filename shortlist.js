import {
    auth,
    db,
    onAuthStateChanged,
    signOut,
    collection,
    getDocs,
    deleteDoc,
    doc
} from "./firebase-config.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadShortlist(user.uid);

    document.querySelectorAll("[data-sign-out]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            await signOut(auth);
            window.location.href = "login.html";
        });
    });

});

async function loadShortlist(uid) {

    const grid = document.getElementById("shortlist-grid");

    const snapshot = await getDocs(
        collection(db, "users", uid, "shortlist")
    );

    document.getElementById("shortlist-count").textContent =
        `${snapshot.size} items shortlisted`;

    grid.innerHTML = "";

    snapshot.forEach((docSnap) => {

        const item = docSnap.data();

        const card = document.createElement("div");

        card.className = "col-md-6 col-lg-4";

        card.innerHTML = `
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <h5>${item.name}</h5>
                    <p>$${item.price}</p>

                    <button
                        class="btn btn-danger w-100"
                        onclick="removeShortlist('${docSnap.id}')">
                        Remove
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

window.removeShortlist = async (itemId) => {

    const user = auth.currentUser;

    await deleteDoc(
        doc(db, "users", user.uid, "shortlist", itemId)
    );

    location.reload();
};
