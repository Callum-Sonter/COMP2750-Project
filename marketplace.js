
// marketplace.js - Browse Items Page (Final)
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  loadAllMarketItems(user.uid);
});

async function loadAllMarketItems(currentUserId) {
  const itemsList = document.getElementById('itemsList');
  itemsList.innerHTML = '';

  const querySnapshot = await getDocs(collection(db, 'items'));

  querySnapshot.forEach((doc) => {
    const item = doc.data();
    if (item.sellerId === currentUserId) return;

    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="text-muted small">${item.description}</p>
          <p class="fw-bold mb-1">$${item.price}</p>
          <p class="small text-muted mb-2">Category: ${item.category}</p>
          <p class="small text-muted">Seller: ${item.sellerEmail}</p>
        </div>
        <div class="card-footer bg-white">
          <button class="btn btn-danger w-100" onclick="addToShortlist('${doc.id}', '${item.name}', '${item.price}')">
            Add to Shortlist
          </button>
        </div>
      </div>
    `;
    itemsList.appendChild(col);
  });
}

window.addToShortlist = async (itemId, name, price) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await setDoc(doc(db, 'users', user.uid, 'shortlist', itemId), {
      itemId, name, price
    });
    alert('Item added to your shortlist successfully!');
  } catch (err) {
    console.error('Error adding item to shortlist:', err);
  }
};

const signOutBtn = document.querySelector('[data-sign-out]');
if (signOutBtn) {
  signOutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'login.html';
  });
}
