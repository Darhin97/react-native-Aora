import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardTypeOptions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

interface FormFieldProps {
  initialQuery?: string;
  keyboardType?: KeyboardTypeOptions;
}

const SearchInput = ({ initialQuery, keyboardType }: FormFieldProps) => {
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View
      className={"w-full h-16  bg-black-100 relative space-x-4 rounded-2xl"}
    >
      <TextInput
        className={
          "text-base mt-0.5 text-white flex-1 font-pregular px-4  border-2 border-black-200 focus:border-secondary rounded-2xl"
        }
        value={query}
        placeholder={"Search for a video topic..."}
        placeholderTextColor={"#cdcde0"}
        autoCapitalize={"none"}
        autoCorrect={false}
        onChangeText={(e) => setQuery(e)}
        keyboardType={keyboardType ?? "default"}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query!",
              "Please input something to search results across database",
            );
          }
          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image
          source={icons.search}
          className={"w-6 h-6 absolute right-5 -top-11"}
          resizeMode={"contain"}
        />
      </TouchableOpacity>
    </View>
  );
};
export default SearchInput;
