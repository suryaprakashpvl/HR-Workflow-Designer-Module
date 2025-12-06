import React, { useState } from "react";
import { simulateWorkflow } from "../../api/mockActions";
import { validateGraph } from "../../utils/validateWorkflowGraph";

type Props = {
  nodes: any[];
  edges: any[];
};

export default function WorkflowSandbox({ nodes, edges }: Props) {
  const [log, setLog] = useState<{ message: string; type: "error" | "info" }[]>([]);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    setLog([]);

    // 1. Validate structure first
    const validationErrors = validateGraph(nodes, edges);
    if (validationErrors.length) {
      // Mark validation errors as type "error"
      setLog(validationErrors.map((msg) => ({ message: msg, type: "error" })));
      setLoading(false);
      return;
    }

    // 2. Run simulation
    try {
      const workflow = { nodes, edges };
      const result = await simulateWorkflow(workflow);
      setLog(result.map((step) => ({ message: `${step.nodeId}: ${step.message}`, type: "info" })));
    } catch (err) {
      setLog([{ message: `Error: ${err}`, type: "error" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-60 p-4 border-l bg-gray-100 flex flex-col gap-4">

  {/* Panel Header */}
  <div className="text-lg font-semibold text-gray-800">
    Workflow Simulator
  </div>

  {/* Run Button */}
  <button
    className={`px-4 py-2 rounded-lg text-white font-medium shadow 
      ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
    `}
    onClick={runSimulation}
    disabled={loading}
  >
    {loading ? "Running..." : "Run Simulation"}
  </button>

  {/* Logs */}
  <div className="bg-white border border-gray-300 rounded-lg p-3 h-64 overflow-y-auto shadow-inner">

    {log.length === 0 && (
      <div className="text-gray-400 text-sm text-center mt-10">
        No logs yet. Run the simulation.
      </div>
    )}

   {log.map((entry, i) => {
  const isError =
    entry.type === "error" ||
    entry.message.toLowerCase().includes("error") ||
    entry.message.toLowerCase().includes("should");

  return (
    <div
      key={i}
      className={`mb-2 text-sm flex items-start gap-2 ${
        isError ? "text-red-600" : "text-green-700"
      }`}
    >
      <span>{isError ? "⚠️" : "✔️"}</span>
      <span>{entry.message}</span>
    </div>
  );
})}
  </div>
</aside>

  );
}
