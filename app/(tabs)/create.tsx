import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/form-field";
import { useVideoPlayer, VideoView } from "expo-video";
import { icons } from "@/constants";
import CustomButton from "@/components/custom-button";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/global-provider";

export interface FormProps {
  title: string;
  video: null | any;
  thumbnail: null | any;
  prompt: string;
}

const Create = () => {
  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormProps>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  // video player
  //@ts-ignore
  const player = useVideoPlayer(form.video?.uri, (player) => {
    player.staysActiveInBackground = true;
  });

  const openPicker = async (selectType: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "image" ? "images" : "videos",
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.video || !form.prompt || !form.thumbnail || !form.title) {
      return Alert.alert("Please fill all the fields");
    }
    setUploading(true);
    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });
      Alert.alert("Success", "Post uploaded");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Something went wrong", error.message);
    } finally {
      setForm({ title: "", video: null, thumbnail: null, prompt: "" });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <Text className={"text-2xl text-white px-4 mt-7"}>Upload Video</Text>
      <KeyboardAvoidingView behavior={"height"}>
        <ScrollView className={"px-4 mb-6"}>
          <FormField
            title={"Video Title"}
            value={form.title}
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles={"mt-10"}
            placeholder={"Give your video a catchy title..."}
          />
          <View className={"mt-7 space-y-2"}>
            <Text className={"text-base text-gray-100 font-pmedium"}>
              Upload Video
            </Text>
            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <VideoView
                  player={player}
                  contentFit={"contain"}
                  style={{
                    width: "100%",
                    height: 256,
                  }}
                />
              ) : (
                <View
                  className={
                    "w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center"
                  }
                >
                  <View
                    className={
                      "w-14 h-14 border border-secondary-100 border-dashed justify-center items-center"
                    }
                  >
                    <Image
                      source={icons.upload}
                      resizeMode={"contain"}
                      className={"w-1/2 h-1/2"}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className={"mt-7 space-y-2"}>
            <Text className={"text-base text-gray-100 font-pmedium"}>
              Thumbnail Image
            </Text>
            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.thumbnail ? (
                <Image
                  //@ts-ignore
                  source={{ uri: form.thumbnail?.uri }}
                  resizeMode={"cover"}
                  className={"w-full h-64 rounded-2xl"}
                />
              ) : (
                <View
                  className={
                    "w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2"
                  }
                >
                  <Image
                    source={icons.upload}
                    resizeMode={"contain"}
                    className={"w-5 h-5 mr-2"}
                  />
                  <Text className={"text-sm text-gray-100 font-pmedium"}>
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title={"AI Prompt"}
            value={form.prompt}
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            otherStyles={"mt-7"}
            placeholder={"The prompt you use to create this video..."}
          />
          <CustomButton
            title={"Submit & Publish"}
            handlePress={submit}
            containerStyles={"mt-7"}
            isLoading={uploading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Create;
