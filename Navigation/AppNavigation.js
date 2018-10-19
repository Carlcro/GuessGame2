import { StackNavigator } from "react-navigation";
import GameField from "../Components/GameField";
import Home from "../Components/Home";
import SignUp from "../Components/SignUp";
import Login from "../Components/Login";
import Loading from "../Components/Loading";
import Main from "../Components/Main";
import NewGame from "../Components/NewGame";

//import styles from "./Styles/NavigationStyles";
import AddFriends from "../Components/AddFriends";

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    GameField: { screen: GameField },
    Home: { screen: Home },
    SignUp: { screen: SignUp },
    Login: { screen: Login },
    Loading: { screen: Loading },
    Main: { screen: Main },
    NewGame: { screen: NewGame },
    AddFriends: { screen: AddFriends }
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "Loading"
  }
);

export default PrimaryNav;

/*

,
    navigationOptions: {
      headerStyle: styles.header
    }
    */
