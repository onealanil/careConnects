import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useGlobalStore } from "../../global/store";
import { useIsFocused } from "@react-navigation/native";
import Khalti from "../GlobalComponents/khalti";
import { ReviewStore } from "../RegularUser/helper/ReviewStore";
import { ErrorToast } from "../../components/ErrorToast";

const Cards = ({
  ifPayment,
  workingStatus,
  getAllCareGiver,
  khaltiNumber,
  data,
}) => {
  const user = useGlobalStore((state) => state.user);
  const focused = useIsFocused();

  //khalti
  const [isKhaltiVisible, setIsKhaltiVisible] = React.useState(false);

  const [isPostSaved, setIsPostSaved] = React.useState(false);
  const [averageRating, setAverageRating] = React.useState(0);
  const [isFetchAverageRating, setIsFetchAverageRating] = React.useState(false);

  const renderStars = useCallback(() => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const starColor = i <= averageRating ? "#E2EA3B" : "gray";
      stars.push(
        <View key={i} className="ml-1">
          <FontAwesome name="star" size={15} color={starColor} />
        </View>
      );
    }

    return stars;
  }, [averageRating]);

  React.useEffect(() => {
    if (user && user?.fav.includes(data?._id) && focused) {
      setIsPostSaved(true);
    }
  }, [focused]);

  const handlePayOnline = () => {
    setIsKhaltiVisible(true);
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
      fetchAverageRating(data?._id);
    }
  }, [focused]);

  return (
    <View className="flex flex-col items-center bg-gray-100 p-4 my-2 rounded-md">
      {ifPayment === "yes" && (
        <View className="my-3 bg-black rounded-full">
          <Text
            className="text-white px-4 py-2"
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: responsiveFontSize(1.5),
            }}
          >
            {workingStatus}
          </Text>
        </View>
      )}
      {ifPayment === "yes" && workingStatus === "completed" && (
        <Text className="mb-4">
          <Text
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: responsiveFontSize(1.5),
              color: "black",
            }}
          >
            Khalti Number: {khaltiNumber}
          </Text>
        </Text>
      )}

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
            {
              // if user is verified
              data?.isDocumentVerified === "verified" && (
                <MaterialIcons name="verified" size={20} color={"green"} />
              )
            }
          </View>
          <View className="flex flex-row items-center">
            <View className="flex flex-row gap-x-2">
              {isFetchAverageRating ? (
                <Text className="text-color2">Loading...</Text>
              ) : (
                renderStars()
              )}
            </View>
            <Text
              className="ml-3"
              style={{
                fontFamily: "Montserrat-Bold",
              }}
            >
              ({Number(averageRating ? Number(averageRating).toFixed(2) : 0)})
            </Text>
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
          {data?.about_me || (
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
      {ifPayment === "yes" && workingStatus === "completed" && (
        <TouchableOpacity onPress={handlePayOnline}>
          <Image
            source={require("../../../assets/khalti.png")}
            style={{
              height: 50,
              width: 50,
              resizeMode: "contain",
              marginTop: 10,
            }}
          />
          <View className="mt-2 bg-black rounded-md">
            <Text
              className="px-4 py-2 text-white"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveFontSize(1.5),
              }}
            >
              Pay with Khalti
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <Khalti
        isVisible={isKhaltiVisible}
        setIsVisible={setIsKhaltiVisible}
        khaltiNumber={khaltiNumber}
        datas={data}
        getAllCareGiver={getAllCareGiver}
      />
    </View>
  );
};

export default Cards;
