import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "../screens/OnBoarding";
import Login from "../screens/loginSignup/Login";
import Signup from "../screens/loginSignup/Signup";
import ButtonNavigatorUser from "./ButtonNavigatorUser";
// import DrawerStackUser from "./DrawerStackUser";

const AppStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen
        name="Onboarding"
        component={OnBoarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      {/* user  */}
      <Stack.Screen
        name="regular_user"
        component={ButtonNavigatorUser}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
