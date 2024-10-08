import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useGlobalStore } from "../../global/store";
import { ErrorToast } from "../../components/ErrorToast";
import { SuccessToast } from "../../components/SuccessToast";
import { axios_auth } from "../../global/config";
import { useNavigation } from "@react-navigation/native";

const DocumentVerifyRender = ({ navigation }) => {
  const { user, checkAuth } = useGlobalStore();

  //images
  const [images, setImages] = React.useState([] || null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleImagePicker = React.useCallback(async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      ErrorToast("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 0.5,
      selectionLimit: 2,
    });

    if (!result.canceled && result.assets) {
      const selectedImages = result.assets.slice(0, 2);
      setImages(selectedImages);
    }
  }, [setImages]);

  const verifyDocumentHandler = async () => {
    console.log("verifyDocumentHandler called");
    setIsSubmitting(true);
    try {
      if (!user?.phoneNumber) {
        setIsSubmitting(false);
        return ErrorToast("Please Verify your phone number first");
      }

      if (!Array.isArray(images) || images.length === 0) {
        setIsSubmitting(false);
        return ErrorToast("Please add images");
      }

      if (images.length < 2 || images.length > 2) {
        setIsSubmitting(false);
        return ErrorToast("Upload Front side and Back side of document");
      }

      const formData = new FormData();

      for (let i = 0; i < images.length; i++) {
        const file = {
          uri: images[i].uri,
          type: images[i].mimeType,
          name: images[i].fileName,
        };
        formData.append("files", file);
        console.log(`Appending file ${i}:`, file);
      }

      const response = await axios_auth.post(
        "/user/upload-document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 201) {
        setIsSubmitting(false);
        ErrorToast("Failed to upload documents");
      } else {
        checkAuth();
        SuccessToast("Documents uploaded successfully");
      }
    } catch (error) {
      console.log("Error details:", error);
      if (error.response) {
        console.log("Error data:", error.response.data);
        console.log("Error status:", error.response.status);
        console.log("Error headers:", error.response.headers);
      } else if (error.request) {
        console.log("Error request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      ErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <React.Fragment>
      <View>
        <Text
          className="text-red-500"
          style={{
            fontSize: responsiveScreenFontSize(1.5),
            fontWeight: "bold",
            textAlign: "center",
            padding: responsiveHeight(2),
          }}
        >
          Note: You can't create a gig without verifying your document. This is
          to ensure that you are a real person and not a bot.
        </Text>
        <View className="flex flex-row justify-between w-[95%]">
          <View
            className="flex flex-col gap-y-2"
            style={{
              padding: responsiveHeight(2),
            }}
          >
            <Text
              className="text-black"
              style={{
                fontSize: responsiveScreenFontSize(2),
                fontWeight: "bold",
              }}
            >
              Phone Number
            </Text>
            <Text
              className="text-color2"
              style={{
                fontSize: responsiveScreenFontSize(1.5),
                fontWeight: "bold",
              }}
            >
              {user?.phoneNumber}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("phoneVerify", {
                id: "2323dfdf",
              })
            }
          >
            <Text
              className="text-color2"
              style={{
                fontSize: responsiveScreenFontSize(2),
                fontWeight: "bold",
                padding: responsiveHeight(2),
              }}
            >
              {user?.phoneNumber === "" ? "Add" : "Change"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* citizen ship photos start  */}
        <View style={{ marginBottom: responsiveHeight(4) }}>
          {/* image picker  */}
          <View className="gap-y-2">
            <Text
              className="text-red-500"
              style={{
                fontSize: responsiveScreenFontSize(1.5),
                fontWeight: "bold",
                textAlign: "center",
                padding: responsiveHeight(2),
              }}
            >
              Note: You can upload your citizenship card or passport or driving
              license. Please make sure the document is clear and visible.
            </Text>
            <Text
              className="text-black"
              style={{ fontFamily: "Montserrat-Medium" }}
            >
              Add Images
            </Text>
            <TouchableOpacity onPress={() => handleImagePicker()}>
              <View className="bg-[#effff8] rounded-md text-black px-2 py-4">
                <Text
                  style={{ fontFamily: "Montserrat-SemiBold" }}
                  className="text-black"
                >
                  {images === undefined || images.length === 0
                    ? "Click to add images"
                    : "Images added"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {Array.isArray(images) && images.length > 0 && (
            <View className="gap-y-2">
              <View className="flex flex-row items-center gap-x-3">
                <Text
                  className="text-black"
                  style={{ fontFamily: "Montserrat-Medium" }}
                >
                  Preview
                </Text>
                <Text
                  className="text-red-500"
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: responsiveFontSize(1.35),
                  }}
                >
                  Only First 2 images will be selected
                </Text>
              </View>
              <ScrollView className="flex flex-row gap-x-2" horizontal>
                {images.map((image) => (
                  <Image
                    key={image.uri}
                    source={{ uri: image.uri }}
                    style={{
                      width: responsiveWidth(25),
                      height: responsiveHeight(15),
                      borderRadius: 10,
                    }}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        {/* citizen ship photos end  */}
        <View className="w-[100%] bg-black flex items-center justify-center rounded-md">
          {isSubmitting ? (
            <Text
              className="text-white tracking-widest"
              style={{
                paddingVertical: responsiveHeight(1.75),
                paddingHorizontal: responsiveWidth(2),
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveFontSize(2.25),
              }}
            >
              Requesting...
            </Text>
          ) : (
            <TouchableOpacity onPress={verifyDocumentHandler}>
              <Text
                className="text-white tracking-widest"
                style={{
                  paddingVertical: responsiveHeight(1.75),
                  paddingHorizontal: responsiveWidth(2),
                  fontFamily: "Montserrat-Bold",
                  fontSize: responsiveFontSize(2.25),
                }}
              >
                {isSubmitting ? "Requesting..." : "Request"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    color: "black",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
  },
});

const DocumentVerify = () => {
  const navigation = useNavigation();
  const user = useGlobalStore((state) => state.user);

  return (
    <View style={{ marginTop: responsiveHeight(8) }}>
      <View className="w-[100%] flex flex-row justify-between px-8 pb-2">
        <View className="flex flex-row items-center justify-center gap-x-2">
          <Text
            className="text-black"
            style={{
              fontSize: responsiveScreenFontSize(2),
              fontWeight: "bold",
            }}
          >
            Verify Document
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("myProfile")}>
          <AntDesign name="closecircle" size={20} color="red" className="p-5" />
        </TouchableOpacity>
      </View>
      {user && user?.isDocumentVerified === "verified" && (
        <View>
          <Text
            className="text-green-500"
            style={{
              fontSize: responsiveScreenFontSize(1.5),
              fontWeight: "bold",
              textAlign: "center",
              padding: responsiveHeight(2),
            }}
          >
            Your documents are verified. You can now create a gig.
          </Text>
          <View className="w-[100%] flex items-center justify-center rounded-md">
            <View className="flex flex-row justify-between w-[95%]">
              <View
                className="flex flex-col gap-y-2"
                style={{
                  padding: responsiveHeight(2),
                }}
              >
                <Text
                  className="text-black"
                  style={{
                    fontSize: responsiveScreenFontSize(2),
                    fontWeight: "bold",
                  }}
                >
                  Phone Number
                </Text>
                <Text
                  className="text-color2"
                  style={{
                    fontSize: responsiveScreenFontSize(1.5),
                    fontWeight: "bold",
                  }}
                >
                  {user?.phoneNumber}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Phone_Verify", {
                    id: "2323dfdf",
                  })
                }
              >
                <Text
                  className="text-color2"
                  style={{
                    fontSize: responsiveScreenFontSize(2),
                    fontWeight: "bold",
                    padding: responsiveHeight(2),
                  }}
                >
                  {user?.phoneNumber === "" ? "Add" : "Change"}
                </Text>
              </TouchableOpacity>
            </View>
            {/* citizenship started */}
            <ScrollView className="flex flex-row gap-x-2" horizontal>
              {user?.documents.map((image) => (
                <Image
                  key={image.url}
                  source={{ uri: image.url }}
                  style={{
                    width: responsiveWidth(40),
                    height: responsiveHeight(20),
                    borderRadius: 10,
                  }}
                />
              ))}
            </ScrollView>
            {/* citizenship end  */}
          </View>
        </View>
      )}
      {user && user?.isDocumentVerified === "Pending" && (
        <View>
          <Text
            className="text-red-500"
            style={{
              fontSize: responsiveScreenFontSize(1.5),
              fontWeight: "bold",
              textAlign: "center",
              padding: responsiveHeight(2),
            }}
          >
            Your documents are pending. Care Connect is currently reviewing
            them. We will email you once your documents have been verified.
            Thank you for your patience.
          </Text>
          <View className="w-[100%] flex items-center justify-center rounded-md">
            <TouchableOpacity
              className="bg-black w-[85%] flex items-center justify-center rounded-md"
              onPress={() => navigation.navigate("myProfile")}
            >
              <Text
                className="text-white tracking-widest"
                style={{
                  paddingVertical: responsiveHeight(1.75),
                  paddingHorizontal: responsiveWidth(2),
                  fontFamily: "Montserrat-Bold",
                  fontSize: responsiveFontSize(2.25),
                }}
              >
                Go to Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {user && user?.isDocumentVerified === "is_not_verified" && (
        <FlatList
          data={[
            {
              key: "form-key",
              component: <DocumentVerifyRender navigation={navigation} />,
            },
          ]}
          renderItem={({ item }) => item.component}
          contentContainerStyle={{
            padding: responsiveHeight(2),
            paddingBottom: responsiveHeight(10),
          }}
        ></FlatList>
      )}
    </View>
  );
};

export default React.memo(DocumentVerify);
