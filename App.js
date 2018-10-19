import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { SwitchNavigator } from "react-navigation";
// import the different screens
import Loading from "./Components/Loading";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Main from "./Components/Main";
import NewGame from "./Components/NewGame";
import GameField from "./Components/GameField";
import AddFriends from "./Components/AddFriends";

// create our app's navigation stack
const App = SwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Main,
    NewGame,
    GameField,
    AddFriends
  },
  {
    initialRouteName: "Loading"
  }
);
export default App;
