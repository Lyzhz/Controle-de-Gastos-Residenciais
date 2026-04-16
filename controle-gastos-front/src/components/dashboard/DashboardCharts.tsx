import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  data?: unknown[];
};

export default function DashboardCharts({ data = [] }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
      <h3 className="text-sm text-gray-500 mb-4">Gastos por pessoa</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="nome" />
          <Tooltip />
          <Bar dataKey="totalDespesas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}