import firebase from "react-native-firebase";

export function getUsers() {
  return firebase
    .firestore()
    .collection("users")
    .get();
}

export function getCurrentUser() {
  return firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth.currentUser.uid)
    .get();
}
