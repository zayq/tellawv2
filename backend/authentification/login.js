import { database } from "/backend/database/database.js";

const auth = firebase.auth();

const login_btn = document.getElementById('login-btn');

login_btn.addEventListener('click', function() {
  login();
});


function login() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is not good');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
    .then(function(response) {
        const { user } = response;

        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        // Store user's auth token in a cookie
        document.cookie = `auth_token=${user.uid}; expires=${expires}; path=/`;

        // Redirect to dashboard page
        window.location.href = "/frontend/pages/dashboard/dashboard.html";
    })
    .catch(function(error) {
        // Firebase will use this to alert of its errors
        const error_code = error.code;
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