import { Activity } from "lucide-react";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const MOCK_ACTIVITIES = [
  { id: 1, action: "Evidence Uploaded", detail: "Password Policy Document", time: new Date(Date.now() - 2 * 3600_000), type: "upload" },
  { id: 2, action: "Control Status Updated", detail: "Access Control Review marked In Progress", time: new Date(Date.now() - 18 * 3600_000), type: "update" },
  { id: 3, action: "Evidence Approved", detail: "Security Training Certificate", time: new Date(Date.now() - 2 * 86400_000), type: "approved" },
  { id: 4, action: "Framework Assigned", detail: "ISO 27001 assigned to your company", time: new Date(Date.now() - 5 * 86400_000), type: "framework" },
  { id: 5, action: "Control Completed", detail: "Data Encryption Policy", time: new Date(Date.now() - 7 * 86400_000), type: "completed" },
];

const TYPE_COLORS = {
  upload:    { dot: "bg-indigo-500", ring: "ring-indigo-100" },
  update:    { dot: "bg-amber-400",  ring: "ring-amber-100"  },
  approved:  { dot: "bg-green-500",  ring: "ring-green-100"  },
  framework: { dot: "bg-violet-500", ring: "ring-violet-100" },
  completed: { dot: "bg-blue-500",   ring: "ring-blue-100"   },
};

export default function RecentActivity({ controls, evidence }) {
  // Build real activity from data if available, else use mock
  let activities = MOCK_ACTIVITIES;

  const items = Array.isArray(controls) ? controls : controls?.data ?? [];
  if (items.length > 0) {
    activities = items
      .filter((c) => c.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 6)
      .map((c, i) => ({
        id: c.id ?? i,
        action: "Control Updated",
        detail: c.controlName || c.control?.name || c.name || "Unknown Control",
        time: new Date(c.updatedAt),
        type: c.status?.toLowerCase() === "completed" ? "completed" : "update",
      }));
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Activity size={18} className="text-indigo-500" />
        <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
      </div>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-100" />
        <div className="space-y-5 pl-9">
          {activities.map(({ id, action, detail, time, type }) => {
            const col = TYPE_COLORS[type] ?? TYPE_COLORS.update;
            const timeStr = time instanceof Date && !isNaN(time) ? timeAgo(time) : "recently";
            return (
              <div key={id} className="relative">
                {/* dot */}
                <span
                  className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full ${col.dot} ring-4 ${col.ring}`}
                />
                <p className="text-sm font-medium text-slate-800">{action}</p>
                <p className="text-xs text-slate-500 mt-0.5">{detail}</p>
                <p className="text-xs text-slate-400 mt-1">{timeStr}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
