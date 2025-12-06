import { Handle, Position } from "reactflow";

type Props = {
  data: any;
};

export default function StartNode({ data }: Props) {
  return (
    <div className="min-w-[160px] p-3 rounded-2xl shadow-md bg-gradient-to-br from-green-400 to-green-600 text-white">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-white/90" />
        <strong className="text-sm">Start</strong>
      </div>
      <div className="mt-2 text-xs">{data.label}</div>

      {/* only source handle - start only outputs */}
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  );
}
