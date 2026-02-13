import { getWeatherIconUrl, isTomorrowMidnight, type HourlyWeather } from '@/entities/weather'
import { cn, useDragScroll } from '@/shared'

interface HourlyForecastScrollProps {
  hourly: HourlyWeather[]
  timestamp: number
}

/**
 * 시간대별 날씨를 표시하는 슬라이드 컴포넌트
 */
export const HourlyForecastScroll = ({ hourly, timestamp }: HourlyForecastScrollProps) => {
  const { scrollRef, isDragging, handlers } = useDragScroll()

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex overflow-x-auto pb-4 pt-1 px-1 -mx-1 gap-2 scrollbar-hide select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      {...handlers}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {hourly.map((hour) => {
        const showTomorrowLabel = isTomorrowMidnight(hour.time, timestamp)

        return (
          <div key={hour.time} className="relative pt-3 flex-shrink-0 w-[18%] min-w-[70px]">
            {showTomorrowLabel && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] bg-white/20 px-1.5 rounded-full text-white font-medium whitespace-nowrap z-10 border border-white/10 shadow-sm">
                내일
              </span>
            )}
            <div className="text-center bg-white/10 rounded p-1.5 sm:p-2">
              <p className="text-[10px] sm:text-xs opacity-80 truncate">{hour.timeText}</p>
              <img
                src={getWeatherIconUrl(hour.icon, '1x')}
                alt={hour.description}
                className="w-6 h-6 sm:w-8 sm:h-8 mx-auto my-0.5 sm:my-1 pointer-events-none"
              />
              <p className="text-xs sm:text-sm font-semibold truncate">{hour.temp}°</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
