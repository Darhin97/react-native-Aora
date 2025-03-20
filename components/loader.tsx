import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Loader = () => {
  return (
    <SafeAreaView className={"bg-primary w-full h-full"}>
      <View className={"h-full justify-center items-center"}>
        <Text className={"animate-bounce text-2xl text-white"}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};
export default Loader;
