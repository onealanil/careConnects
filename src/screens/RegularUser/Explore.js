import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import HomeSearch from "../GlobalComponents/HomeSearch";
import { FlashList } from "@shopify/flash-list";
import Cards from "../GlobalComponents/Cards";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { UserStore } from "../CareGiver/helper/UserStore";
import { useGlobalStore } from "../../global/store";

const Explore = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const user = useGlobalStore((state) => state.user);

  //care giver
  const [careGiver, setCareGiver] = React.useState([]);
  const [loadingCareGiver, setLoadingCareGiver] = React.useState(false);

  //search items
  const [search, setSearch] = React.useState("");

  const searchCareGivers = async (searchTerm) => {
    setLoadingCareGiver(true);
    try {
      const response = await UserStore.getState().searchCareGiver(searchTerm);
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

  React.useEffect(() => {
    if (focused) {
      searchCareGivers(search);
    }
  }, [focused, search]);

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleClickPost = (item) => {
    navigation.navigate("Post", {
      item,
    });
  };

  return (
    <ScrollView>
      <View
        className="w-[100%] bg-white flex items-center justify-center"
        style={{ marginTop: responsiveHeight(4) }}
      >
        <View className="w-[95%] flex flex-col pb-2">
          {/* search  */}

          <View style={{ marginTop: responsiveHeight(3) }}>
            <HomeSearch text={"Home"} user={user} setSearch={handleSearch} />
          </View>
          <View className="w-[50%] flex flex-row py-2">
            <Text
              className="text-black ml-3 mr-1"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveHeight(1.5),
              }}
            >
              Explore
            </Text>
            <Text
              className="text-color2"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveHeight(1.5),
              }}
            >
              Care Givers
            </Text>
          </View>
          {/* home other options  */}
          <View
            style={{
              height: responsiveHeight(100),
              width: responsiveWidth(90),
              marginLeft: responsiveWidth(2),
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
    </ScrollView>
  );
};

export default Explore;
