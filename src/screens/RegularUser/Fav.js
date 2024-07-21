import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import Cards from "../GlobalComponents/Cards";

const Fav = () => {
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
                  No Care Givers Found
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

export default Fav;
