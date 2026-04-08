import { useState, useEffect } from "react";
import useWebsocket from "../hooks/useDashboardWs";
import DashboardHero from "../components/dashboard/DashboardHero";
import EventCard from "../components/dashboard/EventCard"
import SkeletonEvent from "../components/dashboard/SkeletonEvent";
import { calculateImpactLevel } from "../utility/calculateImpact";
import { IMPACT_STYLES } from "../utility/impactStyles"


export default function EventsDashboard() {
  const [event_info, setEventInfo] = useState({});
  const { loading } = useWebsocket((events) => setEventInfo(events));
  return (
    <div
      className="p-6 min-h-screen bg-[#090e14]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,200,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,180,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <title>Event Tracker: Dashboard</title>
      {loading ? (
        <SkeletonEvent />
      ) : (
        <div className="">
          <DashboardHero event_info={event_info} />

          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-teal-400 opacity-70 mb-6"></p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ml-4">
            {Object.values(event_info).map((value, index) => (
              <EventCard
                key={index}
                {...value}
                direct_indirect_items={value}
                IMPACT_STYLES={IMPACT_STYLES}
                calculateImpactLevel={calculateImpactLevel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
