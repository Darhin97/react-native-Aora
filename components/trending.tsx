import React, { useState } from "react";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { Models } from "react-native-appwrite";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";

interface Creator {
  username: string;
  email: string;
  avatar: string;
  accountId: string;
}

interface VideoDocument extends Models.Document {
  title: string;
  thumbnail: string;
  prompt: string;
  video: string;
  creator: Creator;
}
interface TrendingProps {
  posts: VideoDocument[] | [];
}

type Iprop = {
  post: VideoDocument;
  activeItem: string | VideoDocument;
};

const zoomIn: any = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};
const zoomOut: any = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ post, activeItem }: Iprop) => {
  const v =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const player = useVideoPlayer(v, (player) => {
    player.staysActiveInBackground = true;
    if (player.duration === player.currentTime) {
      player.pause();
    }
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const playVideo = () => player.play();

  console.log("isPlaying", isPlaying);

  return (
    <Animatable.View
      className={"mr-5"}
      animation={activeItem === post.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {isPlaying ? (
        <View
          className={
            "w-[208px] h-72  mt-3 bg-white/10 relative items-center justify-center"
          }
        >
          <VideoView
            player={player}
            allowsFullscreen={true}
            contentFit={"contain"}
            nativeControls={true}
            style={{
              width: 208,
              height: 288,
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          className={"relative justify-center items-center"}
          activeOpacity={0.7}
          onPress={playVideo}
        >
          <ImageBackground
            source={{ uri: post.thumbnail }}
            className={
              "w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            }
            resizeMode={"cover"}
          />
          <Image
            source={icons.play}
            className={"w-12 h-12 absolute"}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: TrendingProps) => {
  const [active, setActive] = useState(posts[0]);

  // @ts-ignore
  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActive(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem post={item} activeItem={active} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 80,
      }}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
      className={"px-4"}
    />
  );
};

export default Trending;
