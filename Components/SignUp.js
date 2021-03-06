import React from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import firebase from "react-native-firebase";

export default class SignUp extends React.Component {
  state = { email: "", password: "", errorMessage: null };
  handleSignUp = () => {
    firebase
      .auth()
      .createUserAndRetrieveDataWithEmailAndPassword(
        this.state.email,
        this.state.password
      )
      .then(user => {
        this.createUser(user);
      })
      .then(user => this.props.navigation.navigate("Main", { user }))
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  createUser = ({ user }) => {
    return firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        email: user.email,
        emailVerified: user.emailVerified,
        uid: user.uid,
        friends: []
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TextInput
          secureTextEntry
          placeholder="Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate("Login")}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8
  }
});
