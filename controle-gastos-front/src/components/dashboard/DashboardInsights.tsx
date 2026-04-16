export default function DashboardInsights() {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
      <h3 className="text-sm text-gray-500 mb-3">Insights (Exemplos)</h3>

      <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
        <li> Maior gasto do mês: João</li>
        <li> Despesas aumentaram 12%</li>
        <li> Dica: reduzir alimentação fora</li>
      </ul>
    </div>
  );
}