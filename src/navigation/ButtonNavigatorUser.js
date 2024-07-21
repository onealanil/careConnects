import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Home from "../screens/RegularUser/Home";
import Explore from "../screens/RegularUser/Explore";
import Message from "../screens/RegularUser/Message";
import Fav from "../screens/RegularUser/Fav";
import Notification from "../screens/RegularUser/Notification";
import Post from "../screens/RegularUser/Post";
import ActualMessage from "../screens/GlobalComponents/ActualMessage";
import MyProfile from "../screens/CareGiver/MyProfile";
import EditProfile from "../screens/CareGiver/EditProfile";
import DocumentVerify from "../screens/GlobalComponents/DocumentVerify";
import PhoneVerification from "../screens/CareGiver/phoneVerify/PhoneVerification";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Payment from "../screens/RegularUser/Payment";

const Tab = createBottomTabNavigator();

const ButtonNavigatorUser = () => {
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
        name="Home_bottom"
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
        name="explore"
        component={Explore}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="explore" size={25} color={color} />
          ),
        }}
      />
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
        name="Fav"
        component={Fav}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={25} color={color} />
          ),
          tabBarBadge: 5,
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
        name="Post"
        component={Post}
        options={() => ({
          tabBarButton: () => null,
          tabBarVisible: false,
        })}
      />
      <Tab.Screen
        name="Actual_Message"
        component={ActualMessage}
        options={() => ({
          tabBarButton: () => null,
          tabBarVisible: false,
        })}
      />
      <Tab.Screen
        name="myProfile"
        component={MyProfile}
        options={() => ({
          tabBarButton: () => null,
          tabBarVisible: false,
        })}
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
      <Tab.Screen
        name="Payment"
        component={Payment}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="payment" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ButtonNavigatorUser;
