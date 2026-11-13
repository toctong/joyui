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
  "No logs yet": "No logs yet",
  "Run a task or sign in to generate entries.":
    "Run a task or sign in to generate entries.",
  "Search Quark shares": "Search Quark shares",
  "Enter a show or movie name, then Search.":
    "Enter a show or movie name, then Search.",
  "Try another keyword or check plugin settings.":
    "Try another keyword or check plugin settings.",
  "This folder is empty.": "This folder is empty.",
  "No tasks yet. Create one above or from Discovery.":
    "No tasks yet. Create one above or from Discovery.",
  "No running tasks. Create one in Tasks or Discovery.":
    "No running tasks. Create one in Tasks or Discovery.",
  "No transfers yet": "No transfers yet",
  "Add a Quark cookie in Settings, then run a task.":
    "Add a Quark cookie in Settings, then run a task.",
  "Create task": "Create task",
  "New task": "New task",
  "New folder": "New folder",
  "No rating": "No rating",

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

  // Settings modal
  General: "General",
  Profile: "Profile",
  Tools: "Tools",
  Storage: "Storage",
  Marketplace: "Marketplace",
  "Close settings": "Close settings",
  Saved: "Saved",
  "Current plan": "Current plan",
  "Ultra · $149/mo": "Ultra · $149/mo",
  "7× the usage of the Regular plan.": "7× the usage of the Regular plan.",
  "Upgrade to Max": "Upgrade to Max",
  Limits: "Limits",
  "7× the usage of the Premium plan.": "7× the usage of the Premium plan.",
  "Manage limits": "Manage limits",
  "Pull requests": "Pull requests",
  "Review provider": "Review provider",
  "Choose GitHub or another provider for code reviews.":
    "Choose GitHub or another provider for code reviews.",
  "PR destination": "PR destination",
  "Open pull request links inside the app or in the browser.":
    "Open pull request links inside the app or in the browser.",
  "Inside JoyUI": "Inside JoyUI",
  "In the browser": "In the browser",
  Notifications: "Notifications",
  "Critical requests": "Critical requests",
  "Notify me when a decision needs approval.":
    "Notify me when a decision needs approval.",
  "System notifications": "System notifications",
  "Show a notification when an agent finishes a task.":
    "Show a notification when an agent finishes a task.",
  "Completion sound": "Completion sound",
  "Play a sound when a task completes.": "Play a sound when a task completes.",
  "Dispatch alerts": "Dispatch alerts",
  "Send a push notification when JoyUI messages you.":
    "Send a push notification when JoyUI messages you.",
  "First name": "First name",
  "Last name": "Last name",
  "Date of birth": "Date of birth",
  "JoyUI account": "JoyUI account",
  Manage: "Manage",
  "Public profile": "Public profile",
  "Make your profile page visible to anyone with the link.":
    "Make your profile page visible to anyone with the link.",
  "Device ID": "Device ID",
  "Log out from all devices": "Log out from all devices",
  "Log out": "Log out",

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
  Copy: "Copy",
  Copied: "Copied",
  Progress: "Progress",
  Rating: "Rating",
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
  "No logs yet": "暂无日志",
  "Run a task or sign in to generate entries.": "运行任务或登录后会生成记录。",
  "Search Quark shares": "搜索夸克分享",
  "Enter a show or movie name, then Search.": "输入剧名或电影名后点击搜索。",
  "Try another keyword or check plugin settings.": "换个关键词，或检查插件设置。",
  "This folder is empty.": "此文件夹为空。",
  "No tasks yet. Create one above or from Discovery.":
    "还没有任务。可在上方新建，或从发现页创建。",
  "No running tasks. Create one in Tasks or Discovery.":
    "没有运行中的任务。可在任务页或发现页创建。",
  "No transfers yet": "暂无转存记录",
  "Add a Quark cookie in Settings, then run a task.":
    "请在设置中添加夸克 Cookie，然后运行任务。",
  "Create task": "创建任务",
  "New task": "新建任务",
  "New folder": "新建文件夹",
  "No rating": "暂无评分",

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

  General: "通用",
  Profile: "资料",
  Tools: "工具",
  Storage: "存储",
  Marketplace: "市场",
  "Close settings": "关闭设置",
  Saved: "已保存",
  "Current plan": "当前方案",
  "Ultra · $149/mo": "Ultra · $149/月",
  "7× the usage of the Regular plan.": "用量为 Regular 方案的 7 倍。",
  "Upgrade to Max": "升级到 Max",
  Limits: "用量限额",
  "7× the usage of the Premium plan.": "用量为 Premium 方案的 7 倍。",
  "Manage limits": "管理限额",
  "Pull requests": "Pull Request",
  "Review provider": "评审平台",
  "Choose GitHub or another provider for code reviews.":
    "选择 GitHub 或其他平台进行代码评审。",
  "PR destination": "PR 打开方式",
  "Open pull request links inside the app or in the browser.":
    "在应用内或浏览器中打开 Pull Request 链接。",
  "Inside JoyUI": "在 JoyUI 内",
  "In the browser": "在浏览器中",
  Notifications: "通知",
  "Critical requests": "关键请求",
  "Notify me when a decision needs approval.": "需要确认决策时通知我。",
  "System notifications": "系统通知",
  "Show a notification when an agent finishes a task.":
    "智能体完成任务时显示通知。",
  "Completion sound": "完成提示音",
  "Play a sound when a task completes.": "任务完成时播放提示音。",
  "Dispatch alerts": "推送提醒",
  "Send a push notification when JoyUI messages you.":
    "JoyUI 发来消息时推送到手机。",
  "First name": "名",
  "Last name": "姓",
  "Date of birth": "出生日期",
  "JoyUI account": "JoyUI 账号",
  Manage: "管理",
  "Public profile": "公开资料",
  "Make your profile page visible to anyone with the link.":
    "开启后，任何持有链接的人都可以查看你的资料页。",
  "Device ID": "设备 ID",
  "Log out from all devices": "退出所有设备",
  "Log out": "退出登录",

  Loading: "加载中",
  Close: "关闭",
  Cancel: "取消",
  Save: "保存",
  Delete: "删除",
  Search: "搜索",
  Filter: "筛选",
  Export: "导出",
  Refresh: "刷新",
  Copy: "复制",
  Copied: "已复制",
  Progress: "进度",
  Rating: "评分",
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
  if (!override) return { ...base };
  // Partial values may be `undefined`; skip them so the result stays JoyMessages.
  const next: JoyMessages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value !== undefined) next[key] = value;
  }
  return next;
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
