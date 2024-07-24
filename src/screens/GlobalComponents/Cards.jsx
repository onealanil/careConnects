import { View, Text, Image } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useGlobalStore } from "../../global/store";
import { useIsFocused } from "@react-navigation/native";

const Cards = ({ data }) => {
  const user = useGlobalStore((state) => state.user);
  const focused = useIsFocused();

  const [isPostSaved, setIsPostSaved] = React.useState(false);

  React.useEffect(() => {
    if (user && user?.fav.includes(data?._id) && focused) {
      setIsPostSaved(true);
    }
  }, [focused]);

  return (
    <View className="flex flex-col items-center bg-gray-100 p-4 my-2 rounded-md">
      {/* upside  */}
      <View className="flex flex-row gap-x-3">
        <View>
          <Image
            source={{ uri: data?.profilePic?.url }}
            style={{ height: 40, width: 40, borderRadius: 40 }}
          />
        </View>
        <View style={{ width: responsiveWidth(50) }}>
          {/* name and tick  */}
          <View className="flex flex-row gap-x-2">
            <Text
              className="text-black ml-1"
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: responsiveFontSize(1.5),
              }}
            >
              {data?.username}
            </Text>
            <MaterialIcons name="verified" size={20} color={"green"} />
          </View>
          <View className="flex flex-row items-center">
            <View className="flex flex-row gap-x-2">
              <FontAwesome name="star" size={15} color="black" />
              <FontAwesome name="star" size={15} color="black" />
              <FontAwesome name="star" size={15} color="gray" />
              <FontAwesome name="star" size={15} color="gray" />
              <FontAwesome name="star" size={15} color="gray" />
            </View>
            <Text className="ml-3">(5)</Text>
          </View>
          <View className="flex flex-row items-center mt-2">
            <MaterialIcons name="location-on" size={20} color={"black"} />
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: responsiveFontSize(1.5),
                color: "black",
              }}
            >
              {data?.location || (
                <Text
                  className="text-red-500"
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: responsiveHeight(1.5),
                  }}
                >
                  Location not added
                </Text>
              )}
            </Text>
          </View>
        </View>
        <View>
          {user?.role === "user" && (
            <>
              {isPostSaved ? (
                <MaterialIcons name="favorite" size={25} color={"red"} />
              ) : (
                <MaterialIcons name="favorite" size={25} color={"gray"} />
              )}
            </>
          )}
        </View>
      </View>
      {/* downside */}
      <View style={{ marginTop: responsiveHeight(2) }}>
        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            fontSize: responsiveFontSize(1.5),
            color: "black",
          }}
        >
          {user?.about_me || (
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: responsiveFontSize(1.5),
                color: "red",
              }}
            >
              No about me added
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};

export default Cards;
