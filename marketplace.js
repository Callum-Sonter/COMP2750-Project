import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  collection,
  getDocs,
  doc
} from "./firebase-config.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }
  const uid = user.uid;
  document.querySelector('[data-sign-out]').onclick = async () => {
    await signOut(auth);
    location.href = "login.html";
  };

  const wrap = document.getElementById("itemsList");
  wrap.innerHTML = "";
  const allItems = await getDocs(collection(db, "items"));
  allItems.forEach(itemSnap => {
    const item = itemSnap.data();
    const docId = itemSnap.id;
    const priceShow = item.price === "Trade" ? "Trade" : `$${item.price}`;
    const imgDom = item.image ? `<img src="${item.image}" style="width:100%;height:180px;object-fit:cover;">` : `<div style="width:100%;height:180px;background:#eee;"></div>`;

    const cardWrap = document.createElement("div");
    cardWrap.style.width = "32%";
    cardWrap.style.float = "left";
    cardWrap.style.padding = "8px";
    cardWrap.innerHTML = `
    <div style="background:#fff;border:1px solid #ccc;">
        ${imgDom}
        <div style="padding:10px;">
            <h5 style="margin:4px 0;">${item.name}</h5>
            <p style="color:#555;margin:4px 0;font-size:14px;">${item.description}</p>
            <p style="font-weight:bold;margin:4px 0;">${priceShow}</p>
            <p style="font-size:13px;margin:4px 0;">Category: ${item.category}</p>
            <p style="font-size:13px;margin:4px 0;">Seller: ${item.sellerEmail.trim()}</p>
            <button class="addShortBtn" style="width:100%;background:#2563eb;color:#fff;border:0;padding:7px;margin-top:6px;cursor:pointer;">Add to Shortlist</button>
        </div>
    </div>`;
    wrap.appendChild(cardWrap);

    cardWrap.querySelector(".addShortBtn").addEventListener("click", async () => {
      const { setDoc } = await import("firebase/firestore");
      await setDoc(doc(db, "shortlist", `${uid}_${docId}`), { ...item, userId: uid, itemId: docId });
      alert("Added to Shortlist");
      location.href = "shortlist.html";
    });
  })
})
