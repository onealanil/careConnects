import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import React from "react";
import TopNav from "../GlobalComponents/TopNav";
import { FlashList } from "@shopify/flash-list";
import Cards from "../GlobalComponents/Cards";
import HomeSearch from "../GlobalComponents/HomeSearch";

const Home = () => {
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

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingTop: responsiveHeight(16),
      }}
    >
      <View className="w-[95%]" style={{ padding: responsiveHeight(2) }}>
        {/* top nav  */}
        <TopNav user={"anil"} />
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
            <View style={{marginTop: responsiveHeight(3)}}>
              <HomeSearch text={'Home'} user={"Care Giver"} />
            </View>
          </TouchableOpacity>
        {/* home other options  */}
        <View
          style={{
            height: responsiveHeight(70),
            width: responsiveWidth(90),
          }}
        >
          <FlashList
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={120}
            data={data}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
              // onPress={() => setSelectedItemHandler(item)}
              >
                <Cards data={item} />
              </TouchableWithoutFeedback>
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

export default Home;
