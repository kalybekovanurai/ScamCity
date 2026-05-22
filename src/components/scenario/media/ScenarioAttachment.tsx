import { FileText } from "lucide-react";
import { API_MEDIA_BASE_URL } from "../../../api/client";
import type { MediaKind, ScenarioMediaAttachment, Theme } from "../../../types";

interface ScenarioAttachmentProps {
  attachment: ScenarioMediaAttachment | string;
  theme: Theme;
  compact?: boolean;
}

const getAttachmentUrl = (attachment: ScenarioMediaAttachment | string) =>
  typeof attachment === "string" ? attachment : attachment.url || attachment.src || "";

const getAttachmentLabel = (attachment: ScenarioMediaAttachment | string) =>
  typeof attachment === "string" ? attachment : attachment.title || attachment.name || attachment.url || attachment.src || "Вложение";

const getAbsoluteMediaUrl = (url: string) => {
  if (!url) return "";
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  if (url.startsWith("/")) return `${API_MEDIA_BASE_URL}${url}`;

  return `${API_MEDIA_BASE_URL}/${url}`;
};

const inferMediaKind = (attachment: ScenarioMediaAttachment | string): MediaKind => {
  const type = typeof attachment === "string" ? "" : `${attachment.type ?? ""} ${attachment.mimeType ?? ""}`.toLowerCase();
  const url = getAttachmentUrl(attachment).toLowerCase();

  if (type.includes("voice")) return "voice";
  if (type.includes("video") || /\.(mp4|webm|ogg|mov)(\?|#|$)/.test(url)) return "video";
  if (type.includes("audio") || /\.(mp3|mpeg|wav|m4a|aac|ogg|webm)(\?|#|$)/.test(url)) return "audio";
  if (type.includes("image") || /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/.test(url)) return "image";

  return "file";
};

export const ScenarioAttachment = ({ attachment, theme, compact = false }: ScenarioAttachmentProps) => {
  const rawUrl = getAttachmentUrl(attachment);
  const url = getAbsoluteMediaUrl(rawUrl);
  const label = getAttachmentLabel(attachment);
  const kind = inferMediaKind(attachment);
  const duration = typeof attachment === "string" ? undefined : attachment.duration;
  const frameClass = theme === "dark" ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white";

  if ((kind === "voice" || kind === "audio") && url) {
    return (
      <div className={`rounded-2xl border p-3 ${frameClass}`}>
        <div className="flex items-center gap-3">
          <audio controls preload="metadata" className="min-w-0 flex-1">
            <source src={url} type={kind === "voice" ? "audio/mpeg" : undefined} />
          </audio>
          {duration ? <span className="shrink-0 text-xs opacity-60">{duration}</span> : null}
        </div>
      </div>
    );
  }

  if (kind === "video" && url) {
    return (
      <div className={`overflow-hidden rounded-2xl border ${frameClass}`}>
        <video controls playsInline preload="metadata" src={url} className={compact ? "max-h-56 w-full bg-black" : "max-h-80 w-full bg-black"} />
      </div>
    );
  }

  if (kind === "image" && url) {
    return <img src={url} className={compact ? "max-h-56 w-full rounded-2xl object-cover" : "max-h-80 w-full rounded-2xl object-cover"} alt="" />;
  }

  return (
    <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs ${frameClass}`}>
      <FileText className="h-4 w-4 shrink-0" />
      <span className="break-all">{label}</span>
    </div>
  );
};
