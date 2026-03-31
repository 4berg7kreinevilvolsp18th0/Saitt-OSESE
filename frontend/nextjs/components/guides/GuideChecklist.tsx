export default function GuideChecklist({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 p-4 light:border-emerald-200 light:bg-emerald-50">
      <p className="font-semibold light:text-gray-900">{title}</p>
      <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-white/80 light:text-gray-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

