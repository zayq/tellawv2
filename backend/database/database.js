const firebaseConfig = {
    apiKey: "AIzaSyDab5Cvd-G9xYIgOT_QmQxNH4UkC0tBxbg",
    authDomain: "fizayd.firebaseapp.com",
    databaseURL: "https://fizayd-default-rtdb.firebaseio.com",
    projectId: "fizayd",
    storageBucket: "fizayd.appspot.com",
    messagingSenderId: "1004076659044",
    appId: "1:1004076659044:web:506e9c9349633618a00a71",
    measurementId: "G-LERF9B01WB"
  };

firebase.initializeApp(firebaseConfig);
export const database = firebase.database()