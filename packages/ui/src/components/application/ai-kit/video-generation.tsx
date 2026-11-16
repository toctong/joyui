"use client";

import { useState } from "react";
import {
  MediaStudio,
  parseAspectRatioLabel,
  type MediaStudioAsset,
  type MediaStudioMessage,
  type MediaStudioProps,
} from "./media-studio";

const DEMO_GALLERY: MediaStudioAsset[] = [
  { id: "v1", src: "placeholder:reel1", alt: "产品开场", kind: "video", durationLabel: "0:08", ratio: 16 / 9 },
  { id: "v2", src: "placeholder:reel2", alt: "城市延时", kind: "video", durationLabel: "0:12", ratio: 16 / 9 },
  { id: "v3", src: "placeholder:reel3", alt: "竖屏短片", kind: "video", durationLabel: "0:06", ratio: 9 / 16 },
  { id: "v4", src: "placeholder:reel4", alt: "品牌片花", kind: "video", durationLabel: "0:15", ratio: 16 / 9 },
  { id: "v5", src: "placeholder:reel5", alt: "教学片段", kind: "video", durationLabel: "0:10", ratio: 1 },
  { id: "v6", src: "placeholder:reel6", alt: "抽象动效", kind: "video", durationLabel: "0:05", ratio: 1 },
];

const DEMO_MESSAGES: MediaStudioMessage[] = [
  {
    id: "u1",
    role: "user",
    text: "生成一段 16:9、约 8 秒的产品开场：金属质感手机在柔光下缓缓旋转，字幕写「JoyUI Motion」。",
  },
  {
    id: "a1",
    role: "assistant",
    resultLabel: "生成视频",
    asset: {
      id: "r1",
      src: "placeholder:product",
      alt: "产品开场",
      kind: "video",
      durationLabel: "0:08",
      ratio: 16 / 9,
    },
  },
];

export type VideoGenerationProps = Omit<MediaStudioProps, "kind">;

/** @deprecated Use `VideoGeneration`. */
export type VideoProductionProps = VideoGenerationProps;

/**
 * AI video studio: prompt thread + gallery, with aspect / duration chips.
 *
 *   <VideoGeneration onSubmit={(prompt, meta) => render(prompt, meta)} />
 */
export function VideoGeneration({
  messages: messagesProp,
  gallery: galleryProp,
  modelLabel = "Motion 2",
  onSubmit,
  aspect = "16:9",
  duration = "8s",
  onAspectChange,
  onDurationChange,
  title = "视频生成",
  ...props
}: VideoGenerationProps) {
  const [messages, setMessages] = useState<MediaStudioMessage[]>(
    messagesProp ?? DEMO_MESSAGES,
  );
  const [gallery, setGallery] = useState<MediaStudioAsset[]>(
    galleryProp ?? DEMO_GALLERY,
  );
  const [aspectLocal, setAspectLocal] = useState(aspect);
  const [durationLocal, setDurationLocal] = useState(duration);

  const controlledMessages = messagesProp !== undefined;
  const controlledGallery = galleryProp !== undefined;
  const resolvedMessages = controlledMessages ? messagesProp : messages;
  const resolvedGallery = controlledGallery ? galleryProp : gallery;

  return (
    <MediaStudio
      kind="video"
      {...props}
      title={title}
      messages={resolvedMessages}
      gallery={resolvedGallery}
      modelLabel={modelLabel}
      aspect={aspectLocal}
      duration={durationLocal}
      onAspectChange={(next) => {
        setAspectLocal(next);
        onAspectChange?.(next);
      }}
      onDurationChange={(next) => {
        setDurationLocal(next);
        onDurationChange?.(next);
      }}
      onSubmit={(prompt, meta) => {
        onSubmit?.(prompt, meta);
        if (controlledMessages) return;
        const id = `local-${Date.now()}`;
        const secs = Number.parseInt(meta.duration ?? durationLocal, 10);
        const durationLabel = Number.isFinite(secs)
          ? `0:${String(secs).padStart(2, "0")}`
          : "0:08";
        const asset: MediaStudioAsset = {
          id: `${id}-vid`,
          src: `placeholder:${id}`,
          alt: prompt.slice(0, 24),
          kind: "video",
          durationLabel,
          ratio: parseAspectRatioLabel(meta.aspect, 16 / 9),
        };
        setMessages((prev) => [
          ...prev,
          { id: `${id}-u`, role: "user", text: prompt },
          {
            id: `${id}-a`,
            role: "assistant",
            resultLabel: "生成视频",
            asset,
          },
        ]);
        if (!controlledGallery) {
          setGallery((prev) => [asset, ...prev]);
        }
      }}
    />
  );
}

/** @deprecated Use `VideoGeneration`. */
export const VideoProduction = VideoGeneration;
