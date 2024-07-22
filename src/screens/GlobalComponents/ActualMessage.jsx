import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { memo, useCallback, useEffect, useRef } from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import IonIcons from "react-native-vector-icons/Ionicons";
//   import {MessageStore} from './helper/MessageStore';
import { useGlobalStore } from "../../global/store";
import { ErrorToast } from "../../components/ErrorToast";
import { useIsFocused } from "@react-navigation/native";
import { Linking, Platform } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { FlashList } from "@shopify/flash-list";
import { MessageStore } from "../RegularUser/helper/MessageStore";
import { useMessageStore } from "../../global/MessageCount";

const ActualMessage = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const user = useGlobalStore((state) => state.user);
  const [messages, setMessages] = React.useState([]);
  const [otherUser, setOtherUser] = React.useState({});
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const flatListRef = useRef(null);

  // Function to scroll to the bottom of the message list
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // fetch messages
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await MessageStore.getState().getAllMessages(
        route.params.conversation_id
      );
      setMessages(response.result);
      setOtherUser(response.otheruser);
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
    setIsLoading(false);
  }, [route.params.conversation_id]);

  // read all messages
  const readAllMessages = useCallback(async () => {
    try {
      await MessageStore.getState().readAllMessage(
        route.params.conversation_id
      );
      useMessageStore.setState(state => ({
        messageCount: 0,
      }));
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
  }, [route.params.conversation_id]);

  //fetch unread message count
  const featchUnreadMessageCount = useCallback(async () => {
    await useMessageStore.getState().unreadMessageCount();
  }, []);

  useEffect(() => {
    if (isFocused && route.params?.conversation_id) {
      featchUnreadMessageCount();
      readAllMessages();
      fetchMessages();
    }
  }, [
    isFocused,
    route.params?.conversation_id,
    readAllMessages,
    featchUnreadMessageCount,
    fetchMessages,
  ]);

  const sendMessageHandler = useCallback(
    async (e) => {
      setMessage("");
      try {
        if (!message || message === "") return;
        e.preventDefault();
        const data = {
          conversationId: route.params?.conversation_id,
          msg: message,
          recipientId: otherUser?._id,
        };

        const response = await MessageStore.getState().createMessage(data);
        if (response) {
          setMessage("");
          setMessages((prev) => [response?.messages, ...prev]);
        }
      } catch (error) {
        const errorMessage = error
          .toString()
          .replace("[Error: ", "")
          .replace("]", "");
        ErrorToast(errorMessage);
      }
    },
    [message, otherUser?._id, route.params?.conversation_id, user?._id]
  );
  // phone handler
  const phoneHandler = useCallback(() => {
    const phoneNumber = "9833035830";
    let phoneNumberWithPrefix = "";

    if (Platform.OS === "android") {
      phoneNumberWithPrefix = `tel:${phoneNumber}`;
    } else if (Platform.OS === "ios") {
      phoneNumberWithPrefix = `telprompt:${phoneNumber}`;
    }

    Linking.openURL(phoneNumberWithPrefix).catch((err) =>
      console.error("An error occurred: ", err)
    );
  }, []);

  //back button handler
  const backbottonHandler = useCallback(() => {
    setMessages([]);
    navigation.navigate("Message");
  }, [navigation]);

  if (isLoading || (Array.isArray(messages) && messages.length === 0)) {
    return (
      <View
        className="w-[100%] flex items-center justify-center"
        style={{ marginTop: responsiveHeight(10) }}
      >
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <React.Fragment>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Header content */}
          <TouchableOpacity onPress={backbottonHandler}>
            <IonIcons name="chevron-back-sharp" size={30} color="gray" />
          </TouchableOpacity>
          <View style={styles.profile}>
            {otherUser?.profilePic?.url && (
                <Image
                  source={{uri: otherUser?.profilePic?.url}}
                  style={styles.profileImage}
                />
              )}
            <Text style={styles.profileName} className="text-black">
              {otherUser?.username}
            </Text>
          </View>
          <TouchableOpacity onPress={phoneHandler}>
            <IonIcons name="call" size={30} color="#79AC78" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: responsiveHeight(80),
            width: responsiveWidth(100),
          }}
        >
          <FlatList
            ref={flatListRef}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom} // Add this line
            keyExtractor={(item, index) => index.toString()}
            // estimatedItemSize={100}
            initialNumToRender={10}
            data={messages.slice().reverse()}
            renderItem={({ item }) => (
              <Messages data={item} otheruser={otherUser} />
            )}
            contentContainerStyle={{
              paddingBottom: responsiveHeight(5),
              paddingTop: responsiveHeight(2),
            }}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          style={styles.textInput}
          placeholderTextColor={"gray"}
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessageHandler}
        >
          <IonIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
};

