import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Formik } from "formik";
import { Skills_data, educationList } from "../GlobalComponents/SkillsData";
import { SuccessToast } from "../../components/SuccessToast";
import { ErrorToast } from "../../components/ErrorToast";
import { useGlobalStore } from "../../global/store";
import GeoLocation from "../GlobalComponents/GeoLocation";
import { useNavigation } from "@react-navigation/native";
import { UserStore } from "./helper/UserStore";

const RenderItem = () => {
  const { user, checkAuth } = useGlobalStore();
  const [selectedItem, setSelectedItem] = React.useState([]);
  //location name
  const [locationName, setLocationName] = React.useState("");
  const [education, setEducation] = React.useState("");

  //geometry
  const [geometry, setGeometry] = React.useState({});

  const initialValues = useMemo(
    () => ({
      username: user.username,
      title: user.title,
      bio: user.bio,
      about_me: user.about_me,
    }),
    [user]
  );

  const handleEditProfile = useCallback(
    async (values) => {
      try {
        const newValues = {
          ...values,
          education,
          location: locationName,
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        };

        const response = await UserStore.getState().editProfile(user._id, newValues);

        if (response) {
          checkAuth();
          SuccessToast('Profile Updated Successfully');
        }
      } catch (error) {
        const errorMessage = error
          .toString()
          .replace("[Error: ", "")
          .replace("]", "");
        ErrorToast(errorMessage);
      }
    },
    [checkAuth, geometry.coordinates, locationName, selectedItem, user._id, education]
  );

  return (
    <View className="flex flex-col items-center ">
      <View className="w-[85%]">
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            handleEditProfile(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
              <View className="gap-y-2">
                {/* Username */}
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
                    placeholder="Username"
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

                  {/* title */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{ fontFamily: "Montserrat-Medium" }}
                    >
                      Title
                    </Text>
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black px-2"
                      style={{ fontFamily: "Montserrat-SemiBold" }}
                      placeholder="You are a ..."
                      placeholderTextColor="#bdbebf"
                      onChangeText={handleChange("title")}
                      onBlur={handleBlur("title")}
                      value={values.title}
                    />
                    {errors.title && (
                      <Text
                        className="text-red-500"
                        style={{ fontFamily: "Montserrat-Regular" }}
                      >
                        {errors.title}
                      </Text>
                    )}
                  </View>

                  {/* Bio */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{ fontFamily: "Montserrat-Medium" }}
                    >
                      Bio
                    </Text>
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black px-2"
                      style={{ fontFamily: "Montserrat-SemiBold" }}
                      placeholder="Bio"
                      placeholderTextColor="#bdbebf"
                      onChangeText={handleChange("bio")}
                      onBlur={handleBlur("bio")}
                      value={values.bio}
                    />
                    {errors.bio && (
                      <Text
                        className="text-red-500"
                        style={{ fontFamily: "Montserrat-Regular" }}
                      >
                        {errors.bio}
                      </Text>
                    )}
                  </View>

                  {/* Location */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{ fontFamily: "Montserrat-Medium" }}
                    >
                      Location
                    </Text>
                    <GeoLocation
                      setGeometry={setGeometry}
                      setLocationName={setLocationName}
                    />
                  </View>

                  {/* About Me */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{ fontFamily: "Montserrat-Medium" }}
                    >
                      About Me
                    </Text>
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black px-2"
                      style={{ fontFamily: "Montserrat-SemiBold" }}
                      placeholder="About Me"
                      placeholderTextColor="#bdbebf"
                      onChangeText={handleChange("about_me")}
                      onBlur={handleBlur("about_me")}
                      value={values.about_me}
                    />
                    {errors.about_me && (
                      <Text
                        className="text-red-500"
                        style={{ fontFamily: "Montserrat-Regular" }}
                      >
                        {errors.about_me}
                      </Text>
                    )}
                  </View>

                  {/* Education  */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{ fontFamily: "Montserrat-Medium" }}
                    >
                      Education
                    </Text>
                    <Picker
                      selectedValue={education}
                      onValueChange={(itemValue) => setEducation(itemValue)}
                      style={{
                        height: 40,
                        backgroundColor: "#effff8",
                        borderRadius: 20,
                        width: "100%",
                        color: "black",
                        marginBottom: responsiveHeight(4),
                      }}
                    >
                      {educationList.map((item) => (
                        <Picker.Item
                          key={item.id}
                          label={item.education}
                          value={item.education}
                        />
                      ))}
                    </Picker>
                  </View>

                  {/* Add a submit button */}
                  <View className="mt-4">
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
                          Done
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const EditProfile = () => {
  const navigation = useNavigation();

  return (
    <>
      <View
        className="w-[100%] flex flex-row justify-between px-8 pb-2"
        style={{ marginTop: responsiveHeight(8) }}
      >
        <View className="flex flex-row items-center justify-center gap-x-2">
          <Text
            className="text-black"
            style={{
              fontSize: responsiveScreenFontSize(2),
              fontWeight: "bold",
            }}
          >
            Edit Profile
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("myProfile")}>
          <AntDesign name="closecircle" size={20} color="red" className="p-5" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={[
          {
            key: "form-key",
            component: <RenderItem />,
          },
        ]}
        renderItem={({ item }) => item.component}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(10),
        }}
      ></FlatList>
    </>
  );
};

export default React.memo(EditProfile);
