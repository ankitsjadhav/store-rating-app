const StatsCards = ({ statCards }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    {statCards.map((stat, index) => (
      <div
        key={index}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between"
      >
        <div>
          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div className={`p-3 rounded-lg text-2xl ${stat.colorClass}`}>
          {stat.icon}
        </div>
      </div>
    ))}
  </div>
);

export default StatsCards;
