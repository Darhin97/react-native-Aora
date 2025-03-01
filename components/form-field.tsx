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
  title: string;
  value: string;
  handleChangeText: (e: any) => void;
  otherStyles: string;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
}

const FormField = ({
  title,
  value,
  handleChangeText,
  keyboardType,
  otherStyles,
  placeholder,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={"text-base text-gray-100 font-pmedium"}>{title}</Text>
      <View className={"w-full h-16  bg-black-100 relative rounded-2xl"}>
        <TextInput
          className={
            "flex-1 text-white font-psemibold text-base px-4  border-2 border-black-200 focus:border-secondary rounded-2xl"
          }
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          autoCapitalize={"none"}
          autoCorrect={false}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType ?? "default"}
        />
        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className={"absolute top-1/4 right-5"}
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              resizeMode={"contain"}
              className={"w-8 h-8"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default FormField;
