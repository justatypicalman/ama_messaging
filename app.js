// Import the necessary Firebase functions
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

// Initialize Firebase (make sure you have initialized the app in your index.html)
const db = getFirestore(); // Initialize Firestore
const auth = getAuth(); // Initialize Auth

const userList = document.getElementById("user-list");

// Fetch users with approval status of "0" or "0.5"
async function fetchUsers() {
  try {
    const usersQuery = query(
      collection(db, "users"),
      where("approved", "in", ["0", "0.5"])
    );
    const querySnapshot = await getDocs(usersQuery);
    userList.innerHTML = ""; // Clear existing users

    querySnapshot.forEach((doc) => {
      const user = doc.data();
      const userId = doc.id;
      const userName = `${user.fName} ${user.lName}`;
      const userEmail = user.email;
      const userApproved = user.approved;

      // Create a card for each user
      const userCard = document.createElement("div");
      userCard.className = "user-card";

      const approvalStatus =
        userApproved === "0" ? "Not Approved" : "Pending Approval";
      const statusClass = userApproved === "0" ? "rejected" : "approved";

      userCard.innerHTML = `
        <h3>${userName}</h3>
        <p>Email: ${userEmail}</p>
        <p>Status: <span class="${statusClass}">${approvalStatus}</span></p>
        <button onclick="approveUser('${userId}')">Approve</button>
        <button onclick="rejectUser('${userId}')">Reject</button>
      `;

      userList.appendChild(userCard);
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
}

// Approve user
async function approveUser(userId) {
  try {
    await updateDoc(doc(db, "users", userId), {
      approved: "1",
    });
    alert("User approved");
    fetchUsers(); // Reload the user list
  } catch (error) {
    console.error("Error approving user: ", error);
  }
}

// Reject user
async function rejectUser(userId) {
  try {
    await updateDoc(doc(db, "users", userId), {
      approved: "0",
    });
    alert("User rejected");
    fetchUsers(); // Reload the user list
  } catch (error) {
    console.error("Error rejecting user: ", error);
  }
}

// Fetch users when the page loads
window.onload = fetchUsers;
