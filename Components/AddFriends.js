import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableHighlight
} from "react-native";
import firebase from "react-native-firebase";

export default class AddFriends extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const user = navigation.state.params.currentUser;

    this.ref = firebase
      .firestore()
      .collection("users")
      .doc(user.uid);

    this.state = {
      currentUser: user,
      allUsers: []
    };
  }

  async componentDidMount() {
    await this.ref.get().then(doc => {
      this.setState({
        currentFriends: doc.data().friends,
        currentUser: doc.data()
      });
    });
    await this.populateFriends();
  }

  async populateFriends() {
    var allUsers = [];
    const querySnapshot = await firebase
      .firestore()
      .collection("users")
      .get();
    querySnapshot.forEach(doc => {
      if (
        doc.data().uid !== this.state.currentUser.uid &&
        !this.state.currentFriends.includes(doc.data().uid)
      )
        allUsers.push(doc.data());
    });
    this.setState({ allUsers });
  }

  addFriend = friend => {
    const { currentFriends } = this.state;
    if (!currentFriends.includes(friend)) {
      this.ref.update({
        friends: [...currentFriends, friend]
      });
      const nonFriends = this.state.allUsers;
      const allUsers = nonFriends.filter(u => u.uid !== friend);
      this.setState({
        currentFriends: [...currentFriends, friend],
        allUsers
      });
    }
  };

  render() {
    return (
      <View>
        <Text>Add friends</Text>
        <View style={{ flexDirection: "row" }}>
          <FlatList
            data={this.state.allUsers}
            keyExtractor={item => item.uid}
            renderItem={({ item }) => (
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.addFriend(item.uid)}
              >
                <Text> {item.email} </Text>
              </TouchableHighlight>
            )}
          />
        </View>
      </View>
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
