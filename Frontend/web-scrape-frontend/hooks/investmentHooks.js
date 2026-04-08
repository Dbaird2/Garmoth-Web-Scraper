// hooks/useInvestments.js
export function useInvestments(positions, selected, chart_data, range) {
  console.log('useInvestments', positions, selected)
  const total_invested = positions.reduce((s, p) => s + p.buyPrice * p.qty, 0);
  const total_val = positions.reduce((s, p) => s + p.currentPrice * p.qty, 0);
  const total_pnl = (total_val - total_invested) * 0.855;
  const total_pnl_pct = ((total_pnl / total_invested) * 100).toFixed(1);
  
  const chart_data_select = chart_data[selected?.item] || [];
  const buy_line = chart_data_select.map((d) => ({
    ...d,
    buy: selected.buyPrice,
  }));
  const range_slice = { "7d": 7, "14d": 14, "30d": 30, "60d": 60 }[range];
  const sliced_data = buy_line.reverse().slice(-range_slice);
  
  console.log(total_invested, total_val, sliced_data);
  return { total_invested, total_val, total_pnl, total_pnl_pct, sliced_data };
}
