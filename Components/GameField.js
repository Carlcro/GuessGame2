import React, { Component } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ToastAndroid
} from "react-native";
import firebase from "react-native-firebase";
const MK = require("react-native-material-kit");

const { MKTextField, MKButton, MKColor } = MK;

const Textfield = MKTextField.textfield()
  .withPlaceholder("Your word")
  .build();

const ColoredRaisedButton = MKButton.coloredButton()
  .withBackgroundColor(MKColor.Lime)
  .build();

export default class GameField extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const game = navigation.state.params.item;
    this.ref = firebase.firestore().doc("games/" + game.key);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const currentUser = user;
        this.state = { currentUser };
      }
    });

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
          const { player1, player2, wordHistory } = doc.data();
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

  renderWordHistory = wordHistory => {
    if (!wordHistory.length) return null;

    const lastRound = wordHistory[wordHistory.length - 1];
    if (!lastRound.hasOwnProperty(this.state.currentUser.email)) {
      wordHistory = wordHistory[wordHistory.length - 1];
    }

    return (
      wordHistory.length && (
        <View style={{ flexDirection: "row" }}>
          <FlatList
            data={wordHistory[wordHistory.length - 1]}
            keyExtractor={item => item.round.toString()}
            renderItem={({ item }) => (
              <Text style={styles.currentWords}>
                {item.round} {item[player1]} {item[player2]}
              </Text>
            )}
          />
        </View>
      )
    );
  };

  isFirstGuesser = wordHistory => {
    if (wordHistory === undefined || wordHistory.length == 0) {
      return true;
    }
    const lastRound = wordHistory.slice(-1)[0];
    const ol = Object.keys(lastRound).length;

    return ol === 3;
  };

  isSecondGuesser = (user, wordHistory) => {
    const lastRound = wordHistory.slice(-1)[0];
    const ol = Object.keys(lastRound).length;

    return ol === 2 && !lastRound.hasOwnProperty(user.email);
  };

  capitalizeFirstLetter = string => {
    string.trim();
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  isCorrectGuess = wordHistory => {
    const lastRound = wordHistory.slice(-1)[0];

    return lastRound[0] === lastRound[1];
  };

  onPress = () => {
    const { text, wordHistory, currentUser } = this.state;
    let newRound;
    let newHistory;

    const upperCaseText = this.capitalizeFirstLetter(text);

    this.setState({ text: upperCaseText });

    if (this.isFirstGuesser(wordHistory)) {
      newRound = {
        round: wordHistory.length + 1,
        [currentUser.email]: text
      };
      newHistory = [...wordHistory, newRound];
    } else if (this.isSecondGuesser(currentUser, wordHistory)) {
      newHistory = [...wordHistory];
      var last = newHistory[newHistory.length - 1];
      last[currentUser.email] = text;
    } else return;

    this.ref
      .update({
        wordHistory: newHistory
      })
      .then(() => {
        this.setState({
          wordHistory: newHistory,
          text: ""
        });
      })
      .then(() => {
        if (this.isCorrectGuess(wordHistory)) {
          ToastAndroid.showWithGravityAndOffset(
            "Samma ord! Ni vann :)!",
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
          );
        }
      });
  };

  render() {
    const { player1, player2, wordHistory, key } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>
          <Text>
            Playing: {player1} and {player2}
          </Text>
          {this.renderWordHistory(wordHistory)}

          <Textfield
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
          <ColoredRaisedButton style={styles.button} onPress={this.onPress}>
            <Text> Guess new word </Text>
          </ColoredRaisedButton>
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
    padding: 20,
    margin: 20
  }
});
