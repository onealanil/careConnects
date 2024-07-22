import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import React, { useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import TopNav from "../GlobalComponents/TopNav";
import HomeSearch from "../GlobalComponents/HomeSearch";
import Cards from "../GlobalComponents/Cards";
import { useGlobalStore } from "../../global/store";
import { useMessageStore } from "../../global/MessageCount";
import { UserStore } from "./helper/UserStore";

const Home = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const user = useGlobalStore((state) => state.user);

  //user
  const [userData, setUserData] = React.useState([]);
  const [loadingUser, setLoadingUser] = React.useState(false);

  const readUnreadMessage = useCallback(async () => {
    await useMessageStore.getState().unreadMessageCount();
  }, []);

  React.useEffect(() => {
    // get all care giver
    const getAllUser = async () => {
      setLoadingUser(true);
      try {
        const response = await UserStore.getState().getAllUser();
        setUserData(response.user);
      } catch (error) {
        const errorMessage = error
          .toString()
          .replace("[Error: ", "")
          .replace("]", "");
        ErrorToast(errorMessage);
      }
      setLoadingUser(false);
    };

    if (focused) {
      readUnreadMessage();
      getAllUser();
    }
  }, []);

  const handleClickPost = (item) => {
    navigation.navigate("Post");
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingTop: responsiveHeight(8),
      }}
    >
      <View className="w-[95%]" style={{ padding: responsiveHeight(2) }}>
        {/* top nav  */}
        <TopNav props={navigation} user={user} />
        {/* description start */}
        <View
          className="flex flex-col gap-y-1"
          style={{ marginTop: responsiveHeight(3) }}
        >
          <View>
            <Text
              className="text-gray-500"
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: responsiveFontSize(2),
              }}
            >
              Discover
            </Text>
          </View>
          <View>
            <Text
              className="text-black"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveFontSize(2),
              }}
            >
              Users and give services to them
            </Text>
          </View>
        </View>
        {/* search  */}
        <TouchableOpacity>
          <View style={{ marginTop: responsiveHeight(3) }}>
            <HomeSearch text={"Home"} user={"Care Giver"} />
          </View>
        </TouchableOpacity>
        {/* home other options  */}
        <View
          style={{
            height: responsiveHeight(70),
            width: responsiveWidth(90),
          }}
        >
          {loadingUser && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#79AC78" />
            </View>
          )}
          {!loadingUser && (
            <FlashList
              keyExtractor={(item) => item._id.toString()}
              estimatedItemSize={120}
              data={userData}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleClickPost(item)}>
                  <Cards data={item} />
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingBottom: responsiveHeight(50),
                paddingTop: responsiveHeight(1),
              }}
              ListEmptyComponent={() => (
                <View style={{ paddingBottom: responsiveHeight(25) }}>
                  <Text
                    className="text-red-500"
                    style={{
                      fontFamily: "Montserrat-Bold",
                      fontSize: responsiveFontSize(1.75),
                    }}
                  >
                    No users Found
                  </Text>
                </View>
              )}
              ListFooterComponent={
                <View style={{ height: 50, backgroundColor: "white" }} />
              }
              showsVerticalScrollIndicator={false}
            ></FlashList>
          )}
        </View>
      </View>
    </View>
  );
};

export default Home;
