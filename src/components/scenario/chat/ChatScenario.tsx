import { useEffect, useMemo, useState } from "react";
import type { Scenario, ScenarioChatMessage, Theme } from "../../../types";
import { ChatBubble } from "./ChatBubble";
import { getChatStyle, getThemedChatClasses } from "./chatStyles";
import { TypingIndicator } from "./TypingIndicator";

interface ChatScenarioProps {
  scenario: Scenario;
  theme: Theme;
}

export const ChatScenario = ({ scenario, theme }: ChatScenarioProps) => {
  const [visibleMessages, setVisibleMessages] = useState<ScenarioChatMessage[]>([]);
  const [typingSender, setTypingSender] = useState<string | null>(null);
  const messages = scenario.content.messages ?? [];
  const style = useMemo(
    () => getChatStyle(scenario.content.uiHints?.chatStyle, scenario.content.platform),
    [scenario.content.platform, scenario.content.uiHints?.chatStyle],
  );
  const themed = getThemedChatClasses(style, theme);

  useEffect(() => {
    setVisibleMessages([]);
    setTypingSender(null);

    let index = 0;
    let typingTimer: number | undefined;
    let messageTimer: number | undefined;

    const showNextMessage = () => {
      const nextMessage = messages[index];
      if (!nextMessage) {
        setTypingSender(null);
        return;
      }

      setTypingSender(nextMessage.sender);
      typingTimer = window.setTimeout(() => {
        setVisibleMessages((prev) => [...prev, nextMessage]);
        setTypingSender(null);
        index += 1;
        messageTimer = window.setTimeout(showNextMessage, 450);
      }, 650);
    };

    showNextMessage();

    return () => {
      if (typingTimer) window.clearTimeout(typingTimer);
      if (messageTimer) window.clearTimeout(messageTimer);
    };
  }, [messages]);

  return (
    <div
      className={`overflow-hidden rounded-3xl border shadow-sm ${
        theme === "dark" ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"
      }`}
    >
      <div className={`${themed.header} p-4 text-white sm:p-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold opacity-85">
              <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-black">{style.icon}</span>
              {scenario.content.platform || style.name}
            </p>
            <h5 className="mt-2 text-lg font-black leading-tight sm:text-xl">{scenario.title}</h5>
            <p className="mt-2 text-sm leading-relaxed opacity-90">{scenario.description}</p>
          </div>
          {scenario.difficulty && (
            <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase">
              {scenario.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className={`min-h-[20rem] space-y-4 p-3.5 sm:min-h-[24rem] sm:p-5 ${themed.page}`}>
        {visibleMessages.map((message, index) => (
          <ChatBubble
            key={`${message.sender}-${message.time ?? "time"}-${index}`}
            message={message}
            index={index}
            highlightIndex={scenario.content.uiHints?.highlightMessageIndex}
            platform={scenario.content.platform}
            style={style}
            theme={theme}
          />
        ))}

        {typingSender && <TypingIndicator sender={typingSender} theme={theme} />}
      </div>
    </div>
  );
};
