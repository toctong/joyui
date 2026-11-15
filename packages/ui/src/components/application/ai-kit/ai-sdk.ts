/**
 * First-party re-exports so apps can stay on `@joyui/react` / `@joyui/react/ai`
 * without a separate install of the AI SDK packages (they ship as dependencies).
 */
export { useChat } from "@ai-sdk/react";
export type { UseChatHelpers, UseChatOptions } from "@ai-sdk/react";
export { DefaultChatTransport } from "ai";
export type {
  ChatStatus,
  ChatTransport,
  UIMessage,
  UIMessagePart,
} from "ai";
