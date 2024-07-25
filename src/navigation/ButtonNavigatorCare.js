import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Feather from "react-native-vector-icons/Feather";
import Home from "../screens/CareGiver/Home";
import MyProfile from "../screens/CareGiver/MyProfile";
import EditProfile from "../screens/CareGiver/EditProfile";
import DocumentVerify from "../screens/GlobalComponents/DocumentVerify";
import PhoneVerification from "../screens/CareGiver/phoneVerify/PhoneVerification";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ActualMessage from "../screens/GlobalComponents/ActualMessage";
import Message from "../screens/RegularUser/Message";
import Post from "../screens/RegularUser/Post";
import Notification from "../screens/RegularUser/Notification";
import { useMessageStore } from "../global/MessageCount";
import { useNotificationCount } from "../global/NotificationCount";
import Reviews from "../screens/CareGiver/Review";

const Tab = createBottomTabNavigator();

const ButtonNavigatorCare = () => {
  const messageCount = useMessageStore(state => state.messageCount);
  const notificationCount = useNotificationCount(
    state => state.notificationCount,
  );

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
        name="Message"
        component={Message}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="message-circle" size={25} color={color} />
          ),
          tabBarBadge: messageCount > 0 ? messageCount : undefined,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notification}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={25} color={color} />
          ),
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined,
        }}
      />
       <Tab.Screen
        name="reviews"
        component={Reviews}
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
        name="Actual_Message"
        component={ActualMessage}
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
        name="Post"
        component={Post}
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
