import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export function Chart({ data, y_axis_1, y_axis_2, x_axis }) {
  const mockData = [
    { month: "Jan", sales: 150, change: 50 },
    { month: "Feb", sales: 200, change: 150},
    { month: "Mar", sales: 180, change: 200},
    { month: "Apr", sales: 220, change: 100},
    { month: "May", sales: 170, change: 150},
    { month: "Jun", sales: 240, change: 70},
    { month: "Jul", sales: 210, change: 120},
    { month: "Aug", sales: 260, change: 110},
    { month: "Sep", sales: 230, change: 130},
    { month: "Oct", sales: 270, change: 150},
    { month: "Nov", sales: 250, change: 120},
    { month: "Dec", sales: 300, change: 110},
  ];
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
          {/* Left Y-axis */}
          <YAxis yAxisId="left" stroke="#94a3b8" />

          {/* Right Y-axis */}
          <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            yAxisId="left"
            dataKey={y_axis_1}
            stroke="#2dd4bf"
            dot={{ fill: "blue" }}
            activeDot={{
              stroke: "green",
            }}
          />
          <Line
            type="monotone"
            yAxisId="right"
            dataKey={y_axis_2}
            stroke="#d4542d"
            dot={{ fill: "red" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default Chart;
