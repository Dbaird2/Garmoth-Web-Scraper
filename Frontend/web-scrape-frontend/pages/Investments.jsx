import { useState, useCallback } from "react";
import InvestmentHeader from "../components/investments/InvestmentHeader";
import InvestmentMetrics from "../components/investments/InvestmentMetrics";
import PositionsTable from "../components/investments/PositionsTable";
import AddInvestmentForm from "../components/investments/AddInvestmentForm";
import PriceChart from "../components/investments/PriceChart";
import useWebsocket from "../hooks/useInvestmentWs";
import CustomTooltip from "../components/investments/CustomTooltip";
import { useInvestments } from "../hooks/investmentHooks";
import { useInvestmentActions } from "../hooks/useInvestmentActions";
import { formatSilver } from "../utility/formatSilver";

const IMPACT_STYLES = {
  "Very High": "border-red-900 bg-red-950 text-red-400",
  High: "border-red-900 bg-red-950 text-red-400",
  Medium: "border-amber-900 bg-amber-950 text-amber-400",
  Low: "border-green-900 bg-green-950 text-green-400",
  None: "border-gray-700 bg-gray-900 text-gray-500",
};

export default function Investments() {
  const [positions, setPositions] = useState([]);
  const [selected, setSelected] = useState({});
  const [chart_data, setChartData] = useState({});

  const setData = useCallback((data) => {
    console.log("data", data);
    if (!data?.positions || !data?.chart_data) return;
    setPositions(data.positions);
    setChartData(data.chart_data);
    setSelected(data.positions[0]);
  }, []);

  const token = localStorage.getItem("jwt");

  const { loading, sendMessage } = useWebsocket(setData, token);

  const [range, setRange] = useState("60d");
  const { form, setForm, handleDelete, handleSubmit } = useInvestmentActions(
    sendMessage,
    positions,
    setPositions,
    selected,
    setSelected,
  );
  const { total_invested, total_val, total_pnl, total_pnl_pct, sliced_data } =
    useInvestments(positions, selected, chart_data, range);

  return (
    <div
      className="min-h-screen text-[#c8d8e8]"
      style={{ background: "#0d1520", fontFamily: "'DM Mono', monospace" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Header */}
        <InvestmentHeader />

        {/* Metrics */}
        <InvestmentMetrics
          total_invested={total_invested}
          total_val={total_val}
          total_pnl={total_pnl}
          positions={positions}
          formatSilver={formatSilver}
        />

        {/* Add position form */}
        <AddInvestmentForm
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
        />
        {/* Table + Chart */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Positions table */}
          <PositionsTable
            positions={positions}
            formatSilver={formatSilver}
            handleDelete={handleDelete}
            setSelected={setSelected}
            selected={selected}
            IMPACT_STYLES={IMPACT_STYLES}
          />

          {/* Chart */}
          <PriceChart
            selected={selected}
            range={range}
            setRange={setRange}
            sliced_data={sliced_data}
            formatSilver={formatSilver}
            CustomTooltip={CustomTooltip}
          />
        </div>
      </div>
    </div>
  );
}
