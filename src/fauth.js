// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxsjCe49HK_Q73yZuQaNbp6OX-LPh2GCE",
  authDomain: "sample-a3149.firebaseapp.com",
  projectId: "sample-a3149",
  storageBucket: "sample-a3149.appspot.com",
  messagingSenderId: "42731830070",
  appId: "1:42731830070:web:f4c60b04a4ab9c53571197"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signup = document.getElementById("submitSignUp");
signup.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;

  const auth = getAuth();
  const db = getFirestore();
  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Send email verification
      sendEmailVerification(user)
        .then(() => {
          showMessage('Verification email sent. Please check your inbox.', 'signUpMessage');
          
          // Wait for the user to verify email before saving data
          // (Optionally you can store a temporary record until they verify)
          auth.onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
              const userdata = {
                email: email,
                fname: fname,
                lname: lname
              };

              const docRef = doc(db, "users", user.uid);
              setDoc(docRef, userdata)
                .then(() => {
                  window.location.href = "./index.html";
                })
                .catch((error) => {
                  console.error("Error writing document", error);
                });
            }
          });
        })
        .catch((error) => {
          console.error("Error sending email verification", error);
          showMessage('Unable to send verification email. Please try again.', 'signUpMessage');
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email address already in use', 'signUpMessage');
      } else {
        showMessage('Unable to create user', 'signUpMessage');
      }
    });
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        showMessage('Login successful', 'signInMessage');
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = './Login/loginS.html';
      } else {
        showMessage('Please verify your email before logging in.', 'signInMessage');
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Incorrect email or password', 'signInMessage');
      } else {
        showMessage('Account does not exist', 'signInMessage');
      }
    });
});
