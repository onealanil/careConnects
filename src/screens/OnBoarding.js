import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const OnBoarding = () => {
  const navigation = useNavigation();
  const handleBoarding = () => {
    navigation.navigate('Login');
  };


  return (
    <View style={styles.container}>
      {/* Full-screen Image at the top */}
      <Image
        source={require("../../assets/Care Connect.png")}
        style={styles.backgroundImage}
      />
   {/* something chages here */}
      {/* Text and Button Container */}
      <View style={styles.contentContainer}>
        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
          "Connecting You with Trusted Caregivers"
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity onPress={handleBoarding} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 50,
    right: 0,
    width: '80%',
    height: responsiveHeight(90), // Adjust this value to control how much of the screen the image covers
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: responsiveWidth(5),
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: responsiveHeight(40), // Adjust this to control the height of the bottom section
  },
  textContainer: {
    marginBottom: responsiveHeight(5),
  },
  mainText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: responsiveFontSize(2.75),
    textAlign: 'center',
    color: 'black',
  },
  highlightText: {
    color: '#your-color2-here', // Replace with your actual color2 value
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: responsiveHeight(1.75),
    paddingHorizontal: responsiveWidth(2),
    width: responsiveWidth(70),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(5), // Add some bottom margin
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontFamily: "Montserrat-SemiBold",
    fontSize: responsiveFontSize(2.25),
    fontWeight: 'bold',
  },
});

export default OnBoarding;