export type NodeType = "start" | "task" | "approval" | "automated" | "end";

export interface BaseNodeData {
  label: string;
  meta?: Record<string, string>;
}

export interface StartNodeData extends BaseNodeData {}

export interface TaskNodeData extends BaseNodeData {
  description?: string;
  assignee?: string;
  dueDate?: string;
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole?: string;
  instructions?: string;
}

export interface AutomatedNodeData extends BaseNodeData {
  action?: string;
  payload?: string;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData;
