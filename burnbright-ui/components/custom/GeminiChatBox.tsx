"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function GeminiChatBox() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong 😞");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6">
      <h2 className="text-lg font-medium mb-2">💬 Ask Gemini anything</h2>
      <Textarea
        placeholder="e.g., Will I burn out next week?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-2"
      />
      <Button onClick={handleSend} disabled={loading}>
        {loading ? "Thinking..." : "Send to Gemini"}
      </Button>
      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded-md dark:bg-gray-800">
          <strong>Gemini says:</strong>
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
            {response}
          </p>
        </div>
      )}
    </div>
  );
}
