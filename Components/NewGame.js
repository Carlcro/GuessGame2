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
  constructor() {
    super();
    this.ref = firebase.firestore().collection("games");
    this.unsubscribe = null;
    this.state = {
      games: []
    };

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const currentUser = user;
        this.state = { currentUser };
      }
    });
  }

  componentDidMount = () => {
    const friends = [
      {
        name: "Emil",
        uid: "asdasdasdasdasd"
      },
      {
        name: "Johan",
        uid: "qweqweqweqweqwe"
      }
    ];

    this.setState({ friends });
  };

  handleNewGame = friend => {
    const { currentUser } = this.state;
    console.log(currentUser);
    console.log(currentUser.uid);
    console.log(this.ref);

    firebase
      .firestore()
      .collection("games")
      .add({
        player1: currentUser.uid,
        player2: friend.uid,
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
              <Text> {item.name} </Text>
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
