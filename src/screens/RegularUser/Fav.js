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
import Cards from "../GlobalComponents/Cards";
import { UserStore } from "../CareGiver/helper/UserStore";
import { ErrorToast } from "../../components/ErrorToast";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const Fav = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [careGiver, setCareGiver] = React.useState([]);

  const getAllSavedUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await UserStore.getState().getSaveUser();
      setCareGiver(response);
    } catch (error) {
      ErrorToast(error.toString().replace("[Error: ", "").replace("]", ""));
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      getAllSavedUser();
    }
  }, [isFocused]);

  const handleClickPost = (item) => {
    navigation.navigate("Post", {
      item,
    });
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingTop: responsiveHeight(8),
      }}
    >
      <View className="w-[95%]" style={{ padding: responsiveHeight(2) }}>
        {/* description start */}
        <View
          className="flex flex-col gap-y-1"
          style={{ marginBottom: responsiveHeight(1) }}
        >
          <View>
            <Text
              className="text-gray-500"
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: responsiveFontSize(2),
              }}
            >
              My Favourite
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
              Care Givers
            </Text>
          </View>
        </View>
        {/* home other options  */}
        <View
          style={{
            height: responsiveHeight(90),
            width: responsiveWidth(90),
          }}
        >
          {isLoading && (
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
          {!isLoading && (
            <FlashList
              keyExtractor={(item) => item._id.toString()}
              estimatedItemSize={120}
              data={careGiver.savedPosts}
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
                    No Care Givers saved
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

export default Fav;
