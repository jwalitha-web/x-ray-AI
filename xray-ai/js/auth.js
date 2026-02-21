import { auth, db } from "./firebase-config.js";

// Guest profile for Sign-in-free access
const GUEST_PROFILE = {
    uid: "guest_chief_medical_officer",
    name: "Chief Medical Officer",
    email: "cmo@xray-ai.agency",
    role: "doctor",
    isGuest: true
};

export async function loginUser(email, password) {
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

export async function logoutUser() {
    const { signOut } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    return signOut(auth);
}

export async function getUserProfile(uid) {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : GUEST_PROFILE;
}

export function onAuthChange(callback) {
    // Return guest profile if not logged into Firebase
    const { onAuthStateChanged } = window.__firebaseAuth || {};
    if (onAuthStateChanged && auth) {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                callback(user);
            } else {
                callback(GUEST_PROFILE);
            }
        });
    }

    // Immediate fallback to guest
    setTimeout(() => callback(GUEST_PROFILE), 0);
    return () => { };
}
