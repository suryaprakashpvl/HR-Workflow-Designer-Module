import { Handle, Position } from "reactflow";

export default function ApprovalNode({ data }: any) {
  return (
    <div className="min-w-[180px] p-3 rounded-xl bg-yellow-50 border shadow-sm">
      <div className="flex items-center gap-2">
        <strong className="text-sm text-black">✅ Approval</strong>
        <span className="text-xs text-gray-600">{data.approverRole}</span>
      </div>
      <div className="mt-2 text-xs">{data.instructions}</div>

      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  );
}
