"use client";

import { useState, useEffect } from "react";
import { BookmarkSimple } from "@phosphor-icons/react";

export function BlogFavoriteButton({ slug }: { slug: string }) {
  const [favorited, setFavorited] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const authRes = await fetch("/api/auth/check");
        const authData = await authRes.json();
        if (!authData.authenticated) { setLoading(false); return; }
        setIsAuth(true);

        const favRes = await fetch("/api/blog/favorites");
        const favData = await favRes.json();
        if (favData.slugs?.includes(slug)) setFavorited(true);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [slug]);

  if (loading || !isAuth) return null;

  const toggle = async () => {
    setFavorited(!favorited);
    try {
      const res = await fetch("/api/blog/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      setFavorited(data.favorited);
    } catch {
      setFavorited(favorited); // revert
    }
  };

  return (
    <button
      onClick={toggle}
      className="group flex items-center text-muted hover:text-foreground transition-colors"
      title={favorited ? "Remove from saved" : "Save"}
    >
      <BookmarkSimple
        size={20}
        weight={favorited ? "fill" : "regular"}
        className={favorited ? "text-foreground" : "group-hover:text-foreground"}
      />
    </button>
  );
}
