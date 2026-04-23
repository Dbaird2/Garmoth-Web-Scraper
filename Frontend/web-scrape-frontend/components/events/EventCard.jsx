import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import EventsModal from "./EventsModal";
import { FadeIn } from "../../hooks/FadeIn";


export default function EventCard({
  event,
  impact,
  start_date,
  end_date,
  direct_indirect_items,
  IMPACT_STYLES,
  calculateImpactLevel,
}) {
  const style = IMPACT_STYLES[impact] ?? IMPACT_STYLES.Unknown;

  return (
    <div
      className={`bg-[#0d1520] rounded-xl border border-[#1a2a3a] border-t-2 ${style.border} p-5 flex flex-col gap-4 max-h-[45rem] overflowy-auto`}
    >
      <FadeIn delay={50}>
        <div className="flex justify-between items-start gap-3">
          <span className="font-bold text-[#e8f0f8] text-sm leading-snug tracking-wide">
            {event}
          </span>
          <span
            className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border shrink-0 ${style.badge}`}
          >
            {impact}
          </span>
        </div>

        <span className="font-mono text-[11px] text-[#4a6070]">
          {start_date} <span className="text-[#2a3a4a]">→</span> {end_date}
        </span>

        <div className="h-px bg-gradient-to-r from-[#1a2a3a] to-transparent" />
      </FadeIn>
      <div>
        <Tabs>
          <FadeIn delay={100}>
            <TabList className="flex flex-row gap-4 p-4">
              <Tab
                className="hover:scale-105 hover:text-yellow-400/70 font-mono text-[10px] uppercase tracking-widest text-[#4a6070] px-3 py-1.5 rounded-sm cursor-pointer transition-all duration-200 outline-none"
                selectedClassName="hover:scale-105 bg-[#0d1520] text-teal-400 border border-[#1a2a3a]"
              >
                Affect Items
              </Tab>

              <Tab
                className="hover:scale-105 hover:text-yellow-400/70 font-mono text-[10px] uppercase tracking-widest text-[#4a6070] px-3 py-1.5 rounded-sm cursor-pointer transition-all duration-200 outline-none"
                selectedClassName="hover:scale-105 bg-[#0d1520] text-teal-400 border border-[#1a2a3a]"
              >
                Indirectly Affect
              </Tab>
            </TabList>
          </FadeIn>
          <FadeIn delay={200}>
            <TabPanel>
              <ul className="flex flex-col max-h-[28rem]  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[#0d1520] [&::-webkit-scrollbar-thumb]:bg-teal-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-teal-400 overflow-auto gap-1.5">
                {(direct_indirect_items?.direct_items?.items ?? []).map(
                  (item) => {
                    return (
                      <li
                        key={item.name ?? "Error"}
                        className="flex flex-row justify-between text-[13px] text-[#8aa8b8] px-2.5 py-1.5 bg-[#0a1018] border-l-2 border-[#1a2a3a] hover:border-teal-400 hover:text-[#c8d8e8] transition-colors"
                      >
                        <div>
                          <EventItemModal item={item} />
                        </div>
                        <div className="flex gap-4 text-gray-400 text-[10px]">
                          <span>Impact</span>
                          <div
                            className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border shrink-0 ${IMPACT_STYLES[item.impact].badge}`}
                          >
                            {item.pct_diff?.toFixed(2) ?? 0.0}
                          </div>
                        </div>
                      </li>
                    );
                  },
                )}
              </ul>
            </TabPanel>
            <TabPanel>
              <ul className="flex flex-col max-h-[28rem]  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[#0d1520] [&::-webkit-scrollbar-thumb]:bg-teal-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-teal-400 overflow-auto gap-1.5">
                {(direct_indirect_items?.indirect_items?.items ?? []).map(
                  (item) => {
                    const impact = calculateImpactLevel(
                      item?.pct_diff?.toFixed(2),
                    );
                    return (
                      <li
                        key={item.item}
                        className="flex flex-row justify-between text-[13px] text-[#8aa8b8] px-2.5 py-1.5 bg-[#0a1018] border-l-2 border-[#1a2a3a] hover:border-teal-400 hover:text-[#c8d8e8] transition-colors"
                      >
                        <div>
                          <DashbaordItemModal item={item} />
                        </div>
                        <div className="flex gap-4 text-gray-400 text-[10px]">
                          <span>Impact</span>
                          <div
                            className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border shrink-0 ${IMPACT_STYLES[impact].badge}`}
                          >
                            {item.pct_diff?.toFixed(2) ?? 0.0}
                          </div>
                        </div>
                      </li>
                    );
                  },
                )}
              </ul>
            </TabPanel>
          </FadeIn>
        </Tabs>
      </div>
    </div>
  );
}
