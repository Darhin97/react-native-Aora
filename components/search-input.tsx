import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardTypeOptions,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

interface FormFieldProps {
  value: string;
  handleChangeText: (e: any) => void;
  keyboardType?: KeyboardTypeOptions;
}

const SearchInput = ({
  value,
  handleChangeText,
  keyboardType,

  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View
      className={"w-full h-16  bg-black-100 relative space-x-4 rounded-2xl"}
    >
      <TextInput
        className={
          "text-base mt-0.5 text-white flex-1 font-pregular px-4  border-2 border-black-200 focus:border-secondary rounded-2xl"
        }
        value={value}
        placeholder={"Search for a video topic..."}
        placeholderTextColor={"#7b7b8b"}
        autoCapitalize={"none"}
        autoCorrect={false}
        onChangeText={handleChangeText}
        keyboardType={keyboardType ?? "default"}
      />
      <TouchableOpacity>
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
