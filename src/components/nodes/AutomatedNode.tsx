import { Handle, Position } from "reactflow";

export default function AutomatedNode({ data }: any) {
  return (
    <div className="min-w-[170px] p-3 rounded-xl bg-indigo-50 border shadow-sm">
      <div className="flex items-center gap-2">
        <strong className="text-sm text-black">⚙️ Automated</strong>
      </div>
      <div className="mt-2 text-xs text-gray-700">{data.action}</div>
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  );
}
