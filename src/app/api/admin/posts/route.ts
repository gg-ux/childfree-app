import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  try {
    const posts = getAllPosts();

    // Return only what we need for the social export tool
    const simplifiedPosts = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      image: post.image,
    }));

    return NextResponse.json({ posts: simplifiedPosts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
