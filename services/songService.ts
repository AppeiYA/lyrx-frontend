import { Top10Response } from "@/utils/types";
import apiRequest from "./apiClient";

export async function getTop10(): Promise<Top10Response> {
  return apiRequest("/api/songs/topSongs");
}
