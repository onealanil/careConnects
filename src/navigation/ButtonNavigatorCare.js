import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Feather from "react-native-vector-icons/Feather";
import Home from "../screens/CareGiver/Home";
import Message from "../screens/CareGiver/Message";
import Notification from "../screens/CareGiver/Notification";
import MyProfile from "../screens/CareGiver/MyProfile";
import EditProfile from "../screens/CareGiver/EditProfile";
import DocumentVerify from "../screens/GlobalComponents/DocumentVerify";
import PhoneVerification from "../screens/CareGiver/phoneVerify/PhoneVerification";
import Review from "../screens/CareGiver/Review";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

const ButtonNavigatorCare = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarInactiveBackgroundColor: "#fff",
        tabBarActiveTintColor: "black",
      }}
    >
      <Tab.Screen
        name="Home_bottom_care"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={25} color={color} />
          ),
        }}
      >
        {/* {props => <Home {...props} bottomNavigation={props.navigation} />} */}
      </Tab.Screen>
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="message-circle" size={25} color={color} />
          ),
          tabBarBadge: 2,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notification}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={25} color={color} />
          ),
          tabBarBadge: 6,
        }}
      />
       <Tab.Screen
        name="reviews"
        component={Review}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="reviews" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="myProfile"
        component={MyProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="circle-user" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EditProfile"
        component={EditProfile}
        options={() => ({
          tabBarButton: () => null,
          tabBarVisible: false,
        })}
      />
      <Tab.Screen
        name="settings"
        component={DocumentVerify}
        options={() => ({
          tabBarButton: () => null,
          tabBarVisible: false,
        })}
      />
      <Tab.Screen
        name="phoneVerify"
        component={PhoneVerification}
        options={() => ({
          tabBarButton: () => null,
          tabBarVisible: false,
        })}
      />

    </Tab.Navigator>
  );
};

export default ButtonNavigatorCare;
