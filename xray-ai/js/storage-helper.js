export function uploadXRay(file, userId, onProgress) {
    return new Promise(async (resolve, reject) => {
        try {
            const { ref, uploadBytesResumable, getDownloadURL } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js");

            if (!storage) {
                console.error("Firebase Storage instance not initialized. check firewall or credentials.");
                return reject(new Error("Firebase Storage uninitialized."));
            }

            const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            const storageRef = ref(storage, `xrays/${userId || "guest"}/${filename}`);
            const task = uploadBytesResumable(storageRef, file);

            task.on(
                "state_changed",
                (snapshot) => {
                    const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) onProgress(Math.round(pct));
                },
                (err) => {
                    console.error("Firebase Storage Error:", err);
                    reject(err);
                },
                async () => {
                    try {
                        const url = await getDownloadURL(task.snapshot.ref);
                        resolve(url);
                    } catch (urlErr) {
                        reject(urlErr);
                    }
                }
            );
        } catch (importErr) {
            console.error("Failed to load Firebase Storage SDK:", importErr);
            reject(new Error("Connectivity error: Could not load Firebase Storage."));
        }
    });
}
