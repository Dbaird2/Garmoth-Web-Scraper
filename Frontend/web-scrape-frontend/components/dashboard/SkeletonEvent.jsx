export default function SkeletonEvent() {
  const numbers = Array.from({ length: 4 }, (e, i) => i);

  return (
    <>
      <div className="animate-pulse bg-[#0d1520] border border-[#1a2a3a] border-t-2 border-t-slate-600 p-5 flex flex-col gap-4">
        {/* Title area */}
        <div className="flex justify-between items-start gap-3">
          <div className="h-4 w-1/2 bg-[#1a2a3a] rounded" />
          <div className="h-3 w-16 bg-[#1a2a3a] rounded" />
        </div>

        <div className="h-px bg-[#1a2a3a]" />

        {/* List items */}
        <div>
          <div className="h-3 w-24 bg-[#1a2a3a] rounded mb-3" />
          <ul className="flex flex-col gap-1.5">
            {numbers.map((num) => (
              <li
                key={num}
                className="px-2.5 py-1.5 bg-[#0a1018] border-l-2 border-[#1a2a3a]"
              >
                <div
                  className="h-3 bg-[#1a2a3a] rounded"
                  style={{ width: `${60 + (num % 3) * 15}%` }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
