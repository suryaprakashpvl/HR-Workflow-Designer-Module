// utils/validateWorkflowGraph.ts

type Node = { id: string; type: string };
type Edge = { source: string; target: string };

export function validateGraph(nodes: Node[], edges: Edge[]) {
  const errors: string[] = [];

  // 1. Check single Start node
  const startNodes = nodes.filter((n) => n.type === "start");
  if (startNodes.length === 0) errors.push("Workflow must contain a Start node.");
  if (startNodes.length > 1) errors.push("Only one Start node allowed.");

  // 2. Check at least one End node
  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length === 0) errors.push("Workflow should contain at least one End node.");

  // 3. Check start node has no incoming edges
  const startId = startNodes[0]?.id;
  if (startId && edges.some((e) => e.target === startId)) {
    errors.push("Start node cannot have incoming edges.");
  }

  // 4. Check for disconnected nodes
  const connectedNodes = new Set<string>();
  edges.forEach((e) => {
    connectedNodes.add(e.source);
    connectedNodes.add(e.target);
  });

  const disconnected = nodes.filter((n) => !connectedNodes.has(n.id) && n.type !== "start");
  if (disconnected.length) {
    errors.push(`Disconnected nodes: ${disconnected.map((n) => n.id).join(", ")}`);
  }

  // 5. Detect cycles using DFS
  const adjacency: Record<string, string[]> = {};
  edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  const visited: Record<string, boolean> = {};
  const recStack: Record<string, boolean> = {};

  const hasCycle = (nodeId: string): boolean => {
    if (!visited[nodeId]) {
      visited[nodeId] = true;
      recStack[nodeId] = true;

      const neighbors = adjacency[nodeId] || [];
      for (let n of neighbors) {
        if (!visited[n] && hasCycle(n)) return true;
        else if (recStack[n]) return true;
      }
    }
    recStack[nodeId] = false;
    return false;
  };

  if (nodes.some((n) => hasCycle(n.id))) {
    errors.push("Workflow contains cycles (loops).");
  }

  return errors;
}
