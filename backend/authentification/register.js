import { database } from "/backend/database/database.js";

const auth = firebase.auth();


const register_btn = document.getElementById('register_btn');

register_btn.addEventListener('click', function() {
    register();
});


function register() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is not good');
      return;
    }
    if (validate_field(username) == false) {
      alert('Please enter an username');
      return;
    }
  
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(async function(response) {
      const { user } = response;
  
      // Add this user to Firebase Database
      const database_ref = database.ref();
  
      // Create User data
      const user_data = {
        email : email,
        username : username,
        profilepicture : "",
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      await database_ref.child('users/' + user.uid).set(user_data);
  
      console.log("lidee")
  
      // Set cookie expiration time to 1 day from now
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);
  
      // Store user's auth token in a cookie
      document.cookie = `auth_token=${user.uid}; expires=${expires}; path=/`;
  
      // Redirect to dashboard page
      window.location.href = "/frontend/pages/dashboard.html";
    })
    .catch(function(error) {
      const error_message = error.message;
      alert(error_message);
    });
}

function validate_email(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function validate_password(password) {
    return password.length >= 5;
}
function validate_field(field) {
    if (field === "") {
      return false;
    }
    return true;
  }