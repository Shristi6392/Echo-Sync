const SectionCard = ({ title, children }) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-slate-900">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
};

export default SectionCard;
