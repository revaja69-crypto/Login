const dbName = "LocalAuthDB";
let db;

// Inisialisasi Database
const request = indexedDB.open(dbName, 1);
request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "email" });
    }
};
request.onsuccess = (e) => db = e.target.result;

let isLoginMode = true;

function toggleForm() {
    isLoginMode = !isLoginMode;
    document.getElementById('form-title').innerText = isLoginMode ? "Login" : "Daftar";
    document.getElementById('reg-fields').style.display = isLoginMode ? "none" : "block";
    document.getElementById('main-btn').innerText = isLoginMode ? "Masuk" : "Registrasi";
    document.getElementById('toggle-link').innerText = isLoginMode ? "Belum punya akun? Daftar" : "Sudah punya akun? Login";
}

function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isLoginMode) {
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        const getUser = store.get(email);

        getUser.onsuccess = () => {
            const user = getUser.result;
            if (user && user.password === password) {
                localStorage.setItem("userSession", JSON.stringify(user));
                location.href = "dashboard.html";
            } else {
                alert("Email atau password salah!");
            }
        };
    } else {
        const name = document.getElementById('name').value;
        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");
        const addUser = store.add({ email, password, name });

        addUser.onsuccess = () => {
            alert("Registrasi sukses! Silakan login.");
            toggleForm();
        };
        addUser.onerror = () => alert("Email sudah digunakan.");
    }
}
