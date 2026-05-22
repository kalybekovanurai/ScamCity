import type { ScenarioChatMessage, ScenarioMediaAttachment, Theme } from "../../../types";
import { ScenarioAttachment } from "../media/ScenarioAttachment";
import type { ChatStyle } from "./chatStyles";
import { getThemedChatClasses } from "./chatStyles";

interface ChatBubbleProps {
  message: ScenarioChatMessage;
  index: number;
  highlightIndex?: number | null;
  platform?: string;
  style: ChatStyle;
  theme: Theme;
}

const roleLabels: Record<string, { label: string; className: string; darkClassName: string }> = {
  friend: { label: "online", className: "bg-green-100 text-green-700", darkClassName: "bg-green-950 text-green-300" },
  relative: { label: "родные", className: "bg-pink-100 text-pink-700", darkClassName: "bg-pink-950 text-pink-300" },
  student: { label: "студент", className: "bg-indigo-100 text-indigo-700", darkClassName: "bg-indigo-950 text-indigo-300" },
  seller: { label: "продавец", className: "bg-orange-100 text-orange-700", darkClassName: "bg-orange-950 text-orange-300" },
  hr_manager: { label: "HR", className: "bg-blue-100 text-blue-700", darkClassName: "bg-blue-950 text-blue-300" },
};

const RoleBadge = ({ role, theme }: { role?: string; theme: Theme }) => {
  if (!role || !roleLabels[role]) return null;
  const roleLabel = roleLabels[role];

  return (
    <span className={`rounded-full px-2 py-[2px] text-[10px] font-semibold ${theme === "dark" ? roleLabel.darkClassName : roleLabel.className}`}>
      {roleLabel.label}
    </span>
  );
};

const getMessageAttachments = (message: ScenarioChatMessage): (string | ScenarioMediaAttachment)[] => {
  const attachments: (string | ScenarioMediaAttachment)[] = [];

  if (message.meta?.attachment) attachments.push(message.meta.attachment);
  if (message.attachment) attachments.push(message.attachment);
  if (message.attachments?.length) attachments.push(...message.attachments);

  return attachments;
};

export const ChatBubble = ({ message, index, highlightIndex, platform, style, theme }: ChatBubbleProps) => {
  const themed = getThemedChatClasses(style, theme);
  const isUser = message.sender === "Вы" || message.role === "user";
  const isMarketplaceSeller = platform?.toLowerCase() === "marketplace" && message.role === "seller";
  const isSecurityNotification = message.role === "security_service";
  const showDangerGlow = highlightIndex === index;
  const attachments = getMessageAttachments(message);

  return (
    <div className={`flex animate-[fadeIn_0.25s_ease-out] ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] overflow-hidden rounded-2xl px-3.5 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[82%] sm:px-4 ${
          isUser ? themed.userBubble : themed.otherBubble
        } ${showDangerGlow ? "animate-pulse ring-2 ring-red-400 ring-offset-2" : ""}`}
      >
        <div className="mb-1 flex min-w-0 flex-wrap items-center gap-2">
          <div className="truncate text-xs font-semibold opacity-80">{message.sender}</div>
          <RoleBadge role={message.role} theme={theme} />
        </div>

        {message.text ? <div className="break-words text-sm leading-relaxed">{message.text}</div> : null}

        {attachments.length > 0 ? (
          <div className="mt-3 space-y-2">
            {attachments.map((attachment, attachmentIndex) => (
              <ScenarioAttachment key={attachmentIndex} attachment={attachment} theme={theme} compact />
            ))}
          </div>
        ) : null}

        {isMarketplaceSeller && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] opacity-70">
            <span>4.9 рейтинг</span>
            <span>•</span>
            <span>24 сделки</span>
          </div>
        )}

        {isSecurityNotification && (
          <div
            className={`mt-2 inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${
              theme === "dark" ? "bg-red-950 text-red-300" : "bg-red-50 text-red-700"
            }`}
          >
            <span className="truncate">security notification</span>
          </div>
        )}

        {message.time ? <div className="mt-1 text-right text-[11px] opacity-60">{message.time}</div> : null}

        {highlightIndex === index ? (
          <div className={`mt-2 rounded-xl px-3 py-2 text-xs font-semibold ${theme === "dark" ? "bg-red-950 text-red-300" : "bg-red-50 text-red-700"}`}>
            Здесь важный сигнал риска
          </div>
        ) : null}
      </div>
    </div>
  );
};
