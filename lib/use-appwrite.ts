import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

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

export const useAppwrite = (fn: any) => {
  const [data, setData] = useState<VideoDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await fn();
      setData(res.documents);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};
