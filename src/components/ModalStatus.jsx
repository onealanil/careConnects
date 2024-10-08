import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Modal from "react-native-modal";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import Entypo from "react-native-vector-icons/Entypo";
import { axios_auth } from "../global/config";
import { ErrorToast } from "./ErrorToast";
import UserItem from "./UserItem";

const ModalStatus = ({
  setIsModalVisible,
  isModalVisible,
  handleOkFunction,
  selectedUsers,
  setSelectedUsers,
  setSelectedStatus,
  selectedStatus,
  setKhaltiNumber,
}) => {
  const [searchText, setSearchText] = React.useState("");
  const [searchedUser, setSearchedUser] = React.useState(null);
  const [isLoadingSearch, setIsLoadingSearch] = React.useState(false);

  const status = [
    { id: 1, name: "not_work" },
    { id: 2, name: "assigned" },
    { id: 3, name: "completed" },
  ];

  const searchUserHandler = async () => {
    if (searchText === "") return ErrorToast("Please enter a username");
    setIsLoadingSearch(true);
    try {
      const response = await axios_auth.get(`/user/search-user/${searchText}`);
      if (response.status === 200) {
        setSearchedUser(response.data?.user);
      }
    } catch (error) {
      ErrorToast("User not found");
    }
    setIsLoadingSearch(false);
  };

  const handleSelect = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <Modal isVisible={isModalVisible}>
      <View style={{ flex: 1 }} className="flex items-center justify-center">
        <View
          style={{ width: responsiveWidth(85) }}
          className="bg-white rounded-lg py-8"
        >
          <View className="w-[100%] flex items-end justify-end px-4">
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Entypo name="circle-with-cross" size={30} color="red" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-col items-center justify-center">
            <FontAwesome5 name="user-tie" size={60} color="black" />
            <Text
              className="text-color2 mb-3"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveFontSize(2.5),
              }}
            >
              Got a Client?
            </Text>
            <Text
              className="text-black mb-4"
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: responsiveFontSize(2),
              }}
            >
              Select the Status
            </Text>
            <View
              style={{
                height: 40,
                backgroundColor: "#effff8",
                borderRadius: 20,
                marginBottom: responsiveHeight(4),
                width: "90%",
              }}
            >
              <Picker
                selectedValue={selectedStatus}
                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                dropdownIconColor="black"
                dropdownIconRippleColor="white"
                mode="dropdown"
                style={{ width: "90%" }}
              >
                {status.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.name}
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      color: "black",
                    }}
                  />
                ))}
              </Picker>
            </View>
            <View style={{ marginVertical: responsiveHeight(2) }}>
              {selectedStatus !== "not_work" && (
                <>
                  <View style={styles.container}>
                    <TextInput
                      style={styles.input}
                      placeholder="Paste username.."
                      placeholderTextColor="#8D8D8D"
                      value={searchText}
                      onChangeText={(text) => setSearchText(text)}
                    />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={searchUserHandler}
                    >
                      <Text style={styles.searchButtonText}>
                        {isLoadingSearch ? "Searching..." : "Search"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {selectedStatus !== "not_work" &&
                searchedUser &&
                Array.isArray(searchedUser) &&
                searchedUser.length > 0 &&
                searchedUser.map((user, index) => (
                  <UserItem
                    key={index}
                    profilePic={user?.profilePic?.url}
                    username={user?.username}
                    selected={selectedUsers.includes(user)}
                    onSelect={() => handleSelect(user)}
                  />
                ))}
            </View>

            {selectedStatus === "not_work" ? (
              <View className="w-[100%] justify-start items-center mb-4">
                <TouchableOpacity onPress={() => handleOkFunction()}>
                  <View
                    className="bg-black flex items-center justify-center py-2 px-5 rounded-md"
                    style={{ width: "25%" }}
                  >
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: responsiveFontSize(2),
                      }}
                    >
                      OK
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : selectedStatus === "assigned" &&
              selectedUsers &&
              Array.isArray(selectedUsers) &&
              selectedUsers.length > 0 ? (
              <View className="w-[100%] justify-start items-center mb-4">
                <TouchableOpacity onPress={() => handleOkFunction()}>
                  <View
                    className="bg-black flex items-center justify-center py-2 px-5 rounded-md"
                    style={{ width: "25%" }}
                  >
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: responsiveFontSize(2),
                      }}
                    >
                      OK
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : selectedStatus === "completed" &&
              selectedUsers &&
              Array.isArray(selectedUsers) &&
              selectedUsers.length > 0 ? (
              <View>
                <View className="w-[100%] justify-start items-center mb-4">
                  <TextInput
                    placeholder="Enter Khalti Number..."
                    className="my-4"
                    onChangeText={(e) => setKhaltiNumber(e)}
                  />
                  <TouchableOpacity onPress={() => handleOkFunction()}>
                    <View
                      className="bg-black flex items-center justify-center py-2 px-5 rounded-md"
                      style={{ width: "25%" }}
                    >
                      <Text
                        className="text-white"
                        style={{
                          fontFamily: "Montserrat-SemiBold",
                          fontSize: responsiveFontSize(2),
                        }}
                      >
                        OK
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.75),
    color: "#333333",
    fontFamily: "Montserrat-SemiBold",
  },
  searchButton: {
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default React.memo(ModalStatus);
