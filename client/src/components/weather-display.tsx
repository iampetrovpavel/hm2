import { Cloud, CloudDrizzle, CloudRain, CloudSnow, Sun, CloudSun } from "lucide-react"

interface WeatherDisplayProps {
  temperature: number
  condition: string
  icon?: string
  className?: string
  showLabel?: boolean
}

export function WeatherDisplay({ 
  temperature, 
  condition, 
  icon, 
  className = "", 
  showLabel = true 
}: WeatherDisplayProps) {
  const getWeatherIcon = () => {
    // If an icon name is explicitly provided, use that
    if (icon) {
      switch (icon.toLowerCase()) {
        case "sun":
          return <Sun className="h-5 w-5 text-yellow-500" />
        case "cloud-sun":
          return <CloudSun className="h-5 w-5 text-gray-500" />
        case "cloud":
          return <Cloud className="h-5 w-5 text-gray-500" />
        case "cloud-rain":
          return <CloudRain className="h-5 w-5 text-blue-500" />
        case "cloud-drizzle":
          return <CloudDrizzle className="h-5 w-5 text-blue-400" />
        case "cloud-snow":
          return <CloudSnow className="h-5 w-5 text-blue-200" />
        default:
          return <Cloud className="h-5 w-5 text-gray-400" />
      }
    }
    
    // Otherwise, derive icon from condition
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "partly cloudy":
        return <CloudSun className="h-5 w-5 text-gray-500" />
      case "cloudy":
        return <Cloud className="h-5 w-5 text-gray-500" />
      case "rain":
      case "rainy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      case "drizzle":
        return <CloudDrizzle className="h-5 w-5 text-blue-400" />
      case "snow":
      case "snowy":
        return <CloudSnow className="h-5 w-5 text-blue-200" />
      default:
        return <Cloud className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {getWeatherIcon()}
      {showLabel && (
        <span className="text-sm">
          {temperature}°F, {condition}
        </span>
      )}
    </div>
  )
}

export default WeatherDisplay
