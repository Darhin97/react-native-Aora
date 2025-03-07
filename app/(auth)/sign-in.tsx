import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import { Link, router } from "expo-router";
import { signIn } from "@/lib/appwrite";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submit = async () => {
    // console.log({ form });
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
    }
    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      //   set it to global state

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Sign in Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <ScrollView>
        <View className={"w-full min-h-[80vh] px-4 my-10"}>
          <Image
            source={images.logo}
            resizeMode={"contain"}
            className={"w-[115px] h-[35px]"}
          />
          <Text className={"text-2xl text-white font-psemibold mt-10"}>
            Log in to Aora
          </Text>
          <FormField
            title={"Email"}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={"mt-7"}
            keyboardType="email-address"
          />
          <FormField
            title={"Password"}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={"mt-7"}
            keyboardType="email-address"
          />
          <CustomButton
            title={"Sign In"}
            handlePress={submit}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />
          <View className={"justify-center pt-5 flex-row gap-2"}>
            <Text className={"text-lg text-gray-100 font-pregular"}>
              Dont have account?
            </Text>
            <Link
              href={"/sign-up"}
              className={"text-lg font-psemibold text-secondary underline"}
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignIn;
