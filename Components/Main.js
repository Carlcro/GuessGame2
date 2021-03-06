import React from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import firebase from "react-native-firebase";
const MK = require("react-native-material-kit");

const { MKButton } = MK;

const ColoredRaisedButton = MKButton.coloredButton()
  .withBackgroundColor("#2196f3")
  .build();

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("games");
    this.unsubscribe = null;
    const { navigation } = this.props;
    const currentUser = navigation.state.params.currentUser.data();
    this.state = {
      games: [],
      currentUser
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  signOut = () => {
    firebase.auth().signOut();
  };

  onCollectionUpdate = querySnapshot => {
    const games = [];
    querySnapshot.forEach(doc => {
      const { player1, player2, wordHistory } = doc.data();
      if (
        this.state.currentUser.uid === player1 ||
        this.state.currentUser.uid === player2
      ) {
        games.push({
          key: doc.id,
          doc,
          player1,
          player2,
          wordHistory
        });
      }
    });
    this.setState({
      games,
      loading: false
    });
  };

  newGame() {
    const { currentUser } = this.state;

    this.ref
      .add({
        player1: currentUser.uid,
        player2: "Johanna",
        wordHistory: []
      })
      .then(ref => {
        const item = {
          key: ref.id,
          player1: currentUser.uid,
          player2: "Johanna",
          wordHistory: []
        };
        this.props.navigation.navigate("GameField", { item });
      });
  }

  render() {
    const { currentUser, games } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hi! {currentUser && currentUser.email}</Text>
        <Text style={styles.title}>Home</Text>
        {games.length > 0 && (
          <FlatList
            data={games}
            renderItem={({ item }) => (
              <ColoredRaisedButton
                style={styles.button}
                onPress={() =>
                  this.props.navigation.navigate("GameField", { item })
                }
              >
                <Text style={styles.buttonText}> {item.player2} </Text>
              </ColoredRaisedButton>
            )}
            keyExtractor={item => item.key}
          />
        )}
        <ColoredRaisedButton
          style={styles.button}
          onPress={() =>
            this.props.navigation.navigate("NewGame", { currentUser })
          }
        >
          <Text style={styles.buttonText}> NewGame </Text>
        </ColoredRaisedButton>
        <ColoredRaisedButton
          style={styles.button}
          onPress={() =>
            this.props.navigation.navigate("AddFriends", { currentUser })
          }
        >
          <Text style={styles.buttonText}> Add friends </Text>
        </ColoredRaisedButton>
        <ColoredRaisedButton style={styles.button} onPress={this.signOut}>
          <Text style={styles.buttonText}> Sign out </Text>
        </ColoredRaisedButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: 10,
    margin: 5
  },
  title: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 30
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#ffffff"
  }
});
