// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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

// Function to load user profile
const loadUserProfile = async (user) => {
    try {
        const userEmail = user.email; // Get logged-in user's email
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            let userData = null;

            // Find the user based on email
            Object.values(users).forEach((userEntry) => {
                if (userEntry.email === userEmail) {
                    userData = userEntry;
                }
            });

            if (userData) {
                // Get user details
                const fullName = `${userData.name} ${userData.surname}`;
                const studentId = userData.idPassport || "N/A";
                const school = userData.school || "Unknown";
                const year = userData.year || "N/A";

                // Update UI
                document.getElementById("user-name").textContent = fullName;
                document.getElementById("user-id").textContent = `Student ID: ${studentId}`;
                document.getElementById("user-school").textContent = `School: ${school}`;
                document.getElementById("user-year").textContent = `Year: ${year}`;
                document.getElementById("profile-icon").textContent = userData.name.charAt(0) + userData.surname.charAt(0);
            } else {
                console.warn("User data not found in database.");
            }
        } else {
            console.warn("No users found in database.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user);
    } else {
        console.warn("No user is logged in.");
        window.location.href = "Home.html"; // Redirect to login if not logged in
    }
});

// Logout function
const logoutUser = () => {
    signOut(auth)
        .then(() => {
            window.location.href = "Home.html"; // Redirect to login after logout
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
};
// Attach logout event
document.getElementById("logout").addEventListener("click", logoutUser);
document.getElementById("logout-dropdown").addEventListener("click", logoutUser);