const Messages = React.memo(({ data, otheruser }) => {
  const user = useGlobalStore((state) => state.user);
  const screenWidth = Dimensions.get("window").width;
  const maxWidth = screenWidth * 0.8;

  return (
    <>
      {/* Message content */}
      {data && data?.senderId === user?._id ? (
        <>
          <View style={styles.messageOther} className="w-[100%] flex items-end">
            <View style={styles.messageContent} className="">
              <View
                style={[styles.messageTextContainer, { maxWidth }]}
                className={`bg-black flex flex-col gap-y-1 ${
                  data?.msg.length > 38 && "w-[80%]"
                }`}
              >
                <Text style={styles.messageText}>{data?.msg}</Text>
                <Text
                  className="text-white"
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: responsiveFontSize(1.25),
                  }}
                >
                  {formatDistanceToNow(new Date(data?.createdAt), {
                    addSuffix: true,
                  })}
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.message}>
          <View style={styles.messageContent}>
            {otheruser?.profilePic?.url && (
              <Image
                source={{ uri: otheruser?.profilePic?.url }}
                style={styles.messageImage}
              />
            )}
            <View
              style={[styles.messageTextContainerMe, { maxWidth }]}
              className={`bg-[#f0f5f8] flex flex-col gap-y-1 ${
                data?.msg.length > 38 && "w-[80%]"
              }`}
            >
              <Text style={styles.messageTextMe}>{data?.msg}</Text>
              <Text
                className="text-black"
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: responsiveFontSize(1.25),
                }}
              >
                {formatDistanceToNow(new Date(data?.createdAt), {
                    addSuffix: true,
                  })}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: responsiveHeight(5),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    borderRadius: responsiveHeight(5) / 2,
  },
  profileName: {
    fontFamily: "Montserrat-Bold",
    fontSize: responsiveHeight(2),
    marginLeft: responsiveHeight(1),
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: responsiveHeight(2),
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "gray",
    backgroundColor: "white",
    paddingHorizontal: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
    paddingTop: responsiveHeight(1),
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
    color: "black",
    fontFamily: "Montserrat-SemiBold",
  },
  sendButton: {
    backgroundColor: "#79AC78",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    flexDirection: "row",
    paddingHorizontal: responsiveHeight(2),
    paddingVertical: responsiveHeight(1),
  },
  messageOther: {
    paddingHorizontal: responsiveHeight(2),
    paddingVertical: responsiveHeight(1),
  },
  messageContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageImage: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    borderRadius: responsiveHeight(5) / 2,
  },
  messageTextContainer: {
    borderRadius: 20,
    marginLeft: 10,
    padding: 10,
    flexShrink: 1,
  },
  messageTextContainerMe: {
    borderRadius: 20,
    marginRight: 10,
    padding: 10,
    flexShrink: 1,
  },
  messageTextMe: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: responsiveFontSize(1.5),
    color: "black",
  },
  messageText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: responsiveFontSize(1.5),
    color: "white",
  },
});

export default React.memo(ActualMessage);
