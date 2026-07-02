export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={44} className="text-slate-200 mb-4" />}
      <p className="text-base font-semibold text-slate-600">{title}</p>
      {description && (
        <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
