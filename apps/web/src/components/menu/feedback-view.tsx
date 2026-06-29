"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMenu } from "./menu-context";

export function FeedbackView({ onSubmitted }: { onSubmitted: () => void }) {
  const { menu, tableNumber, tx, showToast } = useMenu();
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgSlug: menu.organization.slug,
          locationSlug: menu.location.slug,
          text: trimmed,
          tableNumber,
        }),
      });
      if (res.ok) {
        setText("");
        showToast(tx("feedback", "success", "Thank you for your feedback!"));
        onSubmitted();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-5">
      <h1 className="mb-1.5 text-xl font-bold tracking-tight">
        {tx("feedback", "title", "Share feedback")}
      </h1>
      <p className="mb-4 text-sm text-muted-foreground">
        {tx("feedback", "placeholder", "Tell us about your visit.")}
      </p>
      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(false);
          }}
          placeholder={tx("feedback", "placeholder", "")}
          maxLength={1000}
          disabled={loading}
          className="min-h-40 w-full resize-none rounded-2xl border border-border bg-background p-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />
        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] text-muted-foreground">{text.length}/1000</span>
          {error && (
            <span className="text-[0.75rem] font-medium text-destructive">
              {tx("feedback", "error", "Could not send. Please try again.")}
            </span>
          )}
        </div>
        <Button onClick={submit} disabled={!text.trim() || loading} size="lg" className="h-11 w-full text-sm">
          <Send className="size-4" />
          {loading ? tx("feedback", "sending", "Sending…") : tx("feedback", "submit", "Send feedback")}
        </Button>
      </div>
    </div>
  );
}
