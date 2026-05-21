import { FileText } from "lucide-react";
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

const inferMediaKind = (attachment: ScenarioMediaAttachment | string): MediaKind => {
  const type = typeof attachment === "string" ? "" : `${attachment.type ?? ""} ${attachment.mimeType ?? ""}`.toLowerCase();
  const url = getAttachmentUrl(attachment).toLowerCase();

  if (type.includes("video") || /\.(mp4|webm|ogg|mov)(\?|#|$)/.test(url)) return "video";
  if (type.includes("audio") || type.includes("voice") || /\.(mp3|wav|m4a|aac|ogg|webm)(\?|#|$)/.test(url)) return "audio";
  if (type.includes("image") || /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/.test(url)) return "image";

  return "file";
};

export const ScenarioAttachment = ({ attachment, theme, compact = false }: ScenarioAttachmentProps) => {
  const url = getAttachmentUrl(attachment);
  const label = getAttachmentLabel(attachment);
  const kind = inferMediaKind(attachment);
  const frameClass = theme === "dark" ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white";

  if (kind === "video" && url) {
    return (
      <div className={`overflow-hidden rounded-2xl border ${frameClass}`}>
        <video controls playsInline preload="metadata" className={compact ? "max-h-56 w-full bg-black" : "max-h-80 w-full bg-black"}>
          <source src={url} />
        </video>
      </div>
    );
  }

  if (kind === "audio" && url) {
    return (
      <div className={`rounded-2xl border p-3 ${frameClass}`}>
        <p className="mb-2 text-xs font-bold opacity-70">{label}</p>
        <audio controls preload="metadata" className="w-full">
          <source src={url} />
        </audio>
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
