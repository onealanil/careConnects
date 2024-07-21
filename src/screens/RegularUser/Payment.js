import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { responsiveHeight } from "react-native-responsive-dimensions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Khalti from "../GlobalComponents/khalti";

const Payment = () => {
  const [isKhaltiVisible, setIsKhaltiVisible] = useState(false);

  const handlePayOnline = () => {
    setIsKhaltiVisible(true);
  };

  const handlePaymentComplete = () => {
    setIsKhaltiVisible(false);
    // Handle any post-payment logic here
    console.log("Khalti SDK closed");
  };

  return (
    <View style={{ marginTop: responsiveHeight(8) }}>
      <TouchableOpacity onPress={handlePayOnline}>
        <View className="py-2 px-4 bg-black rounded-md flex flex-row justify-center items-center gap-x-1">
          <MaterialIcons name="payment" size={17} color="white" />
          <Text
            className=""
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: responsiveHeight(1.5),
              color: "white",
            }}
          >
            Pay Online
          </Text>
        </View>
      </TouchableOpacity>

      <Khalti 
        isVisible={isKhaltiVisible} 
       setIsVisible={setIsKhaltiVisible}
      />
    </View>
  );
};

export default Payment;