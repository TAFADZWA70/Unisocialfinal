// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase configuration
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

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".btn"); // Select the login button

    if (loginButton) {
        loginButton.addEventListener("click", async () => {
            const emailInput = document.querySelector("input[type='email']");
            const passwordInput = document.querySelector("input[type='password']");
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                // Sign in user
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Retrieve user data from Firebase
                const userRef = ref(database, "users/" + user.uid);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const role = userData.role;

                    // Redirect based on role
                    if (role === "student") {
                        window.location.href = "StudentDashboard.html";
                    } else if (role === "tutor") {
                        window.location.href = "TutorDashboard.html";
                    } else if (role === "both") {
                        const choice = confirm("You have both roles. Click OK to go to StudentDashboard or Cancel for TutorDashboard.");
                        if (choice) {
                            window.location.href = "StudentDashboard.html";
                        } else {
                            window.location.href = "TutorDashboard.html";
                        }
                    } else {
                        alert("Invalid role. Please contact support.");
                    }
                } else {
                    alert("User data not found.");
                }
            } catch (error) {
                console.error("Error logging in:", error);
                alert("Error: " + error.message);
            }
        });
    } else {
        console.error("Login button not found.");
    }
});
