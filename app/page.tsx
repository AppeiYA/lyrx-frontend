"use client";

import Link from "next/link";
import { Music, Users, Heart, TrendingUp } from "lucide-react";
import { getTop10 } from "@/services/songService";
import { useState, useEffect } from "react";
import { log } from "console";
import { Top10Response } from "@/utils/types";

// const top10 = getTop10();
// console.log(top10);

const topSongs = [
  { rank: 1, title: "Flowers", artist: "Miley Cyrus", plays: "2.1B" },
  { rank: 2, title: "Anti-Hero", artist: "Taylor Swift", plays: "1.8B" },
  {
    rank: 3,
    title: "Unholy",
    artist: "Sam Smith ft. Kim Petras",
    plays: "1.6B",
  },
  { rank: 4, title: "As It Was", artist: "Harry Styles", plays: "1.5B" },
  {
    rank: 5,
    title: "I'm Good (Blue)",
    artist: "David Guetta & Bebe Rexha",
    plays: "1.4B",
  },
  { rank: 6, title: "Calm Down", artist: "Rema & Selena Gomez", plays: "1.3B" },
  { rank: 7, title: "Heat Waves", artist: "Glass Animals", plays: "1.2B" },
  { rank: 8, title: "Bad Habit", artist: "Steve Lacy", plays: "1.1B" },
  { rank: 9, title: "Golden Hour", artist: "JVKE", plays: "1.0B" },
  { rank: 10, title: "Shivers", artist: "Ed Sheeran", plays: "950M" },
];

export default function LandingPage() {
  const [top10SongsGlobal, setTop10SongsGlobal] = useState<Top10Response | null>(null);
  useEffect(() => {
    getTop10()
      .then((result) => {
        setTop10SongsGlobal(result);
        console.log(result);
      })
      .catch((err) => console.log("error: " + err.message));
  }, []);

  // console.log(top10SongsGlobal);
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                SoundShare
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/signin"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Share Your Music Taste
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with friends, discover new music, and share what you're
              listening to. Join the community where music lovers come together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
              >
                Get Started
              </Link>
              <Link
                href="/signin"
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-3 rounded-lg text-lg font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect with Friends
              </h3>
              <p className="text-gray-600">
                Follow friends and see what music they're sharing and enjoying.
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Discover New Music
              </h3>
              <p className="text-gray-600">
                Find your next favorite song through your network's
                recommendations.
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Stay Trending
              </h3>
              <p className="text-gray-600">
                Keep up with the most popular and engaging tracks worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 Songs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Top 10 Songs Worldwide
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {top10SongsGlobal &&
              top10SongsGlobal.data.map((song, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 ${
                    index !== top10SongsGlobal.data.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-lg font-bold text-gray-500">
                      #{index+1}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {song.track_name}
                    </h4>
                    <p className="text-sm text-gray-600">{song.artist_names}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Music className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">
                SoundShare
              </span>
            </div>
            <p className="text-gray-600">
              © 2025 SoundShare. Share your music taste with the world.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
