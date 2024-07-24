import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useCallback } from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import IconIcons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalStore } from "../../global/store";
import { useRoute } from "@react-navigation/native";
import { MessageStore } from "./helper/MessageStore";
import { UserStore } from "../CareGiver/helper/UserStore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Post = () => {
  const navigation = useNavigation();
  const { user, checkAuth } = useGlobalStore();
  const route = useRoute();
  const singleUserData = route?.params?.item;
  const focused = useIsFocused();
  console.log(singleUserData, "this is single user data");
  console.log(user?.fav, "this is user fav");

  //save
  const [isPostSaved, setIsPostSaved] = React.useState(false);

  const [isRequesting, setIsRequesting] = React.useState(false);

  const backPressHandler = () => {
    // go back
    navigation.navigate("Home_bottom");
  };

  const handleLogoutFunction = async () => {
    await AsyncStorage.removeItem("currentUser");
    useGlobalStore.setState({ user: null });
    navigation.navigate("Login");
  };

  //send message handler
  const sendMessageHandler = async (conversationId) => {
    const newValues = {
      conversationId: conversationId,
      msg: `I want to ask something about your service, Will you please reply!.`,
      recipientId: singleUserData?._id,
    };
    const response = await MessageStore.getState().createMessage(newValues);
    if (response) {
      navigation.navigate("Actual_Message", {
        conversation_id: conversationId,
      });
    }
  };

  //send request handler
  const sendRequestHandler = async () => {
    setIsRequesting(true);
    const newValues = {
      senderId: user?._id,
      receiverId: singleUserData?._id,
    };
    const response = await MessageStore.getState().createConversation(
      newValues
    );
    if (response) {
      sendMessageHandler(response?.conversation._id.toString());
    }
    setIsRequesting(false);
  };

  React.useEffect(() => {
    if (user && user?.fav.includes(singleUserData?._id) && focused) {
      console.log(singleUserData?._id, "this is id");
      setIsPostSaved(true);
    }
    if (user && !user?.fav.includes(singleUserData?._id) && focused) {
      setIsPostSaved(false);
    }
  }, [focused]);

  //handle save
  const saveHandler = useCallback(async () => {
    try {
      const res = await UserStore.getState().saveUser(singleUserData?._id);
      if (res) {
        setIsPostSaved(true);
        checkAuth();
        await UserStore.getState().getSaveUser();
      }
    } catch (error) {
      ErrorToast(error.toString().replace("[Error: ", "").replace("]", ""));
    }
  }, []);

  const unSaveHandler = useCallback(async () => {
    try {
      const res = await UserStore.getState().unSaveUser(singleUserData?._id);
      setIsPostSaved(false);
      await checkAuth();
      await UserStore.getState().getSaveUser();
    } catch (error) {
      ErrorToast(error.toString().replace("[Error: ", "").replace("]", ""));
    }
  }, []);

  return (
    <SafeAreaView style={{ marginTop: responsiveHeight(5) }}>
      <View
        className="w-[100%] flex flex-col"
        style={{ padding: responsiveHeight(2) }}
      >
        {/* back button */}
        <TouchableOpacity onPress={backPressHandler}>
          <View className="mb-2 flex flex-row items-center gap-x-2">
            <IconIcons name="arrow-back" size={30} color="gray" />
            <Text
              className="text-gray-500"
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: responsiveHeight(2),
              }}
            >
              Back
            </Text>
          </View>
        </TouchableOpacity>
        {/* for profile pic and simple details */}
        <View className="flex flex-row gap-x-5 items-center">
          {/* profile pic  */}
          <View>
            {singleUserData && singleUserData?.profilePic && (
              <Image
                source={{ uri: singleUserData?.profilePic?.url }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100 / 2,
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: "#79AC78",
                }}
              />
            )}
          </View>
          {/* simple details start */}
          <View
            className="flex flex-col gap-y-2"
            style={{ width: responsiveWidth(60) }}
          >
            <View className="flex flex-row items-center gap-x-2">
              <Text
                className="text-black"
                style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: responsiveHeight(3),
                }}
              >
                {singleUserData?.username}
              </Text>
              <MaterialIcon name="verified" size={20} color={"green"} />
              {isPostSaved ? (
                <TouchableOpacity onPress={unSaveHandler}>
                  <MaterialIcons name="favorite" size={25} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={saveHandler}>
                  <MaterialIcons name="favorite" size={25} color="gray" />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex flex-row gap-x-1">
              {/* star  */}
              <IconIcons
                name="star"
                size={17}
                // color={`${averageRating > 0 ? "#E2EA3B" : "gray"}`}
                color="#E2EA3B"
              />
              <Text
                className="text-black"
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: responsiveHeight(2),
                }}
              >
                {/* {isFetchAverageRating ? (
                  <Text className="text-color2">Loading...</Text>
                ) : (
                  averageRating?.toFixed(1) || 0
                )} */}
                4.5
              </Text>
            </View>
            {/* bio */}
            <Text
              className="text-black tracking-wide leading-5"
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: responsiveHeight(1.75),
              }}
            >
              {singleUserData?.bio || (
                <Text
                  className="text-red-500"
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: responsiveHeight(1.75),
                  }}
                >
                  No bio
                </Text>
              )}
            </Text>
            <View className="flex flex-row gap-x-1">
              <IconIcons name="location-outline" size={17} color="#79AC78" />
              <Text
                className="text-black"
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: responsiveHeight(1.75),
                }}
              >
                {singleUserData?.location || (
                  <Text
                    className="text-red-500"
                    style={{
                      fontFamily: "Montserrat-Bold",
                      fontSize: responsiveHeight(1.75),
                    }}
                  >
                    No location
                  </Text>
                )}
              </Text>
            </View>
          </View>
          {/* simple details end  */}
        </View>
        {/* buttons  */}
        <View
          className="flex flex-row items-center justify-between gap-x-2"
          style={{ marginTop: responsiveHeight(4) }}
        >
          <TouchableOpacity onPress={sendRequestHandler}>
            <View className="py-2 px-5 bg-black rounded-md flex flex-row items-center gap-x-1">
              <Feather name="message-circle" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: responsiveHeight(1.75),
                  color: "white",
                }}
              >
                {isRequesting ? "Requesting..." : "Request"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View className="py-2 px-5 bg-black rounded-md flex flex-row items-center gap-x-1">
              <IconIcons name="call-outline" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: responsiveHeight(1.75),
                  color: "white",
                }}
              >
                Call
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogoutFunction}>
            <View className="py-2 px-5 bg-black rounded-md flex flex-row items-center gap-x-1">
              <MaterialIcon name="unfold-more" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: responsiveHeight(1.75),
                  color: "white",
                }}
              >
                More
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* other details */}
        <View className="mt-6 flex flex-col gap-y-3">
          {/* about me  */}
          <View className="flex flex-col gap-y-2">
            <Text
              className="text-black"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveHeight(2),
              }}
            >
              About me
            </Text>
            <Text
              className="text-black tracking-wide"
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: responsiveHeight(1.75),
              }}
            >
              {singleUserData?.about_me || (
                <Text
                  className="text-red-500"
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: responsiveHeight(1.75),
                  }}
                >
                  No about me
                </Text>
              )}
            </Text>
          </View>
          {/* Education  */}
          <View className="flex flex-col gap-y-2">
            <Text
              className="text-black"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveHeight(2),
              }}
            >
              Education
            </Text>
            <Text
              className="text-black tracking-wide"
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: responsiveHeight(1.75),
              }}
            >
              {(singleUserData?.education &&
                `I have completed my ${singleUserData?.education}`) || (
                <Text
                  className="text-red-500"
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: responsiveHeight(1.75),
                  }}
                >
                  No education added
                </Text>
              )}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Post;
