"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useUserAuth } from "./UserAuthProvider";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Comment {
  id: number;
  post_slug: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
    homepage: string;
  } | null;
}

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const { user, profile } = useUserAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(username, avatar_url, homepage)")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: true });

    if (data) {
      setComments(data as unknown as Comment[]);
    }
    setLoading(false);
  }, [postSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    setError("");

    const { error: submitError } = await supabase.from("comments").insert({
      post_slug: postSlug,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (submitError) {
      setError(submitError.message);
    } else {
      setNewComment("");
      fetchComments();
    }

    setSubmitting(false);
  };

  const handleDelete = async (commentId: number) => {
    setDeletingId(commentId);
    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (!deleteError) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
    setDeletingId(null);
  };

  return (
    <div className="mt-16">
      <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
        评论
      </h3>
      <p className="text-sm text-muted-foreground mb-8">
        {comments.length} 条评论
      </p>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <span>
              以 <span className="font-medium text-foreground">{profile?.username || user.email}</span> 的身份评论
            </span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的想法..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm resize-y"
            aria-label="写评论"
          />
          <div className="flex items-center justify-between mt-2">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="ml-auto px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "发送中..." : "发表评论"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-5 rounded-xl border bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            请先登录后再发表评论
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">加载评论中...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          暂无评论，来发表第一条吧
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                {(comment.profiles?.username || "U")[0].toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {comment.profiles?.homepage ? (
                    <a
                      href={comment.profiles.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:text-primary-light transition-colors no-underline"
                    >
                      {comment.profiles.username}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-foreground">
                      {comment.profiles?.username || "匿名用户"}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.created_at), "yyyy/M/d HH:mm", { locale: zhCN })}
                  </span>
                </div>

                <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>

                {/* Delete button */}
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="mt-1 text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === comment.id ? "删除中..." : "删除"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}