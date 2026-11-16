"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  RiCloseLine,
  RiDownload2Line,
  RiFileCopyLine,
  RiFolderLine,
  RiFullscreenLine,
  RiImageLine,
  RiLayoutGridLine,
  RiMore2Fill,
  RiPlayFill,
  RiRefreshLine,
  RiShareForwardLine,
  RiSparklingLine,
  RiThumbDownLine,
  RiThumbUpLine,
  RiVideoLine,
} from "@remixicon/react";
import { cx } from "../../../utils/cx";
import { AspectRatio } from "../../base/aspect-ratio/aspect-ratio";
import { IconButton } from "../../base/buttons/icon-button";
import { PromptSuggestions } from "../../base/prompt-suggestions/prompt-suggestions";
import { AgentThinking } from "../agent-thinking/agent-thinking";
import {
  MediaComposer,
  type MediaComposerProps,
} from "./media-composer";

export type MediaStudioKind = "image" | "video";

export type MediaStudioAsset = {
  id: string;
  src: string;
  alt?: string;
  kind?: MediaStudioKind;
  /** Width / height; falls back to studio aspect or 1. */
  ratio?: number;
  /** e.g. `0:08` for video thumbnails. */
  durationLabel?: string;
};

/** Parse `"16:9"` / `"1:1"` chips into a numeric ratio. */
export function parseAspectRatioLabel(label: string, fallback = 16 / 9): number {
  const match = /^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/.exec(label.trim());
  if (!match) return fallback;
  const w = Number(match[1]);
  const h = Number(match[2]);
  if (!w || !h) return fallback;
  return w / h;
}

export type MediaStudioMessage = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  /** Assistant media result. */
  asset?: MediaStudioAsset;
  /** Caption above the asset, e.g. 生成图像. */
  resultLabel?: string;
  /** Show a generating placeholder for this turn. */
  pending?: boolean;
};

export type MediaStudioStyle = {
  id: string;
  label: string;
  preview?: string;
  description?: string;
};

export type MediaStudioSubmitMeta = {
  aspect: string;
  duration?: string;
  styleId?: string;
  modelId?: string;
};

export type MediaStudioSideTab = "gallery" | "styles";

export type MediaStudioComposerContext = {
  value: string;
  setValue: (value: string) => void;
  busy: boolean;
  submit: (text?: string) => void;
  stop?: () => void;
  aspect: string;
  duration: string;
  styleId?: string;
  modelId?: string;
  defaultToolbar: ReactNode;
};

