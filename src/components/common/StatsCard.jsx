function StatsCard({ stat, Icon }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 hover:shadow-md transition group">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {stat.label}
          </span>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
          {stat.change && (
            <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
              {stat.change}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsCard