const StatCard = ({ label, value, change }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-3xl font-semibold text-slate-900">{value}</div>
        {change && (
          <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
