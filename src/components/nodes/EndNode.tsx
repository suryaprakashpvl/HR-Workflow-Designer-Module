import { Handle, Position } from "reactflow";

export default function EndNode({ data }: any) {
  return (
    <div className="min-w-[140px] p-3 rounded-2xl text-white bg-gradient-to-br from-gray-600 to-gray-800 shadow">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-white/90" />
        <strong>End</strong>
      </div>
      <div className="mt-2 text-xs">{data.label}</div>
      <Handle type="target" position={Position.Top} id="in" />
    </div>
  );
}
