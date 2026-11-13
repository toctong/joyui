import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  GettingStartedFeatures,
  GettingStartedFoundations,
  GettingStartedHero,
  GettingStartedLead,
  GettingStartedNext,
  GettingStartedPaths,
  GettingStartedStep,
  GettingStartedSteps,
} from "@/components/docs/getting-started";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    GettingStartedHero,
    GettingStartedPaths,
    GettingStartedFeatures,
    GettingStartedSteps,
    GettingStartedStep,
    GettingStartedFoundations,
    GettingStartedNext,
    GettingStartedLead,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
