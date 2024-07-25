import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import IconIcons from "react-native-vector-icons/Ionicons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ErrorToast } from "../../components/ErrorToast";
import { formatDistanceToNow } from "date-fns";
import { FlashList } from "@shopify/flash-list";
import { useGlobalStore } from "../../global/store";
import { ReviewStore } from "./helper/ReviewStore";
import { useNotificationCount } from "../../global/NotificationCount";

const NotificationRenderer = ({ item }) => {
  return (
    <React.Fragment>
      <View
        className="flex flex-row gap-x-2 mb-2"
        style={{ padding: responsiveHeight(1) }}
      >
        {/* photos */}
        <View style={{ width: "20%" }}>
          {item?.senderId?.profilePic?.url && (
            <Image
              source={{ uri: item?.senderId?.profilePic?.url }}
              style={{
                height: responsiveHeight(8),
                width: responsiveHeight(8),
                borderRadius: 100,
              }}
            />
          )}
        </View>
        {/* Message */}
        <View style={{ width: "70%" }}>
          <Text
            numberOfLines={1}
            className="text-black"
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: responsiveHeight(1.5),
            }}
          >
            {item?.senderId?.username || ""} : {item?.notification}
          </Text>

          <Text
            numberOfLines={1}
            className="text-color2"
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: responsiveHeight(1.25),
            }}
          >
            Click here to view
          </Text>

          <View className="">
            <Text className="text-black">
              {formatDistanceToNow(item?.createdAt)}
            </Text>
          </View>
        </View>
        {/* time */}
      </View>
    </React.Fragment>
  );
};

const Notification = () => {
  const user = useGlobalStore((state) => state.user);
  const navigation = useNavigation();

  const [isLoadingFetchNotification, setIsLoadingFetchNotification] =
    React.useState(true);

  //notifications
  const [notification, setNotification] = React.useState([]);

  const isFocused = useIsFocused();

  const readallNotifications = useCallback(async () => {
    try {
      await ReviewStore.getState().readAllNotifications();
      useNotificationCount.setState(state => ({
        notificationCount: 0,
      }));
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
  }, []);

  const fetchNotifications = useCallback(
    async (id) => {
      try {
        const response = await ReviewStore.getState().getNotificationById(id);
        if (response) {
          setNotification(response);
        }
      } catch (error) {
        const errorMessage = error
          .toString()
          .replace("[Error: ", "")
          .replace("]", "");
        ErrorToast(errorMessage);
      }
      setIsLoadingFetchNotification(false);
    },
    [setNotification]
  );

  const memoizedUserId = useMemo(() => user?._id, [user?._id]);
  const memoizedIsFocused = useMemo(() => isFocused, [isFocused]);

  useEffect(() => {
    setIsLoadingFetchNotification(true);
    if (memoizedUserId && memoizedIsFocused) {
      fetchNotifications(memoizedUserId);
      readallNotifications();
    }
  }, [memoizedUserId, memoizedIsFocused, fetchNotifications]);

  return (
    <View className="bg-white" style={{ marginTop: responsiveHeight(5) }}>
      <View
        className="w-[100%] flex flex-col"
        style={{ padding: responsiveHeight(2) }}
      >
        {/* back button */}
        <View className="mb-2 flex flex-row items-center gap-x-8">
          <TouchableOpacity onPress={() => navigation.navigate("Home_bottom")}>
            <IconIcons name="chevron-back-sharp" size={30} color="gray" />
          </TouchableOpacity>
          <Text
            className="text-lg text-black"
            style={{
              fontSize: responsiveHeight(2),
              fontFamily: "Montserrat-Bold",
            }}
          >
            Notifications
          </Text>
        </View>
        <View style={{ padding: responsiveHeight(1) }}>
          <Text
            className="text-black"
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: responsiveHeight(2),
            }}
          >
            New
          </Text>
        </View>
        {/* flat list  */}
        <View
          style={{
            height: responsiveHeight(100),
            width: responsiveWidth(90),
          }}
        >
          {isLoadingFetchNotification && (
            <ActivityIndicator size="large" color="#00ff00" />
          )}
          {!isLoadingFetchNotification && (
            <FlashList
              horizontal={false}
              data={notification}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                padding: responsiveHeight(1),
                paddingBottom: responsiveHeight(75),
              }}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate("Other_Profile", {
                      id: item?.senderId?._id,
                    })
                  }
                >
                  <NotificationRenderer item={item} />
                </TouchableWithoutFeedback>
              )}
              ListEmptyComponent={() => (
                // Render this component when there's no data
                <View style={{ paddingBottom: responsiveHeight(25) }}>
                  <Text
                    className="text-red-500"
                    style={{
                      fontFamily: "Montserrat-Bold",
                      fontSize: responsiveFontSize(1.75),
                    }}
                  >
                    No Notification found
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Notification;
