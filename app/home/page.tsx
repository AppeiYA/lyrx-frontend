"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Music,
  Heart,
  MessageCircle,
  Share,
  TrendingUp,
  Users,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast";
import { logout } from "@/services/authAPI";
import { set } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  createPost,
  getTimelinePosts,
  likeItem,
  unlikeItem,
} from "@/services/userAPI";
import { TimelinePost, TimelineResponse } from "@/utils/types";
import e from "express";
import socket from "@/utils/socket";

const mockPosts = [
  {
    id: 1,
    user: { username: "alex_music", avatar: "AM" },
    song: {
      title: "Midnight City",
      artist: "M83",
      album: "Hurry Up, We're Dreaming",
    },
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    caption:
      "This song never gets old! Perfect for late night coding sessions 🎧",
  },
  {
    id: 2,
    user: { username: "sarah_beats", avatar: "SB" },
    song: {
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
    },
    timestamp: "4 hours ago",
    likes: 89,
    comments: 12,
    caption: "Current mood! Can't stop dancing to this one 💫",
  },
  {
    id: 3,
    user: { username: "mike_vinyl", avatar: "MV" },
    song: { title: "Take Five", artist: "Dave Brubeck", album: "Time Out" },
    timestamp: "6 hours ago",
    likes: 45,
    comments: 8,
    caption:
      "Jazz classic that changed everything. The 5/4 time signature is genius!",
  },
];

const trendingSongs = [
  { title: "Flowers", artist: "Miley Cyrus", engagement: "2.1M" },
  { title: "Anti-Hero", artist: "Taylor Swift", engagement: "1.8M" },
  { title: "Unholy", artist: "Sam Smith", engagement: "1.6M" },
];

const userString = localStorage.getItem("user");
export const user: { id: string; username: string; email: string } = userString
  ? JSON.parse(userString)
  : null;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [postText, setPostText] = useState<string>("");
  const [likes, setLikes] = useState<number | null>(null);
  const [timelinePosts, setTimelinePosts] = useState<TimelineResponse | null>(
    null
  );
  const { toast } = useToast();
  const router = useRouter();

  // handle post input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostText(event.target.value);
  };

  const handleShare = async () => {
    if (postText.trim() === "") {
      return;
    }

    await createPost(postText.trim())
    .catch((err) => console.log("error: " + err.message));
  };

  useEffect(() => {
    // Fetch posts from the server
    getTimelinePosts()
      .then((result) => {
        const postsArray = Object.values(result).filter(
          (item): item is TimelinePost =>
            typeof item === "object" && "id" in item
        );

        setTimelinePosts({
          message: result.message,
          posts: postsArray,
        });
      })
      .catch((err) => console.log("error: " + err.message));

    // Listen for new posts from socket.io
    const handleNewPost = (newPost: TimelinePost) => {
      setTimelinePosts((prev) => {
        if (!prev) return { posts: [newPost], message: "" };

        return {
          ...prev,
          posts: [newPost, ...(prev.posts || [])],
        };
      });
    };

    socket.on("newPost", handleNewPost);

    return () => {
      socket.off("newPost", handleNewPost);
    };
  }, []);

  useEffect(() => {
    if (timelinePosts && user?.id) {
      const likedIds = timelinePosts.posts
        .filter((post) => post.likes.some((like) => like.id === user.id))
        .map((post) => post.id);

      setLikedPosts(likedIds);
    }
  }, [timelinePosts, user?.id]);
  console.log("Timeline posts", timelinePosts);

  const handleLike = async (
    e: React.FormEvent,
    item_id: string,
    item_type: string
  ) => {
    e.preventDefault();

    try {
      if (!likedPosts.includes(item_id)) {
        const likePost = await likeItem(item_id, item_type);

        timelinePosts &&
          setTimelinePosts((prev) => {
            if (!prev) return prev;

            const updatedPosts = prev.posts.map((post) => {
              if (post.id === item_id) {
                const alreadyLiked = post.likes.some(
                  (like) => like.id === user.id
                );

                // Update only the target post
                if (!alreadyLiked) {
                  return {
                    ...post,
                    likes: [
                      ...post.likes,
                      { id: user.id, username: user.username },
                    ],
                    likes_count: String(likePost.Likes),
                  };
                } else {
                  // if already liked, maybe skip or handle unlike logic
                  return {
                    ...post,
                    likes_count: String(likePost.Likes),
                  };
                }
              }
              return post;
            });

            return {
              ...prev,
              posts: updatedPosts,
            };
          });
      } else {
        const unlikePost = await unlikeItem(item_id, item_type);

        timelinePosts &&
          setTimelinePosts((prev) => {
            if (!prev) return prev;

            const updatedPosts = prev.posts.map((post) => {
              if (post.id === item_id) {
                const alreadyLiked = post.likes.some(
                  (like) => like.id === user.id
                );

                // Only modify the specific post
                if (alreadyLiked) {
                  return {
                    ...post,
                    likes: post.likes.filter((like) => like.id !== user.id),
                    likes_count: String(unlikePost.Likes),
                  };
                }
              }

              return post;
            });

            return {
              ...prev,
              posts: updatedPosts,
            };
          });
      }
    } catch (err) {}
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await logout();

      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (err) {
      console.log("An error occured", err);
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "Please try again",
      });
    }
    // alert("Logout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                {/* <Music className="h-8 w-8 text-green-600" /> */}
                <span className="text-2xl font-bold text-gray-900">Lyrx</span>
              </Link>

              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search songs, artists, friends..."
                    className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Users className="h-6 w-6" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-white text-sm font-medium">{user?.username.slice(0,1) || "U"}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <button onClick={handleLogout}>Log-out</button>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trending Today
              </h3>
              <div className="space-y-4">
                {trendingSongs.map((song, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {song.artist}
                      </p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      {song.engagement}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Share a Song
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Find Friends
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  My Playlists
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Share Box */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user?.username.slice(0,1) || "U"}</span>
                </div>
                <input
                  type="text"
                  value={postText}
                  onChange={handleInputChange}
                  placeholder="Share a song you're loving..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button onClick={handleShare} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium">
                  Share
                </button>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
              {timelinePosts &&
                timelinePosts.posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-700 text-sm font-medium">
                            {post.user.username[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {post.user.username}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {post.createdat &&
                              new Date(
                                post.createdat.substring(0, 23)
                              ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Song Info */}
                    {/* <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Music className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {post.song.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {post.song.artist}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.song.album}
                            </p>
                          </div>
                          <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700">
                            <Music className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      </div> */}

                    {/* Post Content */}
                    <div className="p-4">
                      <p className="text-gray-900 mb-4">{post.content}</p>

                      {/* Actions */}
                      <div className="flex items-center space-x-6">
                        <button
                          className="flex items-center space-x-2 text-gray-500 hover:text-red-500"
                          onClick={(e) => handleLike(e, post.id, "post")}
                        >
                          <Heart
                            className={`h-5 w-5 cursor-pointer ${
                              likedPosts.includes(post.id)
                                ? "text-red-500 fill-red-500"
                                : "text-gray-500"
                            }`}
                          />
                          <span className="text-gray-500 text-sm">
                            {post.likes_count}
                          </span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm">
                            {post.comments.length}
                          </span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                          <Share className="h-5 w-5" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
