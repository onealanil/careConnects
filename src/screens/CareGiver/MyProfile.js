import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { useGlobalStore } from "../../global/store";
import {
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconIcons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalStatus from "../../components/ModalStatus";
import * as ImagePicker from "expo-image-picker";
import { axios_auth } from "../../global/config";
import { SuccessToast } from "../../components/SuccessToast";
import { ErrorToast } from "../../components/ErrorToast";
import { UserStore } from "./helper/UserStore";

const MyProfile = () => {
  const { user, checkAuth } = useGlobalStore();
  const navigation = useNavigation();
  const focused = useIsFocused();

  const [averageRating, setAverageRating] = React.useState(0);
  const [isFetchAverageRating, setIsFetchAverageRating] = React.useState(false);

  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  //set status model
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState("not_work");
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  const [workingStatus, setWorkingStatus] = React.useState(null);
  const [assignedBy, setAssignedBy] = React.useState(null);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    useGlobalStore.setState({ user: null });
    navigation.navigate("Login");
  };

  const updateProfilePic = async (imageData) => {
    setIsUploadingImage(true);
    try {
      if (!imageData.uri) {
        throw new Error("No image URI provided");
      }

      const formData = new FormData();
      formData.append("file", {
        uri: imageData.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      const response = await axios_auth.put("/user/update-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to update profile picture");
      }

      checkAuth();
      SuccessToast(response.data.message);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      ErrorToast("Failed to update profile picture");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImagePicker = async () => {
    // Request permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      ErrorToast("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      updateProfilePic(result.assets[0]);
    } else {
      ErrorToast("Image selection cancelled");
    }
  };

  const fetchWorkingInfo = async () => {
    try {
      const response = await UserStore.getState().getWorkinginfo();
      setWorkingStatus(response.data.workingStatus);
      setAssignedBy(response.data.assignedBy);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    } finally {
    }
  };

  const handleOkFunction = async () => {
    try {
      const response = await UserStore.getState().editWorkingStatus(
        selectedStatus,
        selectedUsers[0]?._id ? selectedUsers[0]?._id : null
      );
      fetchWorkingInfo();
      SuccessToast("Working status updated successfully");
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
    setAverageRating(response.data.averageRating);
  };

  React.useEffect(() => {
    if (focused && user?.role === "care_giver") {
      fetchWorkingInfo();
    }
  }, []);

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
            {isUploadingImage ? (
              <ActivityIndicator size="large" color="#79AC78" />
            ) : (
              <View className="relative">
                <Image
                  source={{ uri: user?.profilePic?.url }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100 / 2,
                    overflow: "hidden",
                    borderWidth: 2,
                    borderColor: "#79AC78",
                  }}
                />
                <TouchableOpacity
                  onPress={handleImagePicker}
                  style={{
                    position: "absolute",
                    top: "80%",
                    left: "75%",
                  }}
                >
                  <MaterialCommunityIcons
                    name="image-edit"
                    size={20}
                    color="green"
                  />
                </TouchableOpacity>
              </View>
            )}
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
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
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
          <TouchableOpacity onPress={() => navigation.navigate("settings")}>
            <View className="py-2 px-3 bg-black rounded-md flex flex-row items-center gap-x-1">
              <IconIcons name="settings" size={17} color={"white"} />
            </View>
          </TouchableOpacity>
        </View>

        {/* assigned to details started  */}
        {user?.role === "care_giver" && (
          <View className="mt-3">
            <Text
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveHeight(2),
                marginVertical: responsiveHeight(1),
              }}
            >
              Working Status
            </Text>
            {workingStatus === "not_work" && (
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: responsiveHeight(1.75),
                  color: "red",
                }}
              >
                Not working
              </Text>
            )}
            {workingStatus === "assigned" && (
              <View className="flex flex-row gap-x-1 items-center">
                <Text
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: responsiveHeight(1.75),
                    color: "green",
                  }}
                >
                  I am Assigned to {assignedBy?.username}
                </Text>
              </View>
            )}
            {workingStatus === "completed" && (
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: responsiveHeight(1.75),
                  color: "green",
                }}
              >
                I have completed my work assignedBy {assignedBy?.username}
              </Text>
            )}
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <View className="py-3 px-5 bg-black rounded-md flex flex-row items-center  justify-center mt-3 gap-x-1">
                <FontAwesome name="share-square-o" size={17} color="white" />
                <Text
                  className=""
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: responsiveHeight(1.75),
                    color: "white",
                  }}
                >
                  Change Working Status
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* assigned to details ended */}

        {/* other details */}
        <View className="mt-3 pr-[-3px]">
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
                {user?.role === "care_giver" ? (
                  <>
                    Enhance your profile to attract more clients. Click on "Edit
                    Profile" now to complete your profile and connect with
                    clients!
                  </>
                ) : (
                  <>
                    Enhance your profile to attract more care givers. Click on
                    "Edit Profile" now to complete your profile and connect with
                    care givers!
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

      {/* status model */}
      <ModalStatus
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        setSelectedStatus={setSelectedStatus}
        selectedStatus={selectedStatus}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        handleOkFunction={handleOkFunction}
      />
    </React.Fragment>
  );
};

export default MyProfile;
