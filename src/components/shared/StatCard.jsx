export default function StatCard({ icon: Icon, label, value, color = 'cyan', trend }) {
  const colorMap = {
    cyan: { text: 'text-cyber-accent', bg: 'bg-cyber-accent/10', border: 'border-cyber-accent/20' },
    green: { text: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/20' },
    red: { text: 'text-cyber-red', bg: 'bg-cyber-red/10', border: 'border-cyber-red/20' },
    yellow: { text: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', border: 'border-cyber-yellow/20' },
    purple: { text: 'text-cyber-purple', bg: 'bg-cyber-purple/10', border: 'border-cyber-purple/20' },
  }

  const c = colorMap[color] || colorMap.cyan

  return (
    <div className="cyber-card p-5 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-cyber-muted text-xs font-mono uppercase tracking-wider mb-2">{label}</p>
          <p className="stat-number">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-mono ${trend > 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last week
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
            <Icon size={20} className={c.text} />
          </div>
        )}
      </div>
    </div>
  )
}