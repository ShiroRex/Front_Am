import type { LucideIcon } from "lucide-react"

interface ParamCardProps {
  icon: LucideIcon
  title: string
  value: string
  iconClass: string
}

const ParamCard = ({ icon: Icon, title, value, iconClass }: ParamCardProps) => {
  return (
    <div className="param-card">
      <div className={`param-icon ${iconClass}`}>
        <Icon size={24} />
      </div>
      <div className="param-content">
        <h4>{title}</h4>
        <div className="param-value">{value}</div>
      </div>
    </div>
  )
}

export default ParamCard

