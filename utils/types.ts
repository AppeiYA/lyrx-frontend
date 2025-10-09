export interface Song {
  rank: string;
  uri: string;
  artist_names: string;
  track_name: string;
  source: string;
  peak_rank: string;
  previous_rank: string;
  weeks_on_chart: string;

  // optional because your API sometimes includes it
  "streams "?: string; 
}

export interface Top10Response {
  message: string;
  data: Song[];
}

export interface TimelinePost {
  message?: string;
  id: string;
  user_id: string;
  content: string;
  post_image: string;
  link: string;
  createdat: string;
  updatedat: string;

  user: {
    id: string;
    username: string;
  };

  likes: Array<{
    id: string;
    username: string;
  }>;

  likes_count: string;

  comments: Array<{
    id: string;
    content: string;
    user_id: string;
    createdAt: string;
  }>;
}

// export interface TimelineResponse {
//   [key: string]: TimelinePost | string;
//   message: string;
// }

export interface TimelineResponse {
  message: string;
  posts: TimelinePost[];
}


export interface LikeResponse {
  message: string;
  Likes: number;
}
