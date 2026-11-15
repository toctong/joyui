import {
  getToolName,
  isReasoningUIPart,
  isToolUIPart,
  type ChatStatus,
  type UIMessage,
} from "ai";
import type { ToolCallStatus } from "../tool-call/tool-call";

/** True while a reply is queued or streaming. */
export function isChatBusy(status: ChatStatus): boolean {
  return status === "submitted" || status === "streaming";
}

/** Join all text parts on a UIMessage. */
export function getUIMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

/** Show AgentThinking until the latest assistant turn has visible text. */
export function shouldShowThinking(
  messages: UIMessage[],
  status: ChatStatus,
): boolean {
  if (!isChatBusy(status)) return false;
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant") return true;
  return getUIMessageText(last).length === 0;
}

export function mapToolStateToStatus(
  state: string | undefined,
): ToolCallStatus {
  if (state === "output-error") return "error";
  if (
    state === "output-available" ||
    state === "output-denied" ||
    state === "approval-responded"
  ) {
    return "done";
  }
  if (
    state === "input-streaming" ||
    state === "input-available" ||
    state === "approval-requested"
  ) {
    return "running";
  }
  return "pending";
}

export function summarizeToolInput(input: unknown): string | undefined {
  if (input == null) return undefined;
  if (typeof input === "string") {
    return input.length > 96 ? `${input.slice(0, 93)}…` : input;
  }
  try {
    const raw = JSON.stringify(input);
    if (!raw || raw === "{}") return undefined;
    return raw.length > 96 ? `${raw.slice(0, 93)}…` : raw;
  } catch {
    return undefined;
  }
}

export function formatToolOutput(output: unknown): string | undefined {
  if (output == null) return undefined;
  if (typeof output === "string") return output;
  try {
    return JSON.stringify(output, null, 2);
  } catch {
    return String(output);
  }
}

export type AiSource = {
  id: string;
  title: string;
  href?: string;
};

/** Collect source-url / source-document parts for Citation rows. */
export function getUIMessageSources(message: UIMessage): AiSource[] {
  const sources: AiSource[] = [];
  for (const part of message.parts) {
    if (part.type === "source-url") {
      sources.push({
        id: part.sourceId,
        title: part.title ?? part.url,
        href: part.url,
      });
    } else if (part.type === "source-document") {
      sources.push({
        id: part.sourceId,
        title: part.title,
      });
    }
  }
  return sources;
}

export {
  getToolName,
  isReasoningUIPart,
  isToolUIPart,
};
