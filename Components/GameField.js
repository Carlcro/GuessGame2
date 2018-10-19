import React, { Component } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView
} from "react-native";
import firebase from "react-native-firebase";

export default class GameField extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const game = navigation.state.params.item;
    this.ref = firebase.firestore().doc("games/" + game.key);

    this.state = {
      db: "",
      text: "",
      yourWord: "",
      player1: "",
      player2: "",
      wordHistory: []
    };
  }

  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.ref
      .get()
      .then(doc => {
        if (doc.exists) {
          const { player1, player2, wordHistory } = doc._data;
          this.setState({
            db: doc,
            text: "",
            yourWord: "",
            player1,
            player2,
            wordHistory,
            currentUser
          });
        } else {
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  isFirstGuesser = (user, wordHistory) => {
    const lastRound = wordHistory.slice(-1)[0];
    const ol = Object.keys(lastRound).length;

    return ol === 3;
  };

  isSecondGuesser = (user, wordHistory) => {
    const lastRound = wordHistory.slice(-1)[0];
    const ol = Object.keys(lastRound).length;

    return ol === 2 && !lastRound.hasOwnProperty(user);
  };

  onPress = () => {
    const { text, wordHistory, currentUser } = this.state;
    let newRound;

    if (this.isFirstGuesser(currentUser, wordHistory)) {
      newRound = {
        round: wordHistory.length + 2,
        [currentUser.uid]: text
      };
    } else if (this.isSecondGuesser(currentUser, wordHistory)) {
      newRound = {
        round: wordHistory.length + 1,
        [currentUser.uid]: text
      };
    } else return;

    const data = [...wordHistory, newRound];

    this.ref
      .update({
        wordHistory: data
      })
      .then(() => {
        this.setState({
          wordHistory: data
        });
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>
          <Text>Words in game with ID: {this.state.key} are currently</Text>
          <Text>
            Playing: {this.state.player1} and {this.state.player2}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <FlatList
              data={this.state.wordHistory}
              keyExtractor={item => item.round.toString()}
              renderItem={({ item }) => (
                <Text style={styles.currentWords}>
                  {item.round} {item[player1]} {item[player2]}
                </Text>
              )}
            />
          </View>
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
          <TouchableHighlight style={styles.button} onPress={this.onPress}>
            <Text> Guess new word </Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  currentWords: {
    fontWeight: "bold",
    fontSize: 30
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 20,
    margin: 20
  }
});
