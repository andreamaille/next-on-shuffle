import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDuTCV6q-STDeYeH75CRP0fCxAQOaSLOp0",
    authDomain: "next-on-shuffle.firebaseapp.com",
    databaseURL: "https://next-on-shuffle.firebaseio.com",
    projectId: "next-on-shuffle",
    storageBucket: "next-on-shuffle.appspot.com",
    messagingSenderId: "812406334305",
    appId: "1:812406334305:web:0698567276d72ea0"
};

firebase.initializeApp(config);

export default firebase;

