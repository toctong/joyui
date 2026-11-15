import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/application/admin/admin-dashboard";
import { AiChatTemplate } from "@/components/application/ai-chat-template/ai-chat-template";
import { AuthTemplate } from "@/components/application/auth-template/auth-template";
import { WorkspaceTemplate } from "@/components/application/workspace-template/workspace-template";

const TEMPLATES = {
  "admin-dashboard": {
    title: "后台管理",
    render: () => (
      <div className="h-dvh w-full">
        <AdminDashboard />
      </div>
    ),
  },
  "ai-chat-template": {
    title: "AI 对话",
    render: () => (
      <div className="flex h-dvh w-full items-stretch justify-center bg-background-secondary-default p-4 sm:p-6">
        <AiChatTemplate className="h-full max-w-3xl" />
      </div>
    ),
  },
  "auth-template": {
    title: "登录页",
    render: () => (
      <AuthTemplate mode="signin" frameClassName="min-h-dvh" />
    ),
  },
  "workspace-template": {
    title: "工作台",
    render: () => (
      <div className="h-dvh w-full">
        <WorkspaceTemplate />
      </div>
    ),
  },
} as const;

type Slug = keyof typeof TEMPLATES;

export function generateStaticParams() {
  return Object.keys(TEMPLATES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = TEMPLATES[slug as Slug];
  return {
    title: entry ? `${entry.title} 预览` : "模板预览",
  };
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = TEMPLATES[slug as Slug];
  if (!entry) notFound();
  return (
    <div className="min-h-dvh bg-background-full text-text-primary">
      {entry.render()}
    </div>
  );
}
