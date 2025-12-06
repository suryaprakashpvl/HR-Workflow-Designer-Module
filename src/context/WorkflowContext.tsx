import React, { createContext, useContext, useState } from "react";
import type { Node, Edge } from "reactflow";

interface WorkflowContextType {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <WorkflowContext.Provider
      value={{ nodes, edges, setNodes, setEdges, selectedNode, setSelectedNode }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error("WorkflowContext missing!");
  return ctx;
}
