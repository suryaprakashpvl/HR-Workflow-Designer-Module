import React, { useState, useEffect } from "react";
import type { Node } from "reactflow";

import type{ AutomationAction } from "../../api/mockActions";
import { getAutomations } from "../../api/mockActions";

type Props = {
  selectedNode: Node | null;
  updateNode: (id: string, patch: any) => void;
  deleteNode: (id: string) => void;
};



export default function NodeFormPanel({ selectedNode, updateNode, deleteNode }: Props) {
  const [localData, setLocalData] = useState<any>({});
  const [actions, setActions] = useState<AutomationAction[]>([]);

    useEffect(() => {
    getAutomations().then((res) => setActions(res));
  }, []);

  useEffect(() => {
    if (selectedNode) setLocalData(selectedNode.data || {});
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <aside className="w-0 p-4 border-l bg-gray-100 flex items-center text-gray-500 text-sm">
        {/* No node selected */}
      </aside>
    );
  }

  const onChange = (key: string, value: any) => {
    console.log(key,value,"customFields")
    const updated = { ...localData, [key]: value };
    setLocalData(updated);
    updateNode(selectedNode.id, updated);
  };

  const updateArrayField = (key: string, index: number, field: string, value: string) => {
    const arr = [...(localData[key] || [])];
    arr[index] = { ...arr[index], [field]: value };
    onChange(key, arr);
  };

  const addArrayField = (key: string) => {
    const arr = [...(localData[key] || []), { key: "", value: "" }];
    onChange(key, arr);
  };

  const removeArrayField = (key: string, index: number) => {
    const arr = [...(localData[key] || [])];
    arr.splice(index, 1);
    onChange(key, arr);
  };

  return (
    <aside className="w-70 p-6 border-l bg-gray-100 overflow-y-auto">
      {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-gray-300">
        <div>
          <div className="text-lg font-semibold text-gray-900">Edit Node</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {selectedNode.type} • {selectedNode.id}
          </div>
        </div>

        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
        >
          Delete
        </button>
      </div>

      {/* Title */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-800 mb-1">Title</label>
        <input
          className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
          value={localData.label || ""}
          onChange={(e) => onChange("label", e.target.value)}
        />
      </div>

      {/* Node-specific fields */}
      {selectedNode.type === "start" && (
        <>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">Metadata</label>
            {(localData.metadata || []).map((m: any, i: number) => (
              <div key={i} className="flex gap-1 mb-1">
                <input
                  placeholder="Key"
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
                  value={m.key}
                  onChange={(e) => updateArrayField("metadata", i, "key", e.target.value)}
                />
                <input
                  placeholder="Value"
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
                  value={m.value}
                  onChange={(e) => updateArrayField("metadata", i, "value", e.target.value)}
                />
                <button
                  className="text-red-500"
                  onClick={() => removeArrayField("metadata", i)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="text-xs text-blue-600"
              onClick={() => addArrayField("metadata")}
            >
              + Add Metadata
            </button>
          </div>
        </>
      )}

      {selectedNode.type === "task" && (
        <>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">Description</label>
            <textarea
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white h-20 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              value={localData.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">Assignee</label>
            <input
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
              value={localData.assignee || ""}
              onChange={(e) => onChange("assignee", e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
              value={localData.dueDate || ""}
              onChange={(e) => onChange("dueDate", e.target.value)}
            />
          </div>

        <div className="mt-4">
  <label className="block text-xs font-medium text-gray-800 mb-1">Custom Fields</label>
  {(localData.customFields || []).map((cf: any, i: number) => (
    <div key={i} className="flex gap-1 mb-1">
      <input
        placeholder="Key"
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
        value={cf.key || ""}
        onChange={(e) => {
          const updatedFields = [...(localData.customFields || [])];
          updatedFields[i] = { ...updatedFields[i], key: e.target.value };
          onChange("customFields", updatedFields);
        }}
      />
      <input
        placeholder="Value"
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
        value={cf.value || ""}
        onChange={(e) => {
          const updatedFields = [...(localData.customFields || [])];
          updatedFields[i] = { ...updatedFields[i], value: e.target.value };
          onChange("customFields", updatedFields);
        }}
      />
      <button
        className="text-red-500"
        onClick={() => {
          const updatedFields = [...(localData.customFields || [])];
          updatedFields.splice(i, 1);
          onChange("customFields", updatedFields);
        }}
      >
        ✕
      </button>
    </div>
  ))}
  <button
    className="text-xs text-blue-600"
    onClick={() => {
      const updatedFields = [...(localData.customFields || []), { key: "", value: "" }];
      onChange("customFields", updatedFields);
    }}
  >
    + Add Field
  </button>
</div>
        </>
      )}

      {selectedNode.type === "approval" && (
        <>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">Approver Role</label>
            <input
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
              value={localData.approverRole || ""}
              onChange={(e) => onChange("approverRole", e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">Auto-approve Threshold</label>
            <input
              type="number"
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
              value={localData.autoApprove || ""}
              onChange={(e) => onChange("autoApprove", e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">Instructions</label>
            <textarea
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white h-20 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              value={localData.instructions || ""}
              onChange={(e) => onChange("instructions", e.target.value)}
            />
          </div>
        </>
      )}

      {selectedNode.type === "automated" && (
        <>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">Action</label>
            <select
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
              value={localData.action || ""}
              onChange={(e) => onChange("action", e.target.value)}
            >
              <option value="">-- Select Action --</option>
             {actions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic parameters */}
           {localData.action &&
            actions
              .find((a) => a.id === localData.action)
              ?.params.map((param: string) => (
                <div className="mt-4" key={param}>
                  <label className="block text-xs font-medium text-gray-800 mb-1">{param}</label>
                  <input
                    className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white"
                    value={localData[param] || ""}
                    onChange={(e) => onChange(param, e.target.value)}
                  />
                </div>
              ))}
        </>
      )}

      {selectedNode.type === "end" && (
        <>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-800 mb-1">End Message</label>
            <textarea
              className="w-full border border-black rounded-lg px-2 py-1 text-sm text-black bg-white h-20 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              value={localData.endMessage || ""}
              onChange={(e) => onChange("endMessage", e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={localData.summary || false}
              onChange={(e) => onChange("summary", e.target.checked)}
            />
            <label className="text-xs font-medium text-gray-800">Summary</label>
          </div>
        </>
      )}
    </aside>
  );
}
