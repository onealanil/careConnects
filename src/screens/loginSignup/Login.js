import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  findNodeHandle,
} from "react-native";
import { removeItem, setToken } from "../../utils/asyncStorage";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { useGlobalStore } from "../../global/store";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { LoginSVG } from "../../components/svgComponents";
import { ErrorToast } from "../../components/ErrorToast";
import { LoginSignupStore } from "./helper/LoginSignupStore";
import { SuccessToast } from "react-native-toast-message";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    const checkUser = async () => {
      const storedCurrentUser = await AsyncStorage.getItem("currentUser");
      if (storedCurrentUser) {
        navigation.navigate("Home");
      }
    };

    checkUser();
  }, []);

  // global store state
  const setUser = useGlobalStore((state) => state.setUser);

  //  state
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // for eye
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const removeHandler = async () => {
    await removeItem("onboarding");
  };

  //context
  const { setCurrentUser } = useUserContext();
  const { currentUser } = useUserContext();

  // login handler
  const loginHandlerFunction = async (values) => {
    setIsLoggingIn(true);
    try {
      const finalValues = {
        email: values.email,
        password: values.password,
      };
      const response = await LoginSignupStore.getState().loginUser(finalValues);
      setCurrentUser(response.token);
      setUser(response.user);
      SuccessToast(response.message);
      response.user.role === "user" && navigation.navigate("regular_user");
      response.user.role === "care_giver" && navigation.navigate("care_giver");
      // setting the token in async storage
      setToken("currentUser", response.token);
    } catch (error) {
      console.log("this is error", error);
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
    setIsLoggingIn(false);
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        loginHandlerFunction(values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "white" }}>
          <View className="w-[100%] h-[100%] flex items-center bg-white">
            <View className="w-[85%] flex gap-y-3 mt-3">
              <View className="flex-row items-center justify-between">
                <Image
                  source={require("../../../assets/sparkler.png")}
                  style={{
                    width: responsiveWidth(12),
                    height: responsiveHeight(8),
                    objectFit: "contain",
                  }}
                />
                <View className="h-1 w-[70%] bg-yellow-300"></View>
              </View>
              <View className="flex flex-col gap-y-2">
                <Text
                  className="text-black"
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: responsiveFontSize(3),
                  }}
                >
                  Log in to your account
                </Text>
                <Text
                  className="text-black"
                  style={{ fontFamily: "Montserrat-Regular" }}
                >
                  Welcome back! Please enter your details
                </Text>
              </View>
              {/* svg images  */}
              <View className="w-full flex items-center justify-center">
                <LoginSVG />
              </View>
              <View className="gap-y-2">
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{ fontFamily: "Montserrat-Medium" }}
                  >
                    Email
                  </Text>
                  <TextInput
                    className="bg-[#effff8] rounded-md text-black"
                    style={{ fontFamily: "Montserrat-SemiBold" }}
                    placeholder="Enter your email"
                    placeholderTextColor="#bdbebf"
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
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{ fontFamily: "Montserrat-Medium" }}
                  >
                    Password
                  </Text>
                  <View className="w-[100%] flex flex-row items-center">
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black"
                      placeholder="Enter your password"
                      style={{ fontFamily: "Montserrat-SemiBold", flex: 1 }}
                      placeholderTextColor="#bdbebf"
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      secureTextEntry={!showPassword}
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
              </View>
              <TouchableOpacity>
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-black text-xs"></Text>
                  <Text
                    className="text-black"
                    style={{
                      fontSize: responsiveFontSize(1.9),
                      fontFamily: "Montserrat-SemiBold",
                    }}
                  >
                    Forget Password?
                  </Text>
                </View>
              </TouchableOpacity>
              <View>
                <View className="w-[100%] bg-black flex items-center justify-center rounded-md">
                  <TouchableOpacity onPress={() => handleSubmit()}>
                    <Text
                      className="text-white"
                      style={{
                        paddingVertical: responsiveHeight(1.75),
                        paddingHorizontal: responsiveWidth(2),
                        fontFamily: "Montserrat-Bold",
                        fontSize: responsiveFontSize(2.25),
                      }}
                    >
                      {isLoggingIn ? "Logging in..." : "Log in"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex flex-row items-center justify-center gap-x-1">
                <Text
                  className="text-black"
                  style={{
                    paddingVertical: responsiveHeight(1.75),
                    paddingHorizontal: responsiveWidth(2),
                    fontFamily: "Montserrat-Regular",
                    fontSize: responsiveFontSize(1.75),
                  }}
                >
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Signup");
                  }}
                >
                  <Text
                    className="text-black"
                    style={{
                      paddingVertical: responsiveHeight(1.75),
                      paddingHorizontal: responsiveWidth(2),
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: responsiveFontSize(2),
                    }}
                  >
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={removeHandler}
                style={{ marginTop: responsiveHeight(4) }}
              >
                <Text className="text-green-300">r</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  );
};

export default Login;
