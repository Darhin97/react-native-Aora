import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "@/components/search-input";

import EmptyState from "@/components/empty-state";
import { getUserPosts, searchPosts, signOut } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/use-appwrite";
import VideoCard from "@/components/video-card";
import { useGlobalContext } from "@/context/global-provider";
import { icons } from "@/constants";
import InfoBox from "@/components/info-box";
import { router } from "expo-router";
import Loader from "@/components/loader";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const { data: posts, isLoading } = useAppwrite(() =>
    getUserPosts(user.$id as string),
  );

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  // handles loading
  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View
            className={"w-full justify-center items-center mt-6 mb-12 px-4"}
          >
            <TouchableOpacity
              className={"w-full items-end mb-10"}
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode={"contain"}
                className={"w-6 h-6"}
              />
            </TouchableOpacity>
            <View
              className={
                "w-16 h-16 border border-secondary rounded-lg justify-center items-center"
              }
            >
              <Image
                source={{ uri: user?.avatar }}
                className={"w-[90%] h-[90%] rounded-lg"}
                resizeMode={"cover"}
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles={"mt-5"}
              titleStyles={"text-lg"}
            />
            <View className={"mt-5 flex-row"}>
              <InfoBox
                title={posts.length || 0}
                subtitle={"Posts"}
                containerStyles={"mr-10"}
                titleStyles={"text-xl"}
              />
              <InfoBox
                title={"1.2k"}
                subtitle={"Followers"}
                titleStyles={"text-xl"}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No Videos Found"}
            subtitle={"No videos found for this search query"}
          />
        )}
      />
    </SafeAreaView>
  );
};
export default Profile;
