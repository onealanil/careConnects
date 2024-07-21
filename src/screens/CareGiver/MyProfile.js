import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { useGlobalStore } from "../../global/store";
import {
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import IconIcons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyProfile = () => {
  const user = useGlobalStore((state) => state.user);
  const navigation = useNavigation();

  const [averageRating, setAverageRating] = React.useState(0);
  const [isFetchAverageRating, setIsFetchAverageRating] = React.useState(false);

  const handleLogout = async() => {
    await AsyncStorage.removeItem("currentUser");
    useGlobalStore.setState({ user: null });
    navigation.navigate('Login');
  }

  return (
    <React.Fragment>
      <View
        className="w-[100%] flex flex-col"
        style={{ padding: responsiveHeight(2), marginTop: responsiveHeight(5) }}
      >
        {/* for profile pic and simple details */}
        <View className="flex flex-row gap-x-5 items-center">
          {/* profile pic  */}
          <View>
            <Image
              source={{ uri: user?.profilePic.url }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 100 / 2,
                overflow: "hidden",
                borderWidth: 2,
                borderColor: "#79AC78",
              }}
            />
          </View>
          {/* simple details start */}
          <View
            className="flex flex-col gap-y-2"
            style={{ width: responsiveWidth(60) }}
          >
            <View className="flex flex-row gap-x-2 items-center">
              <Text
                className="text-black"
                style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: responsiveHeight(3),
                }}
              >
                {user?.username}
              </Text>
              {user?.isDocumentVerified === "verified" && (
                <MaterialIcons name="verified" size={20} color={"green"} />
              )}
            </View>
            <View>
              <Text
                className="text-black"
                style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: responsiveHeight(1.5),
                }}
              >
                {user?.title || "Edit your title"}
              </Text>
            </View>
            <View className="flex flex-row gap-x-1">
              {/* star  */}
              <IconIcons
                name="star"
                size={17}
                color={`${averageRating > 0 ? "#E2EA3B" : "gray"}`}
              />
              <Text
                className="text-black"
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: responsiveHeight(2),
                }}
              >
                {isFetchAverageRating ? (
                  <Text className="text-color2">Loading...</Text>
                ) : (
                  averageRating?.toFixed(1) || 0
                )}
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
              {user?.bio || "Edit your bio"}
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
                {user?.location || "Edit your location"}
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
          <TouchableOpacity onPress={()=> navigation.navigate("EditProfile")}>
            <View className="py-2 px-5 bg-black rounded-md flex flex-row items-center gap-x-1">
              <FontAwesome name="edit" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: responsiveHeight(1.75),
                  color: "white",
                }}
              >
                Edit Profile
              </Text>
            </View>
          </TouchableOpacity>
          <View className="py-2 px-5 bg-black rounded-md flex flex-row items-center gap-x-1">
            {/* <FontAwesome name="share-square-o" size={17} color="white" /> */}
            <Text
              className=""
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: responsiveHeight(1.75),
                color: "white",
              }}
            >
              Share Profile
            </Text>
          </View>
          <TouchableOpacity onPress={()=> navigation.navigate("settings")}>
            <View className="py-2 px-3 bg-black rounded-md flex flex-row items-center gap-x-1">
              <IconIcons name="settings" size={17} color={"white"} />
            </View>
          </TouchableOpacity>
        </View>

        {/* assigned to details started  */}


       {/* assigned to details ended */}


        {/* other details */}
        <View className="mt-6 pr-[-3px]">
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
            {user?.about_me === "" ? (
              <Text
                className="text-red-500"
                style={{
                  fontSize: responsiveScreenFontSize(1.5),
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: responsiveHeight(2),
                }}
              >
                {user?.role === "job_seeker" ? (
                  <>
                    Complete your profile to unlock more job opportunities and
                    increase your chances of getting hired. Click on "Edit
                    Profile" now to get started!
                  </>
                ) : (
                  <>
                    Enhance your profile to attract more freelancers near you.
                    Click on "Edit Profile" now to complete your profile and
                    connect with top talents!
                  </>
                )}
              </Text>
            ) : (
              <Text
                className="text-black tracking-wide mb-3"
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: responsiveHeight(1.75),
                }}
              >
                {user?.about_me}
              </Text>
            )}

            <View className="border-red-500 border-solid border-[1px] mr-2 py-1 px-2 rounded-md items-center justify-center">
              <Text
                className="text-black tracking-wide"
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: responsiveHeight(1.75),
                }}
              >
                {user?.email}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout}>
          <View className="py-3 px-5 bg-black rounded-md flex flex-row items-center gap-x-1 mt-6 justify-center">
            <AntDesign name="logout" size={17} color="white" />
            <Text
              className=""
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: responsiveHeight(1.75),
                color: "white",
              }}
            >
              Log Out
            </Text>
          </View>
          </TouchableOpacity>
        </View>
      </View>
    </React.Fragment>
  );
};

export default MyProfile;
