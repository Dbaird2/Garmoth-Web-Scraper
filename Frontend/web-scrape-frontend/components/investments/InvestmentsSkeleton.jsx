export default function InvestmentsSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: "#0d1520" }}>
      <div className="max-w-[1100px] mx-auto px-6 py-10 animate-pulse">

        <div className="mb-8 pb-6 border-b border-[#1a2a3a]">
          <div className="h-9 w-48 bg-[#1a2a3a] rounded mb-2" />
          <div className="h-3 w-72 bg-[#1a2a3a] rounded" />
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0f1a26] border border-[#1a2a3a] rounded-lg p-4">
              <div className="h-2.5 w-20 bg-[#1a2a3a] rounded-full mb-3" />
              <div className="h-6 w-28 bg-[#1a2a3a] rounded-full" />
            </div>
          ))}
        </div>

        <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5 mb-5">
          <div className="h-2.5 w-32 bg-[#1a2a3a] rounded-full mb-5" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-2 w-16 bg-[#1a2a3a] rounded-full" />
                <div className="h-8 bg-[#1a2a3a] rounded" />
              </div>
            ))}
            <div className="col-span-2 flex flex-col gap-2">
              <div className="h-2 w-16 bg-[#1a2a3a] rounded-full" />
              <div className="h-14 bg-[#1a2a3a] rounded" />
            </div>
          </div>
          <div className="h-9 bg-[#1a2a3a] rounded mt-4" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5">
            <div className="h-2.5 w-36 bg-[#1a2a3a] rounded-full mb-5" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 mb-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-2.5 bg-[#1a2a3a] rounded-full" />
                ))}
              </div>
            ))}
          </div>

          <div className="bg-[#0f1a26] border border-[#1a2a3a] rounded-xl p-5">
            <div className="flex justify-between items-center mb-5">
              <div className="h-2.5 w-28 bg-[#1a2a3a] rounded-full" />
              <div className="flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 w-8 bg-[#1a2a3a] rounded" />
                ))}
              </div>
            </div>
            <div className="flex items-end gap-1 h-40">
              {[60, 80, 50, 90, 70, 85, 65, 75].map((h, i) => (
                <div key={i} className="flex-1 bg-[#1a2a3a] rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2 w-16 bg-[#1a2a3a] rounded-full" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}