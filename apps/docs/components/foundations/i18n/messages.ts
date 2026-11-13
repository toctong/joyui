/**
 * Built-in UI copy catalogs. Keys are the English source strings that ship
 * in components; values are the localized replacements. TemplateCopy walks
 * the rendered tree and rewrites matching strings.
 *
 * Apps can pass `messages` / `translate` on JoyUIProvider to override or
 * extend. Prefer exact English keys so existing `useTemplateCopy()` call
 * sites keep working without churn.
 */

export type JoyMessages = Record<string, string>;

/** English — identity map (source of truth for keys). */
export const en: JoyMessages = {
  // Pagination
  Previous: "Previous",
  Next: "Next",
  Pagination: "Pagination",
  "Go to page": "Go to page",

  // Empty / search
  "No results": "No results",
  "No results.": "No results.",
  "No items.": "No items.",

  // Auth card
  "Welcome back": "Welcome back",
  "Sign in to pick up where you left off.": "Sign in to pick up where you left off.",
  "Sign in": "Sign in",
  "New here?": "New here?",
  "Create an account": "Create an account",
  "Create your account": "Create your account",
  "Start building with JoyUI in a couple of minutes.":
    "Start building with JoyUI in a couple of minutes.",
  "Create account": "Create account",
  "Already have an account?": "Already have an account?",
  "Check your inbox": "Check your inbox",
  "Enter the code we sent to finish signing in.":
    "Enter the code we sent to finish signing in.",
  "Verify and continue": "Verify and continue",
  "Code not arriving?": "Code not arriving?",
  "Send a new one": "Send a new one",
  "Remember me": "Remember me",
  "Forgot password?": "Forgot password?",
  "or continue with": "or continue with",
  "Full name": "Full name",
  Email: "Email",
  Password: "Password",
  "Confirm password": "Confirm password",
  "Verification code": "Verification code",
  "At least 8 characters": "At least 8 characters",
  "Enter your password": "Enter your password",
  "Repeat your password": "Repeat your password",
  "By creating an account you agree to our Terms of Service and Privacy Policy.":
    "By creating an account you agree to our Terms of Service and Privacy Policy.",
  "We use this to contact you, and never share it.":
    "We use this to contact you, and never share it.",

  // Dashboard chrome
  "Quick Search": "Quick Search",
  Support: "Support",
  Settings: "Settings",
  "From last month": "From last month",
  "No customers match your filters.": "No customers match your filters.",

  // Common a11y / controls
  Loading: "Loading",
  Close: "Close",
  Cancel: "Cancel",
  Save: "Save",
  Delete: "Delete",
  Search: "Search",
  Filter: "Filter",
  Export: "Export",
  Refresh: "Refresh",
};

/** Simplified Chinese. */
export const zhCN: JoyMessages = {
  Previous: "上一页",
  Next: "下一页",
  Pagination: "分页",
  "Go to page": "前往第",

  "No results": "无结果",
  "No results.": "暂无结果。",
  "No items.": "暂无项目。",

  "Welcome back": "欢迎回来",
  "Sign in to pick up where you left off.": "登录以继续上次的工作。",
  "Sign in": "登录",
  "New here?": "还没有账号？",
  "Create an account": "创建账号",
  "Create your account": "创建你的账号",
  "Start building with JoyUI in a couple of minutes.": "几分钟即可开始使用 JoyUI。",
  "Create account": "创建账号",
  "Already have an account?": "已有账号？",
  "Check your inbox": "请查收邮件",
  "Enter the code we sent to finish signing in.": "输入我们发送的验证码以完成登录。",
  "Verify and continue": "验证并继续",
  "Code not arriving?": "没收到验证码？",
  "Send a new one": "重新发送",
  "Remember me": "记住我",
  "Forgot password?": "忘记密码？",
  "or continue with": "或使用以下方式继续",
  "Full name": "姓名",
  Email: "邮箱",
  Password: "密码",
  "Confirm password": "确认密码",
  "Verification code": "验证码",
  "At least 8 characters": "至少 8 个字符",
  "Enter your password": "请输入密码",
  "Repeat your password": "请再次输入密码",
  "By creating an account you agree to our Terms of Service and Privacy Policy.":
    "创建账号即表示你同意我们的服务条款与隐私政策。",
  "We use this to contact you, and never share it.": "仅用于联系你，不会分享给他人。",

  "Quick Search": "快速搜索",
  Support: "支持",
  Settings: "设置",
  "From last month": "较上月",
  "No customers match your filters.": "没有符合筛选条件的客户。",

  Loading: "加载中",
  Close: "关闭",
  Cancel: "取消",
  Save: "保存",
  Delete: "删除",
  Search: "搜索",
  Filter: "筛选",
  Export: "导出",
  Refresh: "刷新",
};

export const builtInLocales = {
  en,
  "en-US": en,
  "zh-CN": zhCN,
  "zh-Hans": zhCN,
  zh: zhCN,
} as const;

export type BuiltInLocale = keyof typeof builtInLocales;

export function resolveMessages(
  locale: string,
  override?: JoyMessages | Partial<JoyMessages>,
): JoyMessages {
  const normalized = locale.trim();
  const base =
    builtInLocales[normalized as BuiltInLocale] ??
    builtInLocales[normalized.split("-")[0] as BuiltInLocale] ??
    en;
  return override ? { ...base, ...override } : { ...base };
}

/** Exact-match translator for TemplateCopyProvider. */
export function createMessageTranslator(
  messages: JoyMessages,
): (text: string) => string {
  return (text: string) => {
    if (Object.prototype.hasOwnProperty.call(messages, text)) {
      return messages[text]!;
    }
    // "Go to page 3" → "前往第 3" when key is "Go to page"
    const goTo = messages["Go to page"];
    if (goTo && text.startsWith("Go to page ")) {
      return `${goTo} ${text.slice("Go to page ".length)}`;
    }
    return text;
  };
}
