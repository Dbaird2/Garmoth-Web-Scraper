export default function SkeletonGrid() {
  const numbers = Array.from({ length: 10 }, (e, i) => i);
  return (
    <>
      <div className=" p-4 mx-auto h-[90dvh] overflow-auto">
        <div className="relative">
          {numbers.map((num) => (
            <div className="animate-pulse bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col gap-2">
              <div className="h-4 w-2/3 bg-slate-600 rounded" />
              <div className="h-px bg-slate-700" />
              <div className="flex justify-between">
                <div className="h-3 w-12 bg-slate-600 rounded" />
                <div className="h-3 w-16 bg-slate-600 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-10 bg-slate-600 rounded" />
                <div className="h-3 w-20 bg-slate-600 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-11 bg-slate-600 rounded" />
                <div className="h-3 w-14 bg-slate-600 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-slate-600 rounded" />
                <div className="h-3 w-12 bg-slate-600 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-slate-600 rounded" />
                <div className="h-3 w-16 bg-slate-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
