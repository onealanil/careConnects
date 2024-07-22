import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect } from "react";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import {formatDistanceToNow} from 'date-fns';
import { useIsFocused } from "@react-navigation/native";
import { useGlobalStore } from "../../global/store";
import { ErrorToast } from "../../components/ErrorToast";
import { MessageStore } from "../RegularUser/helper/MessageStore";

const Conversation = ({ data }) => {
  const isFocused = useIsFocused();
  const user = useGlobalStore((state) => state.user);
  const [lastMessage, setLastMessage] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const getLastMesssage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await MessageStore.getState().getLastMessage(data?._id);
      setLastMessage(response.result);
    } catch (error) {
      const errorMessage = error
        .toString()
        .replace("[Error: ", "")
        .replace("]", "");
      ErrorToast(errorMessage);
    }
    setIsLoading(false);
  }, [data?._id]);

  useEffect(() => {
    if (isFocused) {
      getLastMesssage();
    }
  }, [isFocused, getLastMesssage]);

  return (
    <View className="flex pl-5 flex-row gap-x-5 py-2 rounded-md border-b-[1.5px] border-[#e5e8e9]">
      {/* image  */}
      <View>
        <Image
          source={{ uri: data?.conversation[0]?.profilePic.url }}
          style={{
            width: responsiveHeight(8),
            height: responsiveHeight(8),
            borderRadius: responsiveHeight(8) / 2,
          }}
        />
      </View>
      {/* other things */}
      <View className="flex flex-col justify-center gap-y-1">
        {/* name  */}
        <View className="flex flex-row gap-x-20">
          <Text
            className="text-black"
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: responsiveFontSize(2),
            }}
          >
            {data?.conversation[0]?.username}
          </Text>
          <Text
            className="text-color2"
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: responsiveFontSize(1.5),
            }}
          >
            {lastMessage &&
              lastMessage[0]?.createdAt &&
              formatDistanceToNow(new Date(lastMessage[0]?.createdAt))}
          </Text>
        </View>
        {/* message  */}
        <View>
          {isLoading ? (
            <ActivityIndicator color={"black"} />
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: responsiveFontSize(1.5),
                color:
                  lastMessage[0]?.senderId !== user?._id
                    ? lastMessage[0]?.isRead
                      ? "#888"
                      : "red"
                    : "gray",
              }}
            >
              {lastMessage[0]?.msg}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messagePlaceholder: {
    width: responsiveHeight(20),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
  },
});

export default React.memo(Conversation);
