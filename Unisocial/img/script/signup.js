// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYp6Nid0s4KmlRGuffSRZImQgOjv9g2dE",
    authDomain: "mthengi-f68af.firebaseapp.com",
    databaseURL: "https://mthengi-f68af-default-rtdb.firebaseio.com",
    projectId: "mthengi-f68af",
    storageBucket: "mthengi-f68af.firebasestorage.app",
    messagingSenderId: "117237350920",
    appId: "1:117237350920:web:57b4194dcd99226262c7bd",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Wait for DOM to load before running script
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signup-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById("name").value;
        const surname = document.getElementById("surname").value;
        const dob = document.getElementById("dob").value;
        const idPassport = document.getElementById("idPassport").value;
        const address = document.getElementById("address").value;
        const school = document.getElementById("school").value;
        const year = document.getElementById("year").value;
        const role = document.getElementById("role").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const errorMessage = document.getElementById("error-message");

        // Validate passwords
        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match!";
            return;
        }

        try {
            // Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user info in Firebase Realtime Database
            await set(ref(database, "users/" + user.uid), {
                name: name,
                surname: surname,
                dob: dob,
                idPassport: idPassport,
                address: address,
                school: school,
                year: year,
                role: role,
                email: email
            });

            alert("Sign up successful!");
            window.location.href = "Login.html"; // Redirect to login page
        } catch (error) {
            console.error("Error signing up:", error);
            errorMessage.textContent = "Error: " + error.message;
        }
    });
});


