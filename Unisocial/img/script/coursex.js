// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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
        const userEmail = user.email;
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            let userData = null;

            Object.values(users).forEach((userEntry) => {
                if (userEntry.email === userEmail) {
                    userData = userEntry;
                }
            });

            if (userData) {
                const fullName = `${userData.name} ${userData.surname}`;
                const studentId = userData.idPassport || "N/A";
                const school = userData.school || "Unknown";
                const year = userData.year || "N/A";

                document.getElementById("user-name").textContent = fullName;
                document.getElementById("user-id").textContent = `Student ID: ${studentId}`;
                document.getElementById("user-school").textContent = `School: ${school}`;
                document.getElementById("user-year").textContent = `Year: ${year}`;
                document.getElementById("profile-icon").textContent = userData.name.charAt(0) + userData.surname.charAt(0);
            } else {
                console.warn("User data not found in database.");
            }
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

// Function to load courses (topics) for the logged-in user
const loadUserCourses = async (userEmail) => {
    try {
        const topicsRef = ref(database, "Topics");
        const snapshot = await get(topicsRef);

        const coursesContainer = document.getElementById("courses-container");
        coursesContainer.innerHTML = ""; // Clear any existing courses

        if (snapshot.exists()) {
            const topics = snapshot.val();
            let userTopics = [];

            // Filter topics manually based on userEmail
            Object.values(topics).forEach((topic) => {
                if (topic.email === userEmail) {
                    userTopics.push(topic);
                }
            });

            if (userTopics.length > 0) {
                userTopics.forEach((topic) => {
                    const courseElement = document.createElement("div");
                    courseElement.classList.add("course");
                    courseElement.innerHTML = `
                        <h3>${topic.name}</h3>
                        <p>${topic.description}</p>
                        <p><strong>Faculty:</strong> ${topic.faculty}</p>
                        <p><strong>School Offering:</strong> ${topic.schoolOffering}</p>
                    `;
                    coursesContainer.appendChild(courseElement);
                });
            } else {
                coursesContainer.innerHTML = "<p>No courses found.</p>";
            }
        } else {
            coursesContainer.innerHTML = "<p>No courses found.</p>";
        }
    } catch (error) {
        console.error("Error fetching user courses:", error);
    }
};

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user);
        loadUserCourses(user.email); // Load topics for the logged-in user
    } else {
        console.warn("No user is logged in.");
        window.location.href = "Home.html"; // Redirect to home if not logged in
    }
});

// Logout function
const logoutUser = () => {
    signOut(auth)
        .then(() => {
            window.location.href = "Home.html"; // Redirect to home after logout
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
};

// Event listener for logout buttons
document.getElementById("logout").addEventListener("click", logoutUser);
document.getElementById("logout-dropdown").addEventListener("click", logoutUser);

// Function to add topic
const addTopic = async (topicData) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const userEmail = user.email;

            const topicsRef = ref(database, "Topics");

            await push(topicsRef, {
                ...topicData,
                email: userEmail,
                timestamp: new Date().toISOString()
            });

            alert("Topic added successfully!");
            loadUserCourses(userEmail); // Reload courses after adding a new one
        } else {
            console.error("User is not authenticated.");
        }
    } catch (error) {
        console.error("Error adding topic:", error);
    }
};

// Handle Add Topic form submission
document.getElementById("add-topic-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const topicName = document.getElementById("topic-name").value;
    const topicDescription = document.getElementById("topic-description").value;
    const schoolOffering = document.getElementById("school-offering").value;
    const faculty = document.getElementById("faculty-dropdown").value;

    const topicData = {
        name: topicName,
        description: topicDescription,
        schoolOffering: schoolOffering,
        faculty: faculty,
    };

    addTopic(topicData);

    const addTopicModal = document.getElementById("add-topic-modal");
    addTopicModal.style.display = "none";
});

// Modal functionality for adding topics
const modal = document.getElementById("add-topic-modal");
const addTopicBtn = document.getElementById("add-topic-btn");
const closeModal = document.querySelector(".close");

// Open modal
addTopicBtn.onclick = function () {
    modal.style.display = "block";
}

// Close modal
closeModal.onclick = function () {
    modal.style.display = "none";
}

// Close modal when clicked outside
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
