import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.lupi.flora",
  projectId: "67c2fefd00356abaeed8",
  databaseId: "67c301f4000331457dc2",
  userCollectionId: "67c3021a00323632d051",
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

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
    );
    return posts.documents;
  } catch (e: any) {
    console.error(e);
    throw new Error("Something went wrong", e);
  }
};
