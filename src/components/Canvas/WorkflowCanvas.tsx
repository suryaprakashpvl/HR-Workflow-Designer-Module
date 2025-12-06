import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,

  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import  type {  Node,
  Edge,
  Connection,
  NodeTypes}from "reactflow";

import "reactflow/dist/style.css";
import { toast } from "react-toastify";

import { nodeTypes as appNodeTypes } from "../nodes";
import Sidebar from "../sidebar/Sidebar";
import NodeFormPanel from "./NodeFormPanel";
import { downloadJSON } from "../../utils/download";
import type { WorkflowNodeData } from "../../types/workflow";
import WorkflowSandbox from "../sandbox/WorkflowSandbox"

const STORAGE_KEY = "wf_v1";

function createEmptyNodes(): Node[] {
  return [];
}

function createEmptyEdges(): Edge[] {
  return [];
}

export default function WorkflowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.nodes ?? createEmptyNodes();
      } catch {
        return createEmptyNodes();
      }
    }
    return createEmptyNodes();
  });

  const [edges, setEdges] = useState<Edge[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.edges ?? createEmptyEdges();
      } catch {
        return createEmptyEdges();
      }
    }
    return createEmptyEdges();
  });

  const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
//   const { project, setViewport } = useReactFlow?.() ?? ({} as any);

  // NodeTypes to pass
  const nodeTypes: NodeTypes = appNodeTypes as NodeTypes;

  // nodes/edges change handlers with ReactFlow helpers
  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    // Basic prevention: do not connect into Start (start cannot have incoming)
    const { target } = connection;
    const targetNode = nodes.find((n) => n.id === target);
    if (targetNode?.type === "start") {
      toast.error("Start node cannot have incoming connections.");
      return;
    }

    setEdges((eds) => addEdge(connection, eds));
  }, [nodes]);

  // drop handlers (drag from sidebar)
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);   

  const makeNodeDataByType = (type: string): WorkflowNodeData => {
    const base = { label: `${type.charAt(0).toUpperCase() + type.slice(1)} node` };
    switch (type) {
      case "start":
        return base;
      case "task":
        return { ...base, description: "", assignee: "", dueDate: "" };
      case "approval":
        return { ...base, approverRole: "", instructions: "" };
      case "automated":
        return { ...base, action: "", payload: "" };
      case "end":
        return base;
      default:
        return base;
    }
  };

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    if (!type) return;

    // Get canvas position using bounding rect
    const r = reactFlowWrapper.current?.getBoundingClientRect();
    const pos = r ? { x: event.clientX - r.left, y: event.clientY - r.top } : { x: event.clientX, y: event.clientY };

    // Prevent multiple start nodes
    if (type === "start" && nodes.some((n) => n.type === "start")) {
      toast.error("Only one Start node is allowed in the workflow.");
      return;
    }

    const id = `${type}_${+new Date()}`;
    const newNode: Node = {
      id,
      type,
      position: pos,
      data: makeNodeDataByType(type),
    };

    setNodes((nds) => nds.concat(newNode));
  }, [nodes]);

  // Quick add handler from Sidebar quick buttons
  const quickAdd = (type: string) => {
    if (type === "start" && nodes.some((n) => n.type === "start")) {
      toast.error("Only one Start node allowed.");
      return;
    }
    const id = `${type}_${+new Date()}`;
    setNodes((nds) => nds.concat({
      id,
      type,
      position: { x: 250 + nds.length * 30, y: 100 + nds.length * 10 },
      data: makeNodeDataByType(type),
    }));
  };

  // selection change handler
  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }: any) => {
    if (selectedNodes?.length) {
      setSelectedElement(selectedNodes[0]);
    } else if (selectedEdges?.length) {
      setSelectedElement(selectedEdges[0]);
    } else {
      setSelectedElement(null);
    }
  }, []);

  // update node data
const updateNode = (id: string, patch: any) => {
  // 1. Update nodes list
  setNodes((nds) =>
    nds.map((n) =>
      n.id === id
        ? { ...n, data: { ...n.data, ...patch } }
        : n
    )
  );

  // 2. Update selected element only if it's the same node
  setSelectedElement((prev) => {
    if (!prev || prev.id !== id) return prev;

    return {
      ...prev,
      data: { ...prev.data, ...patch }
    };
  });
};


