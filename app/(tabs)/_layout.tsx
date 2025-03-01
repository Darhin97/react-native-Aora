import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants";

interface TabsIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon = ({ icon, color, name, focused }: TabsIconProps) => {
  return (
    <View className={"flex items-center justify-center gap-y-2 pt-2 "}>
      <Image
        source={icon}
        resizeMode={"contain"}
        tintColor={color}
        className={"w-6 h-6"}
      />
      {/*<Text*/}
      {/*  className={`${focused ? "font-psemibold" : "font-pregular"} ${width > 375 ? "text-xs" : "text-[9px]"}`}*/}
      {/*>*/}
      {/*  {name}*/}
      {/*</Text>*/}
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          // tabBarShowLabel: false,
          tabBarLabelStyle: {
            paddingTop: 7,
            fontFamily: "Poppins-SemiBold",
            fontSize: 10,
          },
          tabBarActiveTintColor: "#ffa001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name={"home"}
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name={"Home"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={"bookmark"}
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name={"Bookmark"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={"create"}
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name={"Create"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={"profile"}
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name={"Profile"}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};
export default TabsLayout;
