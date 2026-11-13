"use client";

import { RiMicLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { VoiceRing } from "@/components/base/voice-ring/voice-ring";
import { cx } from "@/utils/cx";

export function VoiceRingActivePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-center justify-center gap-10 py-4", className)}>
      <div className="flex flex-col items-center gap-2">
        <VoiceRing>
          <Button iconOnly leadingIcon={RiMicLine} aria-label="麦克风" variant="secondary" />
        </VoiceRing>
        <span className="text-caption-1-medium text-text-tertiary">空闲</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <VoiceRing active>
          <Button iconOnly leadingIcon={RiMicLine} aria-label="正在聆听" />
        </VoiceRing>
        <span className="text-caption-1-medium text-text-tertiary">聆听中</span>
      </div>
    </div>
  );
}
