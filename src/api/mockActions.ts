// mockApi.ts

export type AutomationAction = {
  id: string;
  label: string;
  params: string[];
};

export type SimulationStep = {
  nodeId: string;
  status: string;
  message: string;
};

export const getAutomations = async (): Promise<AutomationAction[]> => {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  return [
    { id: "send_email", label: "Send Email", params: ["to", "subject"] },
    { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  ];
};

export const simulateWorkflow = async (workflow: any): Promise<SimulationStep[]> => {
  await new Promise((r) => setTimeout(r, 500));

  // Simple mock simulation: iterate over nodes
  return workflow.nodes.map((node: any, index: number) => ({
    nodeId: node.id,
    status: "completed",
    message: `Node "${node.data.label || node.type}" executed successfully`,
  }));
};
