import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Linking,
} from "react-native";
import React, { useCallback } from "react";
import {
  responsiveFontSize,
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
import { ReviewStore } from "./helper/ReviewStore";
import Rating from "../GlobalComponents/Rating";
import Review from "../GlobalComponents/Review";
import { FlashList } from "@shopify/flash-list";
import { ErrorToast } from "../../components/ErrorToast";

const Post = () => {
  const navigation = useNavigation();
  const { user, checkAuth } = useGlobalStore();
  const route = useRoute();
  const singleUserData = route?.params?.item;
  const focused = useIsFocused();

  //save
  const [isPostSaved, setIsPostSaved] = React.useState(false);

  const [isRequesting, setIsRequesting] = React.useState(false);

  //review started
  const [isFetchAverageRating, setIsFetchAverageRating] = React.useState(false);
  const [isFetchReview, setIsFetchReview] = React.useState(false);
  const [isRating, setIsRating] = React.useState(false);
  const [reviewData, setReviewData] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const [review, setReview] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [averageRating, setAverageRating] = React.useState(0);

  const backPressHandler = () => {
    //clear route params data
    navigation.setParams({ item: null });
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
      msg:
        user?.role === "care_giver"
          ? `I want to give the service to you , Will you please reply!`
          : "I want to ask something about your service, Will you please reply!",
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
    if(user?.isDocumentVerified === "verified"){
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
    }}
    else{
      ErrorToast("First verify your document");
    }
    setIsRequesting(false);
  };

  React.useEffect(() => {
    if (user && singleUserData && focused) {
      setIsPostSaved(user.fav.includes(singleUserData._id));
    }
  }, [user, singleUserData, focused]);

  const saveHandler = useCallback(async () => {
    try {
      const res = await UserStore.getState().saveUser(singleUserData?._id);
      if (res) {
        setIsPostSaved(true);
        await checkAuth();
        await UserStore.getState().getSaveUser();
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  }, [singleUserData, checkAuth]);

  const unSaveHandler = useCallback(async () => {
    try {
      const res = await UserStore.getState().unSaveUser(singleUserData?._id);
      if (res) {
        setIsPostSaved(false);
        await checkAuth();
        await UserStore.getState().getSaveUser();
      }
    } catch (error) {
      console.error("Unsave error:", error);
    }
  }, [singleUserData, checkAuth]);

  //review functions start
  React.useEffect(() => {
    const ids = singleUserData?.can_review?.map((item) => item.user);
    if (ids && ids.includes(user?._id)) {
      setIsRating(true);
    } else {
      setIsRating(false);
    }
  }, [singleUserData, user?._id]);

  const fetchReview = async (id) => {
    setIsFetchReview(true);
    try {
      const response = await ReviewStore.getState().getReview(id);
      setReviewData(response);
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
    setIsFetchReview(false);
  };

  const fetchAverageRating = useCallback(async (id) => {
    setIsFetchAverageRating(true);
    try {
      const response = await ReviewStore.getState().getAverageRating(id);
      setAverageRating(response);
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
    setIsFetchAverageRating(false);
  }, []);

  React.useEffect(() => {
    if (focused) {
      fetchReview(singleUserData?._id);
      fetchAverageRating(singleUserData?._id);
    }
  }, [focused]);

  //handle create notification
  const handleCreateNotification = useCallback(async () => {
    try {
      await ReviewStore.getState().createNotification(
        user?._id,
        singleUserData?._id,
        "reviewed you"
      );
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
  }, [singleUserData?._id, review, user?._id]);

  //handle review submit
  const handleReviewSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await ReviewStore.getState().createReview(
        user?._id,
        singleUserData?._id,
        review,
        rating
      );
      handleCreateNotification();
      fetchReview(singleUserData?._id);
      setReview("");
      setRating(0);
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
    setIsSubmitting(false);
  }, [
    user?._id,
    singleUserData?._id,
    review,
    rating,
    handleCreateNotification,
    fetchReview,
  ]);

  const callHandler = () => {
    if (user?.isDocumentVerified === "verified") {
      Linking.openURL(`tel:${singleUserData?.phoneNumber}`);
    } else {
      ErrorToast("First verify your document");
    }
  };

  return (
    <ScrollView>
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
                {singleUserData?.isDocumentVerified === "verified" && (
                  <MaterialIcon name="verified" size={20} color={"green"} />
                )}
                {user?.role !== "care_giver" && (
                  <View>
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
            <TouchableOpacity onPress={callHandler}>
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
          {/* REview */}
          <View className="flex flex-col mt-4">
            <Text
              className="text-black mb-3"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveFontSize(2),
              }}
            >
              Reviews
            </Text>
            {/* make a line */}
            <View
              className="mb-3"
              style={{
                borderBottomColor: "gray",
                borderBottomWidth: 1,
              }}
            />
            {isRating && (
              <React.Fragment>
                {/* rating input start  */}
                <View
                  className="flex flex-row gap-x-3"
                  style={{ marginBottom: responsiveHeight(3) }}
                >
                  <View className="w-[13%]">
                    <Image
                      source={{ uri: user?.profilePic.url }}
                      style={{ height: 40, width: 40, borderRadius: 40 }}
                    />
                  </View>
                  <View className="w-[80%] flex flex-col gap-y-1">
                    <Text
                      className="text-black"
                      style={{
                        fontFamily: "Montserrat-Bold",
                        fontSize: responsiveFontSize(1.75),
                      }}
                    >
                      {user?.username}
                    </Text>
                    <Text
                      className="text-black"
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: responsiveFontSize(1.75),
                      }}
                    >
                      {user?.location || (
                        <Text
                          className="text-red-500"
                          style={{
                            fontFamily: "Montserrat-Bold",
                            fontSize: responsiveFontSize(1.75),
                          }}
                        >
                          No location
                        </Text>
                      )}
                    </Text>
                    <Rating initialRating={rating} onRatingChange={setRating} />
                    <TextInput
                      multiline
                      placeholder="Write your review..."
                      value={review}
                      onChangeText={setReview}
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: responsiveFontSize(1.75),
                      }}
                      placeholderTextColor={"gray"}
                      className="text-black border-solid border-[1px] border-color2 rounded-md p-2 w-full mt-2"
                    />
                    {isSubmitting && (
                      <TouchableOpacity className="w-[100%] flex items-center justify-center py-2 px-5 bg-black rounded-md mt-2">
                        <Text
                          className="text-white"
                          style={{
                            fontFamily: "Montserrat-SemiBold",
                            fontSize: responsiveFontSize(1.75),
                          }}
                        >
                          Submitting...
                        </Text>
                      </TouchableOpacity>
                    )}
                    {!isSubmitting && (
                      <TouchableOpacity
                        onPress={handleReviewSubmit}
                        className="w-[100%] flex items-center justify-center py-2 px-5 bg-black rounded-md mt-2"
                      >
                        <Text
                          className="text-white"
                          style={{
                            fontFamily: "Montserrat-SemiBold",
                            fontSize: responsiveFontSize(1.75),
                          }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {/* rating input end  */}
                {/* make a line */}
                <View
                  className="mb-3"
                  style={{
                    borderBottomColor: "gray",
                    borderBottomWidth: 1,
                  }}
                />
              </React.Fragment>
            )}

            <View className="flex flex-col gap-y-4">
              {isFetchReview ? (
                <Text
                  className="text-color2"
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: responsiveFontSize(1.75),
                  }}
                >
                  Loading...
                </Text>
              ) : (
                <Text
                  className="text-black"
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: responsiveFontSize(1.75),
                  }}
                >
                  Total {reviewData?.length} Reviews
                </Text>
              )}

              {!isFetchReview && reviewData.length > 0 && (
                <View
                  style={{
                    height: responsiveHeight(70),
                    width: responsiveWidth(90),
                  }}
                >
                  <FlashList
                    estimatedItemSize={100}
                    keyExtractor={(item) => item._id?.toString() || ""}
                    data={reviewData}
                    renderItem={({ item }) => <Review data={item} />}
                    ListEmptyComponent={() => (
                      <View style={{ paddingBottom: responsiveHeight(25) }}>
                        <Text
                          className="text-red-500"
                          style={{
                            fontFamily: "Montserrat-Bold",
                            fontSize: responsiveFontSize(1.75),
                          }}
                        >
                          No review found
                        </Text>
                      </View>
                    )}
                    contentContainerStyle={{
                      paddingBottom: responsiveHeight(50),
                      paddingTop: responsiveHeight(1),
                    }}
                    showsVerticalScrollIndicator={false}
                  ></FlashList>
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Post;
