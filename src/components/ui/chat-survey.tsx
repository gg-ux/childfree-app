"use client";

import { useState, useEffect, useRef } from "react";
import { PaperPlaneTilt, Check, MapPin } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  content: string;
}

interface Option {
  id: string;
  label: string;
  emoji?: string;
}

const CONNECTION_OPTIONS: Option[] = [
  { id: "dating", label: "Local Dating", emoji: "💕" },
  { id: "friendships", label: "Local Friendships", emoji: "👯" },
  { id: "community", label: "Global Community", emoji: "🌎" },
];

const CONTRIBUTION_OPTIONS: Option[] = [
  { id: "beta_tester", label: "Beta tester", emoji: "🧪" },
  { id: "event_organizer", label: "Event organizer", emoji: "📅" },
  { id: "moderator", label: "Moderator", emoji: "🛡️" },
  { id: "just_member", label: "Just a member", emoji: "✌️" },
];

type QuestionType = "first_priority" | "second_priority" | "contribution" | "contribution_more" | "age" | "freeform" | "email";

export function ChatSurvey() {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>("first_priority");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "q-0",
      type: "bot",
      content: "As a childfree person, what are you most interested in? Choose an option below.",
    },
  ]);

  // Ranking state
  const [firstPriority, setFirstPriority] = useState<string | null>(null);
  const [secondPriority, setSecondPriority] = useState<string | null>(null);

  // Other answers
  const [contribution, setContribution] = useState<string[]>([]);
  const [age, setAge] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");

  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<{
    city: string | null;
    region: string | null;
    country: string | null;
  } | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch location on mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("/api/geolocation");
        const data = await res.json();
        setDetectedLocation(data);
      } catch {
        // Ignore location errors
      }
    };
    fetchLocation();
  }, []);

  // Auto-scroll to bottom when messages or currentQuestion changes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, currentQuestion]);

  const addBotMessage = (content: string) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, type: "bot", content },
      ]);
    }, 400);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", content },
    ]);
  };

  const handleFirstPriority = (option: Option) => {
    setFirstPriority(option.id);
    addUserMessage(`${option.emoji} ${option.label}`);
    addBotMessage("And your second choice?");
    setCurrentQuestion("second_priority");
  };

  const handleSecondPriority = (option: Option) => {
    setSecondPriority(option.id);
    addUserMessage(`${option.emoji} ${option.label}`);
    addBotMessage("How would you want to be involved?");
    setCurrentQuestion("contribution");
  };

  const handleContribution = (option: Option) => {
    addUserMessage(`${option.emoji} ${option.label}`);
    const newContribution = [...contribution, option.id];
    setContribution(newContribution);

    // If they chose "Just a member", skip follow-up
    if (option.id === "just_member") {
      addBotMessage("What's your age range?");
      setCurrentQuestion("age");
      return;
    }

    // Check if there are more active roles to show (exclude "just_member")
    const activeRoles = CONTRIBUTION_OPTIONS.filter(o => o.id !== "just_member");
    const remaining = activeRoles.filter(o => !newContribution.includes(o.id));
    if (remaining.length > 0) {
      addBotMessage("Any other ways?");
      setCurrentQuestion("contribution_more");
    } else {
      addBotMessage("What's your age range?");
      setCurrentQuestion("age");
    }
  };

  const handleContributionMore = (option: Option) => {
    if (option.id === "no") {
      addUserMessage("No");
      addBotMessage("What's your age range?");
      setCurrentQuestion("age");
    } else {
      addUserMessage(`${option.emoji} ${option.label}`);
      const newContribution = [...contribution, option.id];
      setContribution(newContribution);

      // Check if there are more active roles to show (exclude "just_member")
      const activeRoles = CONTRIBUTION_OPTIONS.filter(o => o.id !== "just_member");
      const remaining = activeRoles.filter(o => !newContribution.includes(o.id));
      if (remaining.length > 0) {
        addBotMessage("Any other ways?");
        // Stay on contribution_more
      } else {
        addBotMessage("What's your age range?");
        setCurrentQuestion("age");
      }
    }
  };

  const handleAge = (option: Option) => {
    setAge(option.id);
    addUserMessage(option.label);
    addBotMessage("Is there anything you wish a childfree platform had?");
    setCurrentQuestion("freeform");
  };

  const [freeformInput, setFreeformInput] = useState("");

  const getEmailPrompt = () => {
    if (contribution.includes("moderator")) {
      return "Since you're interested in moderating, drop your email so we can reach out!";
    }
    return "Last one! Drop your email if you want early access.";
  };

  const handleFreeformSubmit = () => {
    const text = freeformInput.trim();
    addUserMessage(text || "Skipped");
    addBotMessage(getEmailPrompt());
    setCurrentQuestion("email");
  };

  const skipFreeform = () => {
    addUserMessage("Skipped");
    addBotMessage(getEmailPrompt());
    setCurrentQuestion("email");
  };

  const handleEmailSubmit = () => {
    const email = emailInput.trim();
    addUserMessage(email || "Skipped");
    completeSurvey(email);
  };

  const skipEmail = () => {
    addUserMessage("Skipped");
    completeSurvey("");
  };

  const completeSurvey = async (email: string) => {
    // Build ranking - first, second, then the remaining one
    const allIds = CONNECTION_OPTIONS.map((o) => o.id);
    const thirdPriority = allIds.find((id) => id !== firstPriority && id !== secondPriority);
    const connectionRanking = [firstPriority, secondPriority, thirdPriority].filter(Boolean) as string[];

    const payload = {
      connectionRanking,
      contributionTypes: contribution,
      moderatorInterest: contribution.includes("moderator"),
      ageRange: age,
      freeformResponse: freeformInput.trim() || null,
      country: detectedLocation?.country || null,
      region: detectedLocation?.city || detectedLocation?.region || null,
      email: email || null,
    };

    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Ignore errors
    }

    setIsComplete(true);
    addBotMessage("Thanks! You're helping shape something special. 💚");
  };

  // Get remaining options for second priority question
  const remainingConnectionOptions = CONNECTION_OPTIONS.filter((o) => o.id !== firstPriority);

  // Get remaining active contribution options (exclude "just_member" from follow-up)
  const remainingContributionOptions = CONTRIBUTION_OPTIONS.filter(
    (o) => o.id !== "just_member" && !contribution.includes(o.id)
  );

  // Current options based on question
  const getCurrentOptions = (): Option[] => {
    switch (currentQuestion) {
      case "first_priority":
        return CONNECTION_OPTIONS;
      case "second_priority":
        return remainingConnectionOptions;
      case "contribution":
        return CONTRIBUTION_OPTIONS;
      case "contribution_more":
        return [
          ...remainingContributionOptions,
          { id: "no", label: "That's it", emoji: "✅" },
        ];
      case "age":
        return [
          { id: "18-24", label: "18-24" },
          { id: "25-34", label: "25-34" },
          { id: "35-44", label: "35-44" },
          { id: "45-54", label: "45-54" },
          { id: "55+", label: "55+" },
        ];
      default:
        return [];
    }
  };

  const handleOptionClick = (option: Option) => {
    if (!hasStarted) setHasStarted(true);
    switch (currentQuestion) {
      case "first_priority":
        handleFirstPriority(option);
        break;
      case "second_priority":
        handleSecondPriority(option);
        break;
      case "contribution":
        handleContribution(option);
        break;
      case "contribution_more":
        handleContributionMore(option);
        break;
      case "age":
        handleAge(option);
        break;
    }
  };

  const options = getCurrentOptions();
  const isEmailQuestion = currentQuestion === "email";

  return (
    <div>
    <div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden max-w-md mx-auto shadow-sm flex flex-col h-[420px]">
      {/* Header - Fixed */}
      <div className="bg-forest/10 px-4 py-3 border-b border-border flex items-center gap-3 flex-shrink-0">
        <Logo variant="icon" size="sm" />
        <div>
          <p className="theme-heading text-base text-foreground">Chosn Chat</p>
          <p className="theme-caption text-muted">Anonymous</p>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.type === "user"
                  ? "bg-forest text-white rounded-br-md"
                  : "bg-gray-100 text-foreground rounded-bl-md"
              }`}
            >
              <p className="theme-body-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Options - Fixed at bottom */}
      {!isComplete && !isEmailQuestion && currentQuestion !== "freeform" && options.length > 0 && (
        <div className="px-4 pb-4 pt-2 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-white border border-border text-foreground hover:border-forest/50 hover:bg-forest/5"
              >
                {option.emoji && <span className="mr-1.5">{option.emoji}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completion indicator */}
      {isComplete && (
        <div className="px-4 py-3 border-t border-border bg-forest/5 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-forest">
            <Check size={16} weight="bold" />
            <span className="font-medium">Survey complete</span>
          </div>
        </div>
      )}

      {/* Input Area - Freeform */}
      {!isComplete && currentQuestion === "freeform" && (
        <div className="p-4 border-t border-border bg-gray-50/50 flex-shrink-0">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={freeformInput}
                onChange={(e) => setFreeformInput(e.target.value)}
                placeholder="Type your thoughts..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border theme-body-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                onKeyDown={(e) => e.key === "Enter" && handleFreeformSubmit()}
              />
              <button
                onClick={handleFreeformSubmit}
                className="w-10 h-10 flex items-center justify-center bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors flex-shrink-0"
              >
                <PaperPlaneTilt size={20} weight="fill" />
              </button>
            </div>
            <button
              onClick={skipFreeform}
              className="w-full theme-caption text-muted hover:text-foreground transition-colors font-medium"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Input Area - Only for email */}
      {!isComplete && isEmailQuestion && (
        <div className="p-4 border-t border-border bg-gray-50/50 flex-shrink-0">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-border theme-body-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              />
              <button
                onClick={handleEmailSubmit}
                className="w-10 h-10 flex items-center justify-center bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors flex-shrink-0"
              >
                <PaperPlaneTilt size={20} weight="fill" />
              </button>
            </div>
            <button
              onClick={skipEmail}
              className="w-full theme-caption text-muted hover:text-foreground transition-colors font-medium"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Location indicator - show at bottom when not email and not complete */}
      {!isComplete && !isEmailQuestion && currentQuestion !== "freeform" && detectedLocation?.city && (
        <div className="px-4 py-2 border-t border-border bg-gray-50/30 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <MapPin size={12} />
            <span>
              {detectedLocation.city}
              {detectedLocation.country && `, ${detectedLocation.country}`}
            </span>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
