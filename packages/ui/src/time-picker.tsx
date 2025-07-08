import * as React from "react"
import { Clock } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { cn } from "./lib/utils"
import { Button } from "./button"

interface TimePickerProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({ value, onValueChange, placeholder = "Select time", className }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<string>("")
  const [selectedMinute, setSelectedMinute] = React.useState<string>("")
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("")

  // Parse initial value
  React.useEffect(() => {
    if (value) {
      const [time, period] = value.split(' ')
      if (time && period) {
        const [hour = "", minute = ""] = time.split(':')
        setSelectedHour(hour)
        setSelectedMinute(minute)
        setSelectedPeriod(period)
      } else {
        // Handle 24-hour format
        const [hour = "", minute = ""] = value.split(':')
        const hourNum = parseInt(hour)
        const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
        const period = hourNum >= 12 ? 'PM' : 'AM'
        
        setSelectedHour(displayHour.toString().padStart(2, '0'))
        setSelectedMinute(minute)
        setSelectedPeriod(period)
      }
    }
  }, [value])

  // Update parent when time changes
  React.useEffect(() => {
    if (selectedHour && selectedMinute && selectedPeriod) {
      let hour24 = parseInt(selectedHour)
      if (selectedPeriod === 'AM' && hour24 === 12) {
        hour24 = 0
      } else if (selectedPeriod === 'PM' && hour24 !== 12) {
        hour24 += 12
      }
      
      const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute}`
      onValueChange?.(timeString)
    }
  }, [selectedHour, selectedMinute, selectedPeriod, onValueChange])

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1
    return { value: hour.toString().padStart(2, '0'), label: hour.toString() }
  })

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: i.toString().padStart(2, '0')
  }))

  const periods = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
  ]

  const displayValue = selectedHour && selectedMinute && selectedPeriod
    ? `${selectedHour}:${selectedMinute} ${selectedPeriod}`
    : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-background",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="bg-popover border rounded-lg shadow-lg p-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Hours Selector */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-medium text-muted-foreground mb-2">Hours</label>
              <div className="h-32 w-16 overflow-y-auto border rounded-md bg-background">
                {hours.map((hour) => (
                  <button
                    key={hour.value}
                    className={cn(
                      "w-full h-8 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                      selectedHour === hour.value && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setSelectedHour(hour.value)}
                  >
                    {hour.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xl font-bold text-muted-foreground">:</div>

            {/* Minutes Selector */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-medium text-muted-foreground mb-2">Minutes</label>
              <div className="h-32 w-16 overflow-y-auto border rounded-md bg-background">
                {minutes.map((minute) => (
                  <button
                    key={minute.value}
                    className={cn(
                      "w-full h-8 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                      selectedMinute === minute.value && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setSelectedMinute(minute.value)}
                  >
                    {minute.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM Selector */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-medium text-muted-foreground mb-2">Period</label>
              <div className="flex flex-col gap-1">
                {periods.map((period) => (
                  <button
                    key={period.value}
                    className={cn(
                      "w-12 h-8 text-sm border rounded hover:bg-accent hover:text-accent-foreground transition-colors",
                      selectedPeriod === period.value && "bg-primary text-primary-foreground border-primary"
                    )}
                    onClick={() => setSelectedPeriod(period.value)}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Time Options */}
          <div className="mt-4 pt-3 border-t">
            <div className="text-xs font-medium text-muted-foreground mb-2">Quick Select</div>
            <div className="grid grid-cols-3 gap-1">
              {['09:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map((time) => (
                <button
                  key={time}
                  className="text-xs px-2 py-1 rounded border hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => {
                    const [timeStr, period] = time.split(' ')
                    if (!timeStr || !period) return
                    const [hour = "", minute = ""] = timeStr.split(':')
                    setSelectedHour(hour)
                    setSelectedMinute(minute)
                    setSelectedPeriod(period)
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}