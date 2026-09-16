"use client";

import CommentSection from "@/components/CommentSection";

export default function CommentsWrapper({ postSlug }: { postSlug: string }) {
  return <CommentSection postSlug={postSlug} />;
}