import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Picker } from "@react-native-picker/picker";
import { genderList } from "../screens/GlobalComponents/SkillsData";
import Ionicons from "react-native-vector-icons/Ionicons";
import ModalBox from "./ModalBox";
import { ErrorToast } from "./ErrorToast";
import { LoginSignupStore } from "../screens/loginSignup/helper/LoginSignupStore";

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupForm = ({ role, navigation }) => {
  //  state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [gender, setGender] = React.useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [otpDetails, setOtpDetails] = useState({
    userId: "",
    email: "",
    timer: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // handle signup
    const handleSignup = async (values) => {
      setIsSubmitting(true);
      try {
        if (role && gender) {
          const userDetails = {
            username: values.username,
            email: values.email,
            password: values.password,
            role: role,
            gender: gender,
          };

          const response = await LoginSignupStore.getState().signupUser(userDetails);
          setOtpDetails({
            userId: response.data.userId,
            email: response.data.email,
            timer: response.data.expiresAt,
          });
          setResponseMessage(response.message);
          setModalVisible(true);
        }
      } catch (error) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsSubmitting(false);
    };

  // handle ok function
  const handleOkFunction = () => {
    if (otpDetails.userId && otpDetails.email) {
      setModalVisible(false);
      navigation.navigate("OTP", {
        id: otpDetails.userId,
        email: otpDetails.email,
        timer: otpDetails.timer,
      });
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSignup(values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <>
          <View className="gap-y-2">
            {/* username */}
            <View className="gap-y-2">
              <Text
                className="text-black"
                style={{ fontFamily: "Montserrat-Medium" }}
              >
                Username
              </Text>
              <TextInput
                className="bg-[#effff8] rounded-md text-black px-2"
                style={{ fontFamily: "Montserrat-SemiBold" }}
                placeholder="Enter your Username"
                placeholderTextColor="#bdbebf"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
              {errors.username && (
                <Text
                  className="text-red-500"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.username}
                </Text>
              )}
            </View>

            {/* email */}
            <View className="gap-y-2">
              <Text
                className="text-black"
                style={{ fontFamily: "Montserrat-Medium" }}
              >
                Email
              </Text>
              <TextInput
                className="bg-[#effff8] rounded-md text-black px-2"
                style={{ fontFamily: "Montserrat-SemiBold" }}
                placeholder="Enter your Email"
                placeholderTextColor="#bdbebf"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {errors.email && (
                <Text
                  className="text-red-500"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.email}
                </Text>
              )}
            </View>
            {/* password */}
            <View className="gap-y-2">
              <Text
                className="text-black"
                style={{ fontFamily: "Montserrat-Medium" }}
              >
                Password
              </Text>
              <View className="w-[100%] flex flex-row items-center">
                <TextInput
                  className="bg-[#effff8] rounded-md text-black px-2"
                  style={{ fontFamily: "Montserrat-SemiBold", flex: 1 }}
                  placeholder="Enter your Password"
                  placeholderTextColor="#bdbebf"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                <TouchableOpacity
                  className="bg-[#effff8] py-3"
                  onPress={toggleShowPassword}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#bdbdbd"
                    style={{
                      marginLeft: 10,
                      marginRight: responsiveWidth(5),
                    }}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text
                  className="text-red-500"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.password}
                </Text>
              )}
            </View>
            {/* confirm password */}
            <View className="gap-y-2">
              <Text
                className="text-black"
                style={{ fontFamily: "Montserrat-Medium" }}
              >
                Confirm Password
              </Text>
              <View className="w-[100%] flex flex-row items-center">
                <TextInput
                  className="bg-[#effff8] rounded-md text-black px-2"
                  style={{ fontFamily: "Montserrat-SemiBold", flex: 1 }}
                  placeholder="Confirm your Password"
                  placeholderTextColor="#bdbebf"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                />
                <TouchableOpacity
                  className="bg-[#effff8] py-3"
                  onPress={toggleShowConfirmPassword}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#bdbdbd"
                    style={{
                      marginLeft: 10,
                      marginRight: responsiveWidth(5),
                    }}
                  />
                </TouchableOpacity>
              </View>

              {errors.confirmPassword && (
                <Text
                  className="text-red-500"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
            {/* gender  */}
            <View className="gap-y-2">
              <Text
                className="text-black"
                style={{ fontFamily: "Montserrat-Medium" }}
              >
                Gender
              </Text>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={{
                  height: 40,
                  backgroundColor: "#effff8",
                  borderRadius: 20,
                  width: "100%",
                  color: "black",
                  marginBottom: responsiveHeight(4),
                }}
              >
                {genderList.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.gender}
                    value={item.gender}
                  />
                ))}
              </Picker>
            </View>
            {/* Add a submit button */}
            <View>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                activeOpacity={0.8}
              >
                <View className="w-[100%] bg-black flex items-center justify-center rounded-md">
                  <Text
                    className="text-white"
                    style={{
                      paddingVertical: responsiveHeight(1.75),
                      paddingHorizontal: responsiveWidth(2),
                      fontFamily: "Montserrat-Bold",
                      fontSize: responsiveFontSize(2.25),
                    }}
                  >
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <ModalBox
            isModalVisible={isModalVisible}
            handleOkFunction={handleOkFunction}
            responseMessage={responseMessage}
            modalMessage="Verify your Account"
          />
        </>
      )}
    </Formik>
  );
};

export default SignupForm;
