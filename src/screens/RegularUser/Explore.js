import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import HomeSearch from "../GlobalComponents/HomeSearch";
import { FlashList } from "@shopify/flash-list";
import Cards from "../GlobalComponents/Cards";
import { useNavigation } from "@react-navigation/native";

const Explore = () => {
  const navigation = useNavigation();
  
  const data = [
    {
      id: 1,
      name: "Anil",
    },
    {
      id: 2,
      name: "bhandari",
    },
    {
      id: 3,
      name: "bhandari",
    },
    { id: 4, name: "bhandari" },
  ];

  const handleClickPost = (item) => {
    navigation.navigate("Post");
  };

  return (
    <View
      className="w-[100%] bg-white flex items-center justify-center"
      style={{ marginTop: responsiveHeight(10) }}
    >
      <View className="w-[95%] flex flex-col pb-2">
        {/* search  */}
        <TouchableOpacity>
          <View style={{ marginTop: responsiveHeight(3) }}>
            <HomeSearch text={"Home"} user={"Care Giver"} />
          </View>
        </TouchableOpacity>
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
            Jobs
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
          <FlashList
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={120}
            data={data}
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
                  No near by jobs available
                </Text>
              </View>
            )}
            ListFooterComponent={
              <View style={{ height: 50, backgroundColor: "white" }} />
            }
            showsVerticalScrollIndicator={false}
          ></FlashList>
        </View>
      </View>
    </View>
  );
};

export default Explore;
