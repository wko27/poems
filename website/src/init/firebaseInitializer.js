import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const CONFIG = {
  apiKey: "AIzaSyA3xcW2cb5f0AcMsecSiqYX5Uirfuok1Jo",
  authDomain: "poetry-1457a.firebaseapp.com",
  databaseURL: "https://poetry-1457a-default-rtdb.firebaseio.com",
  projectId: "poetry-1457a",
  storageBucket: "poetry-1457a.appspot.com",
  messagingSenderId: "568982216293",
  appId: "1:568982216293:web:6b2ba79cc36032384cf08c",
  measurementId: "G-R3WJZLG2LW"
};

/** Initialize Firebase with the default database */
export function initializeFirebase() {
  initializeApp(CONFIG);

  const analytics = getAnalytics();
  
  logEvent(analytics, 'page_loaded');

  console.log('Initialized Firebase');
}
