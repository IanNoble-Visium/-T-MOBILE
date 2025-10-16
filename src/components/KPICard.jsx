import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon,
  variant = 'default'
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }
  
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500'
    if (trend === 'down') return 'text-red-500'
    return 'text-gray-500'
  }
  
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'gradient-tmobile'
      case 'secondary':
        return 'gradient-trucontext'
      case 'success':
        return 'bg-green-500/10 border-green-500/20'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'danger':
        return 'bg-red-500/10 border-red-500/20'
      default:
        return 'bg-card'
    }
  }
  
  return (
    <div className={`rounded-lg border border-border p-6 transition-all hover:shadow-lg hover:scale-105 ${getVariantClass()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg ${variant === 'default' ? 'bg-primary/10' : 'bg-white/10'}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {trendValue && (
        <div className={`flex items-center gap-1 mt-4 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="font-medium">{trendValue}</span>
          <span className="text-muted-foreground ml-1">vs last period</span>
        </div>
      )}
    </div>
  )
}

export default KPICard

