import UserTopItems from "@/services/UserTopItems";
import type User from "@/models/User";

export default async function getUserProfile(token: string): Promise<User> {
  try {
    const res = await UserTopItems.fetchProfile(token);
    return res.data;
  } catch (err) {
    throw err;
  }
}
