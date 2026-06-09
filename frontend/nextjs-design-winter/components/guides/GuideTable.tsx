type GuideTableProps = {
  headers: string[];
  rows: string[][];
};

export default function GuideTable({ headers, rows }: GuideTableProps) {
  return (
    <div className="rounded-xl border border-white/10 light:border-gray-200">
      <div className="max-h-[380px] overflow-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-white/10 light:bg-gray-100">
            <tr>
              {headers.map((header) => (
                <th key={header} className="sticky top-0 z-10 bg-inherit px-3 py-2 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row.join('-')}`} className="border-t border-white/10 light:border-gray-200">
                {row.map((cell) => (
                  <td key={cell} className="px-3 py-2 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-3 py-2 text-xs text-white/60 light:text-gray-500">
        На мобильных доступен горизонтальный скролл.
      </p>
    </div>
  );
}

