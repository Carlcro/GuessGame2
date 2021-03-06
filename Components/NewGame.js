import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableHighlight,
  StyleSheet
} from "react-native";
import firebase from "react-native-firebase";

export default class NewGame extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("games");
    this.unsubscribe = null;
    const { navigation } = this.props;
    const currentUser = navigation.state.params.currentUser;
    this.state = {
      games: [],
      currentUser
    };
  }

  async componentDidMount() {
    this.populateFriends();
  }

  async populateFriends() {
    var friends = [];
    const allUsers = await firebase
      .firestore()
      .collection("users")
      .get();
    allUsers.forEach(doc => {
      if (this.state.currentUser.friends.includes(doc.data().uid))
        friends.push(doc.data());
    });
    this.setState({ friends });
  }

  handleNewGame = friend => {
    const { currentUser } = this.state;
    firebase
      .firestore()
      .collection("games")
      .add({
        player1: currentUser.email,
        player2: friend.email,
        wordHistory: []
      })
      .then(ref => {
        const item = {
          key: ref.id,
          ...ref
        };
        this.props.navigation.navigate("GameField", { item });
      })
      .catch(console.log("error"));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Choose playing partner! </Text>
        <FlatList
          data={this.state.friends}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.handleNewGame(item)}
            >
              <Text> {item.email} </Text>
            </TouchableHighlight>
          )}
          keyExtractor={item => item.uid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    margin: 5,
    backgroundColor: "#b3ffb3"
  },
  title: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 30
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#99ccff"
  }
});
