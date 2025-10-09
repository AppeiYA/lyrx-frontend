import { LikeResponse, TimelinePost, TimelineResponse } from "@/utils/types";
import apiRequest from "./apiClient";

export async function getTimelinePosts(): Promise<TimelineResponse> {
  return apiRequest("/api/posts", {
    method: "GET",
  });
}

export async function likeItem(
  itemId: string,
  item_type: string
): Promise<LikeResponse> {
  return apiRequest(`/api/posts/${item_type}/${itemId}/like`, {
    method: "POST",
  });
}

export async function unlikeItem(
  itemId: string,
  item_type: string
): Promise<LikeResponse> {
  return apiRequest(`/api/posts/${item_type}/${itemId}/unlike`, {
    method: "POST",
  });
}

export async function createPost(
  post_content: string,
  link?: string,
  post_image?: string,
): Promise<TimelinePost> {
  return apiRequest("/api/posts", {
    method: "POST",
    body: JSON.stringify({post_content: post_content, link, post_image})
  })
}
