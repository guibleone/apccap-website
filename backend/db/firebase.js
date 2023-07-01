const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAmpqoo0p5yv8ppgMNRJv3lCjDo5gs756Q",
  authDomain: "igcachaca.firebaseapp.com",
  projectId: "igcachaca",
  storageBucket: "igcachaca.appspot.com",
  messagingSenderId: "622320382750",
  appId: "1:622320382750:web:371c5a69fb9932cc850f0f"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const storage = getStorage(app);

module.exports = { storage }