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
import TopNav from "../GlobalComponents/TopNav";
import { FlashList } from "@shopify/flash-list";
import Cards from "../GlobalComponents/Cards";
import HomeSearch from "../GlobalComponents/HomeSearch";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useGlobalStore } from "../../global/store";
import { UserStore } from "../CareGiver/helper/UserStore";
import { useMessageStore } from "../../global/MessageCount";

const Home = () => {
  const navigation = useNavigation();
  const user = useGlobalStore((state) => state.user);
  const focused = useIsFocused();
  //care giver
  const [careGiver, setCareGiver] = React.useState([]);
  const [loadingCareGiver, setLoadingCareGiver] = React.useState(false);


  const readUnreadMessage = useCallback(async () => {
    await useMessageStore.getState().unreadMessageCount();
  }, []);

  const readFavCount = useCallback(async () => {
    await UserStore.getState().getSaveUser();
  }, []);

  React.useEffect(() => {
    // get all care giver
    const getAllCareGiver = async () => {
      setLoadingCareGiver(true);
      try {
        const response = await UserStore.getState().getAllCareGiver();
        setCareGiver(response.user);
      } catch (error) {
        const errorMessage = error
          .toString()
          .replace("[Error: ", "")
          .replace("]", "");
        ErrorToast(errorMessage);
      }
      setLoadingCareGiver(false);
    };
    
    if(focused){
      readUnreadMessage();
      readFavCount();
      getAllCareGiver();
    }
  }, [focused]);

  

  const handleClickPost = (item) => {
    navigation.navigate("Post", {
      item,
    });
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
              Care Givers and get the best care
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
          {loadingCareGiver && (
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
          {!loadingCareGiver && (
            <FlashList
              keyExtractor={(item) => item._id.toString()}
              estimatedItemSize={120}
              data={careGiver}
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
                    No Care Givers Found
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
