import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "../screens/OnBoarding";
import Login from "../screens/loginSignup/Login";
import Signup from "../screens/loginSignup/Signup";
import ButtonNavigatorUser from "./ButtonNavigatorUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainHome from "../screens/MainHome";
import { useGlobalStore } from "../global/store"; // Make sure this path is correct
import OtpScreen from "../screens/loginSignup/Otpscreen";
import ButtonNavigatorCare from "./ButtonNavigatorCare";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
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
    <Stack.Screen
      name="OTP"
      component={OtpScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={MainHome}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="regular_user"
      component={ButtonNavigatorUser}
      options={{ headerShown: false }}
    />
        <Stack.Screen
      name="care_giver"
      component={ButtonNavigatorCare}
      options={{ headerShown: false }}
    />
   
  </Stack.Navigator>
);

const AppStack = () => {
  const [loading, setLoading] = React.useState(true);
  const { user, setUser } = useGlobalStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedCurrentUser = await AsyncStorage.getItem("currentUser");
        if (storedCurrentUser) {
          setUser(storedCurrentUser);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  if (loading) {
    return <Text>Loading.........</Text>;
  }

  return (
    <React.Fragment>{user ? <MainStack /> : <AuthStack />}</React.Fragment>
  );
};

export default AppStack;
