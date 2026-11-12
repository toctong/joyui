"use client";

import * as React from "react";
import { CopyPageMenu } from "@/components/copy-page-menu";

type DocsPageActionsValue = {
  markdownUrl: string;
  githubUrl: string;
  title: string;
  component?: string;
  subscribe: (listener: (claimed: boolean) => void) => () => void;
  claim: () => boolean;
  release: () => void;
  isClaimed: () => boolean;
};

const DocsPageActionsContext =
  React.createContext<DocsPageActionsValue | null>(null);

export function DocsPageActionsProvider({
  markdownUrl,
  githubUrl,
  title,
  component,
  children,
}: {
  markdownUrl: string;
  githubUrl: string;
  title: string;
  component?: string;
  children: React.ReactNode;
}) {
  const claimCount = React.useRef(0);
  const listeners = React.useRef(new Set<(claimed: boolean) => void>());

  const notify = React.useCallback(() => {
    const claimed = claimCount.current > 0;
    listeners.current.forEach((listener) => listener(claimed));
  }, []);

  const value = React.useMemo<DocsPageActionsValue>(
    () => ({
      markdownUrl,
      githubUrl,
      title,
      component,
      subscribe: (listener) => {
        listeners.current.add(listener);
        return () => {
          listeners.current.delete(listener);
        };
      },
      claim: () => {
        const isFirst = claimCount.current === 0;
        claimCount.current += 1;
        notify();
        return isFirst;
      },
      release: () => {
        claimCount.current = Math.max(0, claimCount.current - 1);
        notify();
      },
      isClaimed: () => claimCount.current > 0,
    }),
    [markdownUrl, githubUrl, title, component, notify],
  );

  return (
    <DocsPageActionsContext.Provider value={value}>
      {children}
    </DocsPageActionsContext.Provider>
  );
}

function ActionButtons() {
  const ctx = React.useContext(DocsPageActionsContext);
  if (!ctx) return null;

  return (
    <CopyPageMenu
      markdownUrl={ctx.markdownUrl}
      title={ctx.title}
      component={ctx.component}
    />
  );
}

/** Shown under the title when no demo frame has claimed the actions. */
export function DocsHeaderActions() {
  const ctx = React.useContext(DocsPageActionsContext);
  const [claimed, setClaimed] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!ctx) return;
    setClaimed(ctx.isClaimed());
    return ctx.subscribe(setClaimed);
  }, [ctx]);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!ctx || !ready || claimed) return null;

  return (
    <div className="flex flex-row items-center gap-2 border-b pb-6">
      <ActionButtons />
    </div>
  );
}

/** Renders page actions in every demo toolbar; also claims so header actions hide. */
export function DocsToolbarActions() {
  const ctx = React.useContext(DocsPageActionsContext);

  React.useLayoutEffect(() => {
    if (!ctx) return;
    ctx.claim();
    return () => ctx.release();
  }, [ctx]);

  if (!ctx) return null;
  return <ActionButtons />;
}
