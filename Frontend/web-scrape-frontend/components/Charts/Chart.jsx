import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function Chart({ data, x_axis, line }) {
  return (
    <div className="w-sm h-32 md:w-64 md:h-64 lg:w-110 lg:h-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          style={{
            aspectRatio: 1.618,
            maxWidth: 800,
            margin: "auto",
          }}
          data={data}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey={x_axis} stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={line}
            stroke="#2dd4bf"
            dot={{ fill: "blue" }}
            activeDot={{
              stroke: "green",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default Chart;
