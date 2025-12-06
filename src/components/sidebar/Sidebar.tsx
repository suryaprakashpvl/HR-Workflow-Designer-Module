import React from "react";

const ITEMS = [
  { type: "start", label: "Start Node" },
  { type: "task", label: "Task Node" },
  { type: "approval", label: "Approval Node" },
  { type: "automated", label: "Automated Step" },
  { type: "end", label: "End Node" },
];

export default function Sidebar({ onQuickAdd }: { onQuickAdd?: (type: string) => void }) {
  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-full text-white flex flex-col gap-6">

      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold tracking-wide mb-2">Nodes</h3>
        <div className="h-px bg-gray-500" />
      </div>

      {/* Node Drag List */}
      <div className="flex flex-col gap-1">
        {ITEMS.map((it) => (
          <div
            key={it.type}
            draggable
            onDragStart={(e) => onDragStart(e, it.type)}
            className="
              p-2 bg-blue-600 hover:bg-blue-700 
              rounded-lg shadow-md 
              cursor-grab active:cursor-grabbing 
              text-sm font-medium transition-all
              border border-blue-500/30
            "
            title={`Drag ${it.label} to canvas`}
          >
            {it.label}
          </div>
        ))}
      </div>

      {/* Quick Add Section */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-300">Quick Add</h4>

        <div className="flex flex-wrap gap-2">
          {ITEMS.map((it) => (
            <button
              key={it.type}
              onClick={() => onQuickAdd?.(it.type)}
              className="
                px-3 py-1.5 
                rounded-full 
                bg-blue-600 hover:bg-blue-700 
                text-white text-xs font-medium 
                border border-blue-500/30
                shadow-sm
                transition-all
              "
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}
