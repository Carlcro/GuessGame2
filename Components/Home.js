import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  FlatList
} from "react-native";
export default class Home extends Component {
  static navigationOptions = {
    title: "Welcome"
  };

  state = {
    games: [
      {
        id: 1,
        teammate: "Johanna",
        wordHistory: [
          { round: 1, player1Word: "Walrus", player2Word: "Cow" },
          { round: 2, player1Word: "Tiger", player2Word: "Lion" }
        ]
      },
      {
        id: 2,
        teammate: "Emil",
        wordHistory: [{ round: 1, player1Word: "Walrus", player2Word: "Cow" }]
      },
      {
        id: 3,
        teammate: "Johan",
        wordHistory: [{ round: 1, player1Word: "Walrus", player2Word: "Cow" }]
      }
    ]
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <FlatList
          data={this.state.games}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate("GameField", { item })
              }
            >
              <Text> {item.teammate} </Text>
            </TouchableHighlight>
          )}
          keyExtractor={item => item.id.toString()}
        />
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate("NewGame")}
        >
          <Text> New Game</Text>
        </TouchableHighlight>
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
