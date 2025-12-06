import { Handle, Position } from "reactflow";

export default function TaskNode({ data }: any) {
  return (
    <div className="min-w-[180px] p-3 rounded-xl shadow-sm bg-white border">
      <div className="flex justify-between items-center">
        <strong className="text-sm text-black">📝 {data.label}</strong>
        <div className="text-xs text-gray-500">{data.assignee || ""}</div>
      </div>
      {data.description && (
        <div className="mt-2 text-xs text-gray-700">{data.description}</div>
      )}
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  );
}
