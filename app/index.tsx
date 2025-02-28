import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className={"flex flex-1 items-center justify-center bg-white"}>
      <StatusBar style={"auto"} />
      <Text className={"text-3xl font-pblack "}>Aora!</Text>
      <Link href={"/home"} style={{ color: "blue" }}>
        go to home
      </Link>
    </View>
  );
}
