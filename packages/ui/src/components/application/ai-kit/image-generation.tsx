"use client";

import { useState } from "react";
import {
  MediaStudio,
  parseAspectRatioLabel,
  type MediaStudioAsset,
  type MediaStudioMessage,
  type MediaStudioProps,
  type MediaStudioSubmitMeta,
} from "./media-studio";

const DEMO_GALLERY: MediaStudioAsset[] = [
  { id: "g1", src: "placeholder:messi", alt: "球星插画", ratio: 1 },
  { id: "g2", src: "placeholder:birds", alt: "飞鸟", ratio: 3 / 4 },
  { id: "g3", src: "placeholder:city", alt: "街景", ratio: 4 / 5 },
  { id: "g4", src: "placeholder:monster", alt: "角色", ratio: 1 },
  { id: "g5", src: "placeholder:floral", alt: "花艺", ratio: 3 / 4 },
  { id: "g6", src: "placeholder:surreal", alt: "超现实", ratio: 4 / 5 },
  { id: "g7", src: "placeholder:anime", alt: "动漫", ratio: 3 / 4 },
  { id: "g8", src: "placeholder:ads", alt: "广告", ratio: 16 / 9 },
];

const DEMO_MESSAGES: MediaStudioMessage[] = [
  {
    id: "u1",
    role: "user",
    text: "创建莱昂内尔·梅西在蓝色背景下穿着阿根廷主场球衣运球的复古社论插图。",
  },
  {
    id: "a1",
    role: "assistant",
    resultLabel: "生成图像",
    asset: { id: "r1", src: "placeholder:messi", alt: "梅西插画", ratio: 1 },
  },
];

export type ImageGenerationProps = Omit<MediaStudioProps, "kind">;

/**
 * AI image studio: prompt thread + gallery / styles rail.
 *
 *   <ImageGeneration onSubmit={(prompt, meta) => generate(prompt, meta)} />
 */
export function ImageGeneration({
  messages: messagesProp,
  gallery: galleryProp,
  modelLabel = "Fable 5",
  onSubmit,
  aspect = "1:1",
  onAspectChange,
  title = "图像生成",
  ...props
}: ImageGenerationProps) {
  const [messages, setMessages] = useState<MediaStudioMessage[]>(
    messagesProp ?? DEMO_MESSAGES,
  );
  const [gallery, setGallery] = useState<MediaStudioAsset[]>(
    galleryProp ?? DEMO_GALLERY,
  );
  const [aspectLocal, setAspectLocal] = useState(aspect);

  const controlledMessages = messagesProp !== undefined;
  const controlledGallery = galleryProp !== undefined;
  const resolvedMessages = controlledMessages ? messagesProp : messages;
  const resolvedGallery = controlledGallery ? galleryProp : gallery;

  return (
    <MediaStudio
      kind="image"
      {...props}
      title={title}
      messages={resolvedMessages}
      gallery={resolvedGallery}
      modelLabel={modelLabel}
      aspect={aspectLocal}
      onAspectChange={(next) => {
        setAspectLocal(next);
        onAspectChange?.(next);
      }}
      onSubmit={(prompt, meta) => {
        onSubmit?.(prompt, meta);
        if (controlledMessages) return;
        const resolved: MediaStudioSubmitMeta = meta;
        const id = `local-${Date.now()}`;
        const asset: MediaStudioAsset = {
          id: `${id}-img`,
          src: `placeholder:${id}`,
          alt: prompt.slice(0, 24),
          ratio: parseAspectRatioLabel(resolved.aspect, 1),
        };
        setMessages((prev) => [
          ...prev,
          { id: `${id}-u`, role: "user", text: prompt },
          {
            id: `${id}-a`,
            role: "assistant",
            resultLabel: "生成图像",
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
