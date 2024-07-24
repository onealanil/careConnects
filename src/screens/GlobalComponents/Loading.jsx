import { View, Image, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";

const Loading = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    // Or set a specific startFrame and endFrame with:
    animationRef.current?.play(5, 50);
  }, []);

  return (
    <View className="flex items-center justify-center h-[100%] bg-white">
      <Image source={require("../../../assets/logo.png")} style={{ width: 200, height: 200 }} />
      <View className="mt-[-30px]">
        <LottieView
          source={require("../../../assets/animation/P2P9GT0Xpl.json")}
          ref={animationRef}
          style={{ width: 500, height: 200 }}
        />
      </View>
    </View>
  );
};

export default Loading;
