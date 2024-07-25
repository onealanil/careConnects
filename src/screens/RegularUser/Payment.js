import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useIsFocused } from "@react-navigation/native";
import { ErrorToast } from "../../components/ErrorToast";
import { FlashList } from "@shopify/flash-list";
import Cards from "../GlobalComponents/Cards";
import { UserStore } from "../CareGiver/helper/UserStore";

const Payment = () => {
  const focused = useIsFocused();
  const [loadingCareGiver, setLoadingCareGiver] = useState(false);
  const [workingUser, setWorkingUser] = useState([]);
  const [status, setStatus] = useState("assigned");
  const [khaltiNumber, setKhaltiNumber] = useState("");


  const getAllCareGiver = async () => {
    setLoadingCareGiver(true);
    try {
      const response = await UserStore.getState().getAllWorkingUser();
      if (
        response?.data &&
        response.data.length > 0 &&
        response.data[0].assignedTo
      ) {
        setWorkingUser([response.data[0].assignedTo]);
        setStatus(response.data[0].workingStatus);
        setKhaltiNumber(response.data[0].khaltiNumber);
      } else {
        setWorkingUser([]);
      }
    } catch (error) {
      console.log(error);
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
      getAllCareGiver();
    }
  }, []);

  return (
    <View
      className="w-[100%] bg-white flex items-center justify-center"
      style={{ marginTop: responsiveHeight(10) }}
    >
      <View className="w-[95%] flex flex-col pb-2">
        {/* search  */}
        <TouchableOpacity></TouchableOpacity>
        <View className="w-[50%] flex flex-row py-2">
          <Text
            className="text-black ml-3 mr-1"
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: responsiveHeight(1.5),
            }}
          >
            Tracking
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
              data={Array.isArray(workingUser) ? workingUser : []}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <Cards ifPayment="yes" getAllCareGiver={getAllCareGiver} khaltiNumber={khaltiNumber} workingStatus={status} data={item} />
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
                    No tracking found
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

export default Payment;
