import { db } from "./firebase-config.js";

export async function saveScan(userId, imageURL, predictions, highestRisk, highestRiskDisease) {
    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const ref = await addDoc(collection(db, "scans"), {
        userId, imageURL, predictions, highestRisk, highestRiskDisease, createdAt: serverTimestamp(),
    });
    return ref.id;
}

export async function getUserScans(userId) {
    const { collection, query, where, orderBy, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const q = query(collection(db, "scans"), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getScan(scanId) {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const snap = await getDoc(doc(db, "scans", scanId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllScans() {
    const { collection, query, orderBy, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const q = query(collection(db, "scans"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getRecentScans(userId, n = 5) {
    const all = await getUserScans(userId);
    return all.slice(0, n);
}
