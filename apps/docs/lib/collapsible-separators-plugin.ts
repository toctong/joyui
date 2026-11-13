import type { LoaderPlugin } from "fumadocs-core/source";
import type * as PageTree from "fumadocs-core/page-tree";

/**
 * Turns `---Section---` separators into collapsible folders that wrap the
 * following pages until the next separator. Keeps flat MDX paths / URLs.
 */
function groupSeparatorsIntoFolders(nodes: PageTree.Node[]): PageTree.Node[] {
  const out: PageTree.Node[] = [];
  let i = 0;

  while (i < nodes.length) {
    const node = nodes[i]!;

    if (node.type !== "separator") {
      if (node.type === "folder") {
        out.push({
          ...node,
          children: groupSeparatorsIntoFolders(node.children),
        });
      } else {
        out.push(node);
      }
      i += 1;
      continue;
    }

    const children: PageTree.Node[] = [];
    i += 1;
    while (i < nodes.length && nodes[i]!.type !== "separator") {
      const child = nodes[i]!;
      children.push(
        child.type === "folder"
          ? { ...child, children: groupSeparatorsIntoFolders(child.children) }
          : child,
      );
      i += 1;
    }

    if (children.length === 0) {
      out.push(node);
      continue;
    }

    out.push({
      type: "folder",
      name: node.name,
      icon: node.icon,
      $id: node.$id ? `${node.$id}:folder` : undefined,
      collapsible: true,
      children,
    });
  }

  return out;
}

export function collapsibleSeparatorsPlugin(): LoaderPlugin {
  return {
    name: "joyui:collapsible-separators",
    enforce: "post",
    transformPageTree: {
      root(node) {
        return {
          ...node,
          children: groupSeparatorsIntoFolders(node.children),
        };
      },
    },
  };
}