export type MediaStudioProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "onSubmit"
> & {
  kind: MediaStudioKind;
  title?: ReactNode;
  projectLabel?: ReactNode;
  messages?: MediaStudioMessage[];
  /** When omitted, gallery is derived from message assets. Pass `[]` to force empty. */
  gallery?: MediaStudioAsset[];
  styles?: MediaStudioStyle[];
  suggestions?: string[];
  modelLabel?: string;
  models?: { id: string; name: string }[];
  modelId?: string;
  defaultModelId?: string;
  placeholder?: string;
  busy?: boolean;
  agentLabel?: string;
  contextPercent?: number;
  branchLabel?: string;
  /** Initial side panel open state (uncontrolled). */
  showSidePanel?: boolean;
  sidePanelOpen?: boolean;
  onSidePanelOpenChange?: (open: boolean) => void;
  sideTab?: MediaStudioSideTab;
  defaultSideTab?: MediaStudioSideTab;
  onSideTabChange?: (tab: MediaStudioSideTab) => void;
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (value: string) => void;
  /**
   * Submit handler. Second argument carries aspect / duration / style / model
   * so hosts do not need to mirror chip state.
   */
  onSubmit?: (prompt: string, meta: MediaStudioSubmitMeta) => void;
  onStop?: () => void;
  onAttachPress?: () => void;
  onMicPress?: () => void;
  onModelChange?: (modelId: string) => void;
  onSelectAsset?: (asset: MediaStudioAsset) => void;
  onSelectStyle?: (style: MediaStudioStyle) => void;
  onRegenerate?: (message: MediaStudioMessage) => void;
  onDownload?: (asset: MediaStudioAsset) => void;
  onShare?: () => void;
  onMore?: () => void;
  onFullscreen?: () => void;
  onFeedback?: (message: MediaStudioMessage, value: "up" | "down") => void;
  onCopyPrompt?: (text: string, message: MediaStudioMessage) => void;
  onSelectSuggestion?: (text: string) => void;
  aspectOptions?: string[];
  durationOptions?: string[];
  aspect?: string;
  duration?: string;
  styleId?: string;
  onAspectChange?: (value: string) => void;
  onDurationChange?: (value: string) => void;
  onStyleChange?: (styleId: string) => void;
  /** Copy / empty-state labels (override defaults for i18n). */
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  suggestionsLabel?: string;
  thinkingLabel?: string;
  aspectLabel?: string;
  durationLabel?: string;
  galleryTabLabel?: string;
  stylesTabLabel?: string;
  showAspectChips?: boolean;
  showDurationChips?: boolean;
  showComposerFooter?: boolean;
  showMessageActions?: boolean;
  showHeaderActions?: boolean;
  showStylesTab?: boolean;
  showGalleryTab?: boolean;
  /** Replace header action cluster. */
  headerActions?: ReactNode;
  headerLeading?: ReactNode;
  /** Replace empty thread state. */
  emptyState?: ReactNode;
  /** Extra content under the side panel body. */
  sidePanelExtra?: ReactNode;
  /** Replace the whole side panel; `false` hides it. */
  sidePanel?: ReactNode | false;
  /** Merge into the built-in MediaComposer. */
  composerProps?: Omit<
    MediaComposerProps,
    "value" | "onChange" | "onSubmit" | "busy" | "toolbar"
  >;
  /** Full composer replacement (TipTap, custom bar, …). */
  renderComposer?: (ctx: MediaStudioComposerContext) => ReactNode;
  /** Replace chip toolbar; receive prebuilt chip nodes. */
  renderToolbar?: (ctx: {
    aspect: string;
    duration: string;
    aspectChips: ReactNode;
    durationChips: ReactNode | null;
  }) => ReactNode;
  renderAsset?: (
    asset: MediaStudioAsset,
    ctx: { ratio: number; location: "thread" | "gallery" },
  ) => ReactNode;
  renderMessage?: (message: MediaStudioMessage, index: number) => ReactNode;
  renderMessageActions?: (message: MediaStudioMessage) => ReactNode;
};

