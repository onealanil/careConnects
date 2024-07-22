import React, { memo, useCallback, useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import IconIcons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Conversation from "../GlobalComponents/Conversation";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalStore } from "../../global/store";
import { ErrorToast } from "../../components/ErrorToast";
import { FlashList } from "@shopify/flash-list";
import { MessageStore } from "./helper/MessageStore";
import { useMessageStore } from "../../global/MessageCount";

const Message = ({ navigation }) => {
  const isFocused = useIsFocused();
  const user = useGlobalStore((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await MessageStore.getState().getAllConversation();
      setConversations(response?.result);
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      getConversations();
    }
  }, [getConversations]);

  const readAllMessages = useCallback(async (conversation_id) => {
    try {
      await MessageStore.getState().readAllMessage(conversation_id);
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
  }, []);

  const clickedConversationHandler = useCallback(
    (conversationId) => {
      navigation.navigate("Actual_Message", {
        conversation_id: conversationId,
      });
      readAllMessages(conversationId);
    },
    [navigation, readAllMessages]
  );

  if (isLoading) {
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
    <View className="bg-white" style={{ marginTop: responsiveHeight(5) }}>
      <View
        className="w-[100%] flex flex-col"
        style={{ padding: responsiveHeight(2) }}
      >
        {/* back button */}
        <View className="mb-2 flex flex-row justify-between items-center gap-x-2">
          <TouchableOpacity onPress={() => navigation.navigate("Home_bottom")}>
            <IconIcons name="chevron-back-sharp" size={30} color="gray" />
          </TouchableOpacity>
          <View className="flex flex-row items-center gap-x-1">
            <Text
              className="text-black"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveHeight(2),
              }}
            >
              {user?.username}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={25} color="black" />
          </View>
          <Feather name="edit" size={25} color="black" />
        </View>

        {/* message start  */}
        <View className="flex flex-row items-center justify-between">
          <View className="w-[50%] py-3">
            <Text
              className="text-black"
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveFontSize(2),
              }}
            >
              Messages
            </Text>
          </View>
        </View>

        {/* Conversation Start  */}
        <View
          style={{ height: responsiveHeight(80), width: responsiveWidth(90) }}
        >
          <FlashList
            keyExtractor={(item) => item._id.toString()}
            estimatedItemSize={100}
            data={conversations}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  paddingBottom:
                    item.length < 2
                      ? responsiveHeight(15)
                      : responsiveHeight(1),
                }}
                onPress={() => clickedConversationHandler(item._id.toString())}
              >
                <MemoizedConversation data={item} onlineUsers={onlineUsers} />
              </TouchableOpacity>
            )}
            contentContainerStyle={{
              paddingBottom: responsiveHeight(65),
              paddingTop: responsiveHeight(2),
            }}
            ListEmptyComponent={() => (
              // Render this component when there's no data
              <View style={{ paddingBottom: responsiveHeight(25) }}>
                <Text
                  className="text-color2"
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: responsiveFontSize(1.75),
                  }}
                >
                  No Conversations
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const MemoizedConversation = memo(({ data }) => <Conversation data={data} />);

export default Message;
