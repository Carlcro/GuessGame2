import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import firebase from "react-native-firebase";

export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.getUser(user).then(currentUser => {
          this.props.navigation.navigate("Main", { currentUser });
        });
      }
      this.props.navigation.navigate("SignUp");
    });
  }

  getUser = user => {
    return firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
