import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Models,
  Storage,
} from "react-native-appwrite";
import { FormProps } from "@/app/(tabs)/create";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.lupi.flora",
  projectId: "67c2fefd00356abaeed8",
  databaseId: "67c301f4000331457dc2",
  userCollectionId: "67dc02cc002c0aa483d1",
  videoCollectionId: "67c3024c003831737aa7",
  storageId: "67c31262003b877559e3",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

interface Creator {
  username: string;
  email: string;
  avatar: string;
  accountId: string;
}

interface VideoDocument extends Models.Document {
  total: number;
  documents: {
    title: string;
    thumbnail: string;
    prompt: string;
    video: string;
    creator: Creator;
  }[];
}

export const createUser = async (
  email: string,
  password: any,
  username: string,
) => {
  // Register User
  try {
    // creates user auth account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newAccount) throw new Error("Something went wrong");

    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    // save user in db users
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      },
    );

    return newUser;
  } catch (err: any) {
    console.error(err);
    throw new Error(`Failed to create account: ${err.message}`);
  }
};

export const signIn = async (email: string, password: any) => {
  try {
    // const session = await account.createEmailPasswordSession(email, password);
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (e) {
    throw new Error(`Something went wrong: ${e}`);
  }
};

export const getCurrentUser = async () => {
  const currentAccount = await account.get();

  if (!currentAccount) throw Error(`Something went wrong`);

  const currentUser = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("accountId", currentAccount.$id)],
  );

  if (!currentUser) throw new Error("Something went wrong");

  return currentUser.documents[0];
};

export const getAllPosts = async (): Promise<
  Models.DocumentList<VideoDocument>
> => {
  try {
    const posts = await databases.listDocuments<VideoDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt")],
    );

    return posts;
  } catch (e: any) {
    console.error(e);
    throw new Error("Something went wrong", e);
  }
};

export const getLatestPosts = async (): Promise<
  Models.DocumentList<VideoDocument>
> => {
  try {
    const posts = await databases.listDocuments<VideoDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)],
    );

    return posts;
  } catch (e: any) {
    console.error(e);
    throw new Error("Something went wrong", e);
  }
};

export const searchPosts = async (
  query: string,
): Promise<Models.DocumentList<VideoDocument>> => {
  try {
    const posts = await databases.listDocuments<VideoDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      query ? [Query.search("title", query)] : undefined,
    );

    return posts;
  } catch (e: any) {
    console.error(e);
    throw new Error("Something went wrong", e);
  }
};

export const getUserPosts = async (
  userId: string,
): Promise<Models.DocumentList<VideoDocument>> => {
  try {
    const posts = await databases.listDocuments<VideoDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)],
    );

    return posts;
  } catch (e: any) {
    console.error(e);
    throw new Error("Something went wrong", e);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (e) {
    throw new Error(`Failed to logout: ${e}`);
  }
};

// uploading file
export const getFilePreview = async (fileId: string, type: string) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        // @ts-ignore
        "top",
        100,
      );
    } else {
      throw new Error(`Unknown type ${type}`);
    }

    if (!fileUrl) {
      throw new Error(`Something went wrong`);
    }

    return fileUrl;
  } catch (e: any) {
    throw new Error(`Something went wrong: ${e}`);
  }
};

export const uploadFile = async (file: any, type: string) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset,
    );

    //  get file url
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (e) {
    throw new Error(`Failed to upload video: ${e}`);
  }
};

export const createVideo = async (form: any) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      },
    );
    return newPost;
  } catch (e) {
    throw new Error(`Failed to create video: ${e}`);
  }
};
