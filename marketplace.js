import { db, auth } from './firebase-config.js';
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const itemsList = document.getElementById('itemsList');

// 确保用户已登录
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadAllItems();
  }
});

// 从 Firebase 读取所有商品
async function loadAllItems() {
  try {
    const querySnapshot = await getDocs(collection(db, "items"));
    itemsList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const item = doc.data();
      renderItem(item);
    });
  } catch (e) {
    console.error("Error loading items: ", e);
  }
}

// 渲染商品到页面
function renderItem(item) {
  const col = document.createElement('div');
  col.className = 'col-md-4';

  col.innerHTML = `
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">${item.description}</p>
        <p class="text-primary fw-bold">$${item.price}</p>
        <button class="btn btn-danger w-100">Add to Shortlist</button>
      </div>
    </div>
  `;

  itemsList.appendChild(col);
}
