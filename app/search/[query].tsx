import React, { useEffect } from "react";
import { View, Text, FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "@/components/search-input";

import EmptyState from "@/components/empty-state";
import { searchPosts } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/use-appwrite";
import VideoCard from "@/components/video-card";
import { useLocalSearchParams } from "expo-router";
import Loader from "@/components/loader";

const Search = () => {
  const { query } = useLocalSearchParams();

  const {
    data: posts,
    refetch,
    isLoading,
  } = useAppwrite(() => searchPosts(query as string));

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    };

    fetchData();
  }, [query]);

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
          <View className={"my-6 px-4"}>
            <Text className={"font-pmedium text-sm text-gray-100"}>
              Search results
            </Text>
            <Text className={"text-2xl font-psemibold text-white"}>
              {query}
            </Text>
            <View className={"mt-6 mb-8"}>
              <SearchInput initialQuery={query as string} />
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
export default Search;