console.log(nodes,selectedElement,"srya")

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedElement(null);
  };

  const deleteSelected = () => {
    if (!selectedElement) return;
    if ((selectedElement as Node).id) {
      const id = (selectedElement as Node).id;
      deleteNode(id);
    } else if ((selectedElement as Edge).id) {
      const id = (selectedElement as Edge).id!;
      setEdges((eds) => eds.filter((e) => e.id !== id));
      setSelectedElement(null);
    }
  };

  // persistence: save/load/export/import
  const saveToStorage = () => {
    const payload = { nodes, edges, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    // small visual feedback
    console.log("Saved workflow to localStorage");
  };

  const exportJSON = () => {
    const payload = { nodes, edges };
    downloadJSON(payload, "workflow.json");
  };

  const importJSON = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          toast.success("Workflow imported.");
        } else {
          toast.error("Invalid workflow file.");
        }
      } catch (err) {
        toast.error("Failed to parse file.");
      }
    };
    reader.readAsText(file);
  };

  // basic validation rules
  const validateWorkflow = () => {
    // 1) single start node
    const startNodes = nodes.filter((n) => n.type === "start");
    if (startNodes.length === 0) return { ok: false, message: "Workflow must contain a Start node." };
    if (startNodes.length > 1) return { ok: false, message: "Only one Start node is allowed." };

    // 2) start node must not have incoming edges
    const startId = startNodes[0].id;
    const incomingToStart = edges.some((e) => e.target === startId);
    if (incomingToStart) return { ok: false, message: "Start node must be the first node (no incoming edges allowed)." };

    // 3) end nodes should exist (recommended)
    const endNodes = nodes.filter((n) => n.type === "end");
    if (endNodes.length === 0) return { ok: false, message: "Workflow should contain at least one End node." };

    // optionally check for disconnected nodes
    // ... you can extend this to detect cycles or unreachable nodes

    return { ok: true };
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        deleteSelected();
      }
      // Ctrl/Cmd + S => save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveToStorage();
        toast.success("Saved to localStorage");
      }
      // Ctrl/Cmd + E => export
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        exportJSON();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedElement, nodes, edges]);

  // auto-save to localStorage every 12s (optional)
  useEffect(() => {
    const iv = setInterval(() => saveToStorage(), 12000);
    return () => clearInterval(iv);
  }, [nodes, edges]);

  // initial validation console log
  useEffect(() => {
    const res = validateWorkflow();
    console.log("Validation:", res);
  }, [nodes, edges]);

return (
  <div className="flex h-screen">

    {/* LEFT SIDEBAR */}
    <div className="w-72 bg-gray-900 text-white flex flex-col border-r">

      {/* Node Palette */}
      <div className="p-4 border-b border-gray-100">
        <Sidebar onQuickAdd={quickAdd} />
      </div>

      {/* ACTION BUTTONS */}
      <div className="p-4 flex flex-col gap-3 border-b border-gray-700">

        <button
          onClick={() => {
            const v = validateWorkflow();
            v.ok ? toast.success("Validation OK") : toast.error(v.message);
          }}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Validate
        </button>
         <div className="bg-gray-800 p-3 rounded text-sm">
          {(() => {
            const v = validateWorkflow();
            if (v.ok) return <div className="text-green-400">No issues found ✔</div>;
            return <div className="text-red-400">{v.message}</div>;
          })()}
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded"
            onClick={saveToStorage}
          >
            Save
          </button>

          <button
            className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
            onClick={exportJSON}
          >
            Export
          </button>
        </div>

        <label className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer text-center">
          Import
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => importJSON(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

     
    </div>

    {/* CANVAS */}
    <ReactFlowProvider>
      <div
        ref={reactFlowWrapper}
  className="flex-1 relative bg-white"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <ReactFlow
         nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onSelectionChange={onSelectionChange}
  fitView
  attributionPosition="bottom-left"
  panOnScroll
  panOnDrag
  zoomOnScroll
  zoomOnPinch
  minZoom={0.1}
  maxZoom={2}
  translateExtent={[
    [-Infinity, -Infinity],
    [Infinity, Infinity],
  ]}
        >
          <Background gap={16} size={1} color="black"/>
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>

    {/* RIGHT PANEL: NODE FORM */}
    <NodeFormPanel
      selectedNode={
        selectedElement && "id" in selectedElement
          ? (selectedElement as Node)
          : null
      }
      updateNode={updateNode}
      deleteNode={deleteNode}
    />
    <WorkflowSandbox nodes={nodes} edges={edges} />


  </div>
);

}