function PlaceholderThumb({
  label,
  className,
  tone = 0,
}: {
  label: string;
  className?: string;
  tone?: number;
}) {
  const hues = [210, 265, 165, 28, 340, 220, 190, 310];
  const h = hues[tone % hues.length];
  return (
    <div
      className={cx("flex size-full items-center justify-center text-white/90", className)}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${h} 72% 56%), hsl(${(h + 42) % 360} 64% 38%))`,
      }}
    >
      <span className="px-2 text-center text-caption-1-medium">{label}</span>
    </div>
  );
}

const GALLERY_RATIOS = [3 / 4, 1, 4 / 5, 16 / 9] as const;

function AssetVisual({
  asset,
  className,
  showPlay,
  ratio = 1,
}: {
  asset: MediaStudioAsset;
  className?: string;
  showPlay?: boolean;
  ratio?: number;
}) {
  const isVideo = (asset.kind ?? "image") === "video" || showPlay;
  const resolvedRatio = asset.ratio ?? ratio;
  return (
    <AspectRatio
      ratio={resolvedRatio}
      className={cx("bg-background-secondary-default", className)}
    >
      {asset.src.startsWith("placeholder:") ? (
        <PlaceholderThumb
          label={asset.alt ?? asset.id}
          tone={Number(asset.id.replace(/\D/g, "") || 0)}
        />
      ) : (
        <img src={asset.src} alt={asset.alt ?? ""} />
      )}
      {isVideo ? (
        <span className="absolute inset-0 grid place-items-center bg-black/25">
          <span className="grid size-10 place-items-center rounded-full bg-white/92 text-text-primary shadow-xs">
            <RiPlayFill className="size-4" aria-hidden />
          </span>
        </span>
      ) : null}
      {asset.durationLabel ? (
        <span className="absolute end-2 bottom-2 rounded-md bg-black/65 px-1.5 py-0.5 text-caption-2-medium text-white">
          {asset.durationLabel}
        </span>
      ) : null}
    </AspectRatio>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      <span className="me-0.5 text-caption-1-medium text-text-tertiary">{label}</span>
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cx(
              "rounded-full px-2.5 py-1 text-caption-1-medium outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              selected
                ? "bg-accent-500/12 text-accent-700 ring-1 ring-inset ring-accent-500/35 dark:text-accent-300"
                : "bg-background-secondary-default/80 text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

const DEFAULT_IMAGE_STYLES: MediaStudioStyle[] = [
  { id: "editorial", label: "社论插画", description: "扁平 · 杂志感" },
  { id: "anime", label: "动漫", description: "线稿 · 高饱和" },
  { id: "photo", label: "写实摄影", description: "自然光 · 细节" },
  { id: "3d", label: "三维渲染", description: "材质 · 体积光" },
  { id: "watercolor", label: "水彩", description: "纸感 · 晕染" },
  { id: "poster", label: "海报", description: "排版 · 强对比" },
];

const DEFAULT_VIDEO_STYLES: MediaStudioStyle[] = [
  { id: "cinematic", label: "电影感", description: "浅景深 · 胶片颗粒" },
  { id: "product", label: "产品展示", description: "柔光 · 缓推" },
  { id: "anime", label: "动漫运镜", description: "鲜明色 · 动态线" },
  { id: "timelapse", label: "延时", description: "城市 / 自然" },
  { id: "handheld", label: "手持", description: "纪实晃动" },
  { id: "abstract", label: "抽象动效", description: "粒子 · 流体" },
];

/**
 * Shared creative studio chrome: prompt thread + gallery / styles rail.
 * Used by `ImageGeneration` and `VideoGeneration`.
 */
export function MediaStudio({
  kind,
  title,
  projectLabel = "JoyUI 项目",
  messages = [],
  gallery: galleryProp,
  styles,
  suggestions,
  modelLabel = kind === "video" ? "Motion 2" : "Fable 5",
  models,
  modelId: modelIdProp,
  defaultModelId,
  placeholder = kind === "video" ? "描述镜头、主体与氛围…" : "描述画面、风格与构图…",
  busy = false,
  agentLabel = "智能体",
  contextPercent = 57,
  branchLabel = "主要",
  showSidePanel = true,
  sidePanelOpen: sidePanelOpenProp,
  onSidePanelOpenChange,
  sideTab: sideTabProp,
  defaultSideTab = "gallery",
  onSideTabChange,
  draft: draftProp,
  defaultDraft = "",
  onDraftChange,
  onSubmit,
  onStop,
  onAttachPress,
  onMicPress,
  onModelChange,
  onSelectAsset,
  onSelectStyle,
  onRegenerate,
  onDownload,
  onShare,
  onMore,
  onFullscreen,
  onFeedback,
  onCopyPrompt,
  onSelectSuggestion,
  aspectOptions = kind === "video"
    ? ["16:9", "9:16", "1:1"]
    : ["1:1", "16:9", "9:16", "4:3"],
  durationOptions = ["5s", "8s", "10s", "15s"],
  aspect: aspectProp,
  duration: durationProp,
  styleId: styleIdProp,
  onAspectChange,
  onDurationChange,
  onStyleChange,
  emptyTitle,
  emptyDescription,
  suggestionsLabel = "试试这些",
  thinkingLabel,
  aspectLabel = "画幅",
  durationLabel = "时长",
  galleryTabLabel = "画廊",
  stylesTabLabel = "风格",
  showAspectChips = true,
  showDurationChips = kind === "video",
  showComposerFooter = true,
  showMessageActions = true,
  showHeaderActions = true,
  showStylesTab = true,
  showGalleryTab = true,
  headerActions,
  headerLeading,
  emptyState,
  sidePanelExtra,
  sidePanel: sidePanelSlot,
  composerProps,
  renderComposer,
  renderToolbar,
  renderAsset,
  renderMessage,
  renderMessageActions,
  className,
  ...props
}: MediaStudioProps) {
  const [draftLocal, setDraftLocal] = useState(defaultDraft);
  const [sideOpenLocal, setSideOpenLocal] = useState(showSidePanel);
  const [sideTabLocal, setSideTabLocal] =
    useState<MediaStudioSideTab>(defaultSideTab);
  const [aspectLocal, setAspectLocal] = useState(
    aspectOptions[0] ?? (kind === "video" ? "16:9" : "1:1"),
  );
  const [durationLocal, setDurationLocal] = useState(durationOptions[1] ?? "8s");
  const [styleLocal, setStyleLocal] = useState<string | undefined>(styleIdProp);
  const [modelLocal, setModelLocal] = useState(
    defaultModelId ?? models?.[0]?.id ?? "default",
  );
  const scrollerRef = useRef<HTMLDivElement>(null);

  const draft = draftProp ?? draftLocal;
  const setDraft = (next: string) => {
    if (draftProp === undefined) setDraftLocal(next);
    onDraftChange?.(next);
  };

  const sideOpen = sidePanelOpenProp ?? sideOpenLocal;
  const setSideOpen = (next: boolean) => {
    if (sidePanelOpenProp === undefined) setSideOpenLocal(next);
    onSidePanelOpenChange?.(next);
  };

  const sideTab = sideTabProp ?? sideTabLocal;
  const setSideTab = (next: MediaStudioSideTab) => {
    if (sideTabProp === undefined) setSideTabLocal(next);
    onSideTabChange?.(next);
  };

  const aspect = aspectProp ?? aspectLocal;
  const duration = durationProp ?? durationLocal;
  const styleId = styleIdProp ?? styleLocal;
  const modelId = modelIdProp ?? modelLocal;
  const previewRatio = parseAspectRatioLabel(
    aspect,
    kind === "video" ? 16 / 9 : 1,
  );

  const modeTitle =
    title ?? (kind === "video" ? "视频生成" : "图像生成");

  const resolvedStyles =
    styles ?? (kind === "video" ? DEFAULT_VIDEO_STYLES : DEFAULT_IMAGE_STYLES);

  const resolvedSuggestions =
    suggestions ??
    (kind === "video"
      ? [
          "产品旋转开场，柔光金属质感，8 秒",
          "雨夜霓虹街巷跟拍，手持电影感",
          "角色从剪影走进阳光，慢推镜头",
        ]
      : [
          "蓝色背景下的复古社论插画角色",
          "极简产品静物，柔和侧光",
          "赛博朋克夜景海报，霓虹与雨丝",
        ]);

  const resolvedThinking =
    thinkingLabel ?? (kind === "video" ? "正在生成视频" : "正在生成图像");

  const galleryItems = useMemo(() => {
    if (galleryProp !== undefined) return galleryProp;
    return messages
      .map((m) => m.asset)
      .filter((a): a is MediaStudioAsset => Boolean(a));
  }, [galleryProp, messages]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const buildMeta = (): MediaStudioSubmitMeta => ({
    aspect,
    duration: kind === "video" ? duration : undefined,
    styleId,
    modelId: modelId === "default" ? undefined : modelId,
  });

  const submit = (text = draft) => {
    const next = text.trim();
    if (!next || busy) return;
    onSubmit?.(next, buildMeta());
    setDraft("");
  };

  const aspectChips = showAspectChips ? (
    <ChipGroup
      label={aspectLabel}
      options={aspectOptions}
      value={aspect}
      onChange={(next) => {
        onAspectChange?.(next);
        setAspectLocal(next);
      }}
    />
  ) : null;

  const durationChips =
    showDurationChips && kind === "video" ? (
      <ChipGroup
        label={durationLabel}
        options={durationOptions}
        value={duration}
        onChange={(next) => {
          onDurationChange?.(next);
          setDurationLocal(next);
        }}
      />
    ) : null;

  const defaultToolbar = (
    <>
      {aspectChips}
      {durationChips}
    </>
  );

  const toolbarNode =
    renderToolbar?.({
      aspect,
      duration,
      aspectChips,
      durationChips,
    }) ??
    (aspectChips || durationChips ? defaultToolbar : null);

  const composerCtx: MediaStudioComposerContext = {
    value: draft,
    setValue: setDraft,
    busy,
    submit,
    stop: onStop,
    aspect,
    duration,
    styleId,
    modelId,
    defaultToolbar: toolbarNode,
  };

  const renderAssetNode = (
    asset: MediaStudioAsset,
    location: "thread" | "gallery",
    fallbackRatio: number,
  ) => {
    if (renderAsset) {
      return renderAsset(asset, { ratio: asset.ratio ?? fallbackRatio, location });
    }
    return (
      <AssetVisual
        asset={asset}
        showPlay={kind === "video" || asset.kind === "video"}
        ratio={fallbackRatio}
        className={
          location === "thread"
            ? "w-full max-w-md rounded-2xl"
            : "w-full rounded-xl"
        }
      />
    );
  };

  const defaultMessageActions = (message: MediaStudioMessage) => (
    <div className="flex flex-wrap items-center gap-1">
      <IconButton
        aria-label="有用"
        icon={RiThumbUpLine}
        size="small"
        onClick={() => onFeedback?.(message, "up")}
      />
      <IconButton
        aria-label="无用"
        icon={RiThumbDownLine}
        size="small"
        onClick={() => onFeedback?.(message, "down")}
      />
      <IconButton
        aria-label="复制提示词"
        icon={RiFileCopyLine}
        size="small"
        onClick={() => {
          const idx = messages.findIndex((m) => m.id === message.id);
          const priorUser = [...messages.slice(0, idx)]
            .reverse()
            .find((m) => m.role === "user");
          const text = priorUser?.text ?? message.text ?? "";
          if (!text) return;
          void navigator.clipboard?.writeText(text);
          onCopyPrompt?.(text, message);
        }}
      />
      {message.asset ? (
        <IconButton
          aria-label="下载"
          icon={RiDownload2Line}
          size="small"
          onClick={() => onDownload?.(message.asset!)}
        />
      ) : null}
      <IconButton
        aria-label="重新生成"
        icon={RiRefreshLine}
        size="small"
        onClick={() => onRegenerate?.(message)}
      />
    </div>
  );

  const defaultEmpty = (
    <div className="flex h-full min-h-56 flex-col items-center justify-center gap-4 px-2 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-background-secondary-default text-foreground-icon-secondary">
        {kind === "video" ? (
          <RiVideoLine className="size-6" aria-hidden />
        ) : (
          <RiImageLine className="size-6" aria-hidden />
        )}
      </span>
      <div className="space-y-1">
        <p className="text-title-3-medium text-text-primary">
          {emptyTitle ??
            (kind === "video" ? "描述你想生成的视频" : "描述你想生成的图像")}
        </p>
        <p className="max-w-md text-body-medium text-text-secondary">
          {emptyDescription ??
            `选择画幅${kind === "video" ? "与时长" : ""}，输入提示词；结果会出现在对话与右侧画廊。`}
        </p>
      </div>
      {resolvedSuggestions.length > 0 ? (
        <PromptSuggestions
          className="max-w-xl items-center"
          label={suggestionsLabel}
          suggestions={resolvedSuggestions}
          onSelect={(item) => {
            onSelectSuggestion?.(item);
            setDraft(item);
            submit(item);
          }}
        />
      ) : null}
    </div>
  );

  const sidePanelVisible = sidePanelSlot !== false && sideOpen;
  const useCustomSidePanel = sidePanelSlot !== undefined && sidePanelSlot !== false;

  return (
    <div
      className={cx(
        "flex h-full min-h-[560px] w-full overflow-hidden rounded-[20px] border border-border-secondary-default bg-background-primary-default shadow-xs",
        className,
      )}
      {...props}
    >
      <section className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-separator-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 text-body-medium text-text-secondary">
            {headerLeading ?? (
              <>
                <RiFolderLine
                  className="size-4 shrink-0 text-foreground-icon-secondary"
                  aria-hidden
                />
                <span className="truncate">{projectLabel}</span>
                <span className="text-text-tertiary" aria-hidden>
                  /
                </span>
                <span className="truncate text-text-primary">{modeTitle}</span>
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {headerActions !== undefined ? (
              headerActions
            ) : showHeaderActions ? (
              <>
                <IconButton
                  aria-label="分享"
                  icon={RiShareForwardLine}
                  size="small"
                  onClick={onShare}
                />
                {sidePanelSlot !== false ? (
                  <IconButton
                    aria-label={sideOpen ? "收起侧栏" : "打开画廊"}
                    icon={sideOpen ? RiCloseLine : RiLayoutGridLine}
                    size="small"
                    onClick={() => setSideOpen(!sideOpen)}
                    className="md:inline-flex"
                  />
                ) : null}
                <IconButton
                  aria-label="更多"
                  icon={RiMore2Fill}
                  size="small"
                  onClick={onMore}
                />
              </>
            ) : null}
          </div>
        </header>

        <div
          ref={scrollerRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5"
        >
          {messages.length === 0
            ? (emptyState ?? defaultEmpty)
            : messages.map((message, index) => {
                if (renderMessage) {
                  return (
                    <div key={message.id}>{renderMessage(message, index)}</div>
                  );
                }
                if (message.role === "user") {
                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[min(85%,36rem)] rounded-2xl rounded-ee-md bg-background-secondary-default px-3.5 py-2.5 text-body-medium text-text-primary">
                        {message.text}
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={message.id}
                    className="flex max-w-[min(85%,36rem)] flex-col gap-2"
                  >
                    {message.resultLabel ? (
                      <p className="text-caption-1-medium text-text-tertiary">
                        {message.resultLabel}
                      </p>
                    ) : null}
                    {message.pending ? (
                      <div className="rounded-2xl border border-separator-border bg-background-secondary-default/60 px-3 py-4">
                        <AgentThinking variant="wave" label={resolvedThinking} />
                      </div>
                    ) : null}
                    {message.asset
                      ? renderAssetNode(message.asset, "thread", previewRatio)
                      : null}
                    {message.text ? (
                      <p className="text-body-medium text-text-secondary">
                        {message.text}
                      </p>
                    ) : null}
                    {!message.pending && showMessageActions
                      ? (renderMessageActions?.(message) ??
                        defaultMessageActions(message))
                      : null}
                  </div>
                );
              })}
          {busy && messages.every((m) => !m.pending) ? (
            <div className="max-w-md rounded-2xl border border-separator-border bg-background-secondary-default/60 px-3 py-4">
              <AgentThinking variant="wave" label={resolvedThinking} />
            </div>
          ) : null}
        </div>

        <div className="shrink-0 px-4 pb-3.5 pt-2">
          {renderComposer ? (
            renderComposer(composerCtx)
          ) : (
            <MediaComposer
              value={draft}
              onChange={setDraft}
              onSubmit={(text) => {
                if (busy) return;
                onSubmit?.(text, buildMeta());
              }}
              onStop={onStop}
              onAttachPress={onAttachPress}
              onMicPress={onMicPress}
              onModelChange={(id) => {
                if (modelIdProp === undefined) setModelLocal(id);
                onModelChange?.(id);
              }}
              modelId={modelId}
              busy={busy}
              placeholder={placeholder}
              modelLabel={modelLabel}
              models={models}
              agentLabel={agentLabel}
              contextPercent={contextPercent}
              branchLabel={branchLabel}
              projectLabel={
                typeof projectLabel === "string" ? projectLabel : "项目"
              }
              showFooter={showComposerFooter}
              toolbar={toolbarNode}
              footerLeading={
                styleId ? (
                  <span className="inline-flex items-center gap-1 text-accent-600 dark:text-accent-300">
                    <RiSparklingLine className="size-3.5" aria-hidden />
                    {resolvedStyles.find((s) => s.id === styleId)?.label ??
                      styleId}
                  </span>
                ) : null
              }
              {...composerProps}
            />
          )}
        </div>
      </section>

      {sidePanelVisible ? (
        useCustomSidePanel ? (
          sidePanelSlot
        ) : (
          <aside className="hidden w-[min(38%,22rem)] shrink-0 flex-col border-s border-separator-border bg-background-secondary-default/40 md:flex">
            <div className="flex items-center justify-between gap-2 border-b border-separator-border px-3 py-2.5">
              <div className="flex items-center gap-1 rounded-full bg-background-primary-default p-0.5">
                {showGalleryTab ? (
                  <button
                    type="button"
                    onClick={() => setSideTab("gallery")}
                    className={cx(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption-1-medium outline-none",
                      "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      sideTab === "gallery"
                        ? "bg-background-secondary-default text-text-primary shadow-xs"
                        : "text-text-tertiary hover:text-text-secondary",
                    )}
                  >
                    <RiLayoutGridLine className="size-3.5" aria-hidden />
                    {galleryTabLabel}
                  </button>
                ) : null}
                {showStylesTab ? (
                  <button
                    type="button"
                    onClick={() => setSideTab("styles")}
                    className={cx(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption-1-medium outline-none",
                      "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      sideTab === "styles"
                        ? "bg-background-secondary-default text-text-primary shadow-xs"
                        : "text-text-tertiary hover:text-text-secondary",
                    )}
                  >
                    <RiSparklingLine className="size-3.5" aria-hidden />
                    {stylesTabLabel}
                  </button>
                ) : null}
              </div>
              <div className="flex items-center gap-0.5">
                <IconButton
                  aria-label="全屏"
                  icon={RiFullscreenLine}
                  size="small"
                  onClick={onFullscreen}
                />
                <IconButton
                  aria-label="关闭面板"
                  icon={RiCloseLine}
                  size="small"
                  onClick={() => setSideOpen(false)}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {sideTab === "gallery" && showGalleryTab ? (
                galleryItems.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                    <p className="text-body-medium text-text-tertiary">
                      画廊还是空的
                    </p>
                    <p className="text-caption-1-regular text-text-tertiary">
                      生成结果会自动出现在这里
                    </p>
                  </div>
                ) : (
                  <div className="columns-2 gap-2">
                    {galleryItems.map((asset, index) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => onSelectAsset?.(asset)}
                        className="mb-2 block w-full break-inside-avoid overflow-hidden rounded-xl outline-none transition-[box-shadow,transform] hover:shadow-xs focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                      >
                        {renderAssetNode(
                          asset,
                          "gallery",
                          asset.ratio ??
                            (kind === "video"
                              ? previewRatio
                              : GALLERY_RATIOS[index % GALLERY_RATIOS.length]),
                        )}
                      </button>
                    ))}
                  </div>
                )
              ) : null}

              {sideTab === "styles" && showStylesTab ? (
                <div className="grid grid-cols-2 gap-2">
                  {resolvedStyles.map((style, index) => {
                    const selected = styleId === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          onStyleChange?.(style.id);
                          setStyleLocal(style.id);
                          onSelectStyle?.(style);
                        }}
                        className={cx(
                          "overflow-hidden rounded-xl border bg-background-primary-default text-start outline-none transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                          selected
                            ? "border-accent-500 shadow-xs"
                            : "border-separator-border hover:border-border-secondary-default",
                        )}
                      >
                        <AspectRatio ratio={4 / 3}>
                          {style.preview &&
                          !style.preview.startsWith("placeholder:") ? (
                            <img
                              src={style.preview}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <PlaceholderThumb
                              label={style.label}
                              tone={index + 2}
                            />
                          )}
                        </AspectRatio>
                        <span className="block space-y-0.5 px-2 py-1.5">
                          <span className="block text-caption-1-medium text-text-primary">
                            {style.label}
                          </span>
                          {style.description ? (
                            <span className="block text-caption-2-medium text-text-tertiary">
                              {style.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {sidePanelExtra}
            </div>
          </aside>
        )
      ) : null}
    </div>
  );
}
