"use client"

import { useEffect, useRef } from "react"
import "./timezone.css"

export default function RemoteTimezonePage() {
  const initializedRef = useRef(false)

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializedRef.current) return
    initializedRef.current = true

    // Use vanilla JS variables (not React state) - same as HTML version
    let currentMinuteOffset = 0
    let isDragging = false
    let dragStartX = 0
    let dragStartOffset = 0
    let autoUpdate = true
    let dialElements: HTMLElement[] = []
    let lastSnappedMinute: number | null = null

    const cities = [
      // North America
      { name: "New York", timezone: "America/New_York" },
      { name: "Los Angeles", timezone: "America/Los_Angeles" },
      { name: "Chicago", timezone: "America/Chicago" },
      { name: "Toronto", timezone: "America/Toronto" },
      { name: "Vancouver", timezone: "America/Vancouver" },
      { name: "Mexico City", timezone: "America/Mexico_City" },
      { name: "Montreal", timezone: "America/Montreal" },
      { name: "San Francisco", timezone: "America/Los_Angeles" },
      { name: "Miami", timezone: "America/New_York" },
      { name: "Denver", timezone: "America/Denver" },
      { name: "Seattle", timezone: "America/Los_Angeles" },
      { name: "Boston", timezone: "America/New_York" },
      { name: "Phoenix", timezone: "America/Phoenix" },
      { name: "Dallas", timezone: "America/Chicago" },
      { name: "Atlanta", timezone: "America/New_York" },
      { name: "Honolulu", timezone: "Pacific/Honolulu" },
      { name: "Anchorage", timezone: "America/Anchorage" },
      // South America
      { name: "São Paulo", timezone: "America/Sao_Paulo" },
      { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires" },
      { name: "Rio de Janeiro", timezone: "America/Sao_Paulo" },
      { name: "Lima", timezone: "America/Lima" },
      { name: "Bogotá", timezone: "America/Bogota" },
      { name: "Santiago", timezone: "America/Santiago" },
      { name: "Caracas", timezone: "America/Caracas" },
      // Europe
      { name: "London", timezone: "Europe/London" },
      { name: "Paris", timezone: "Europe/Paris" },
      { name: "Berlin", timezone: "Europe/Berlin" },
      { name: "Madrid", timezone: "Europe/Madrid" },
      { name: "Rome", timezone: "Europe/Rome" },
      { name: "Amsterdam", timezone: "Europe/Amsterdam" },
      { name: "Brussels", timezone: "Europe/Brussels" },
      { name: "Vienna", timezone: "Europe/Vienna" },
      { name: "Prague", timezone: "Europe/Prague" },
      { name: "Warsaw", timezone: "Europe/Warsaw" },
      { name: "Stockholm", timezone: "Europe/Stockholm" },
      { name: "Copenhagen", timezone: "Europe/Copenhagen" },
      { name: "Oslo", timezone: "Europe/Oslo" },
      { name: "Helsinki", timezone: "Europe/Helsinki" },
      { name: "Moscow", timezone: "Europe/Moscow" },
      { name: "Istanbul", timezone: "Europe/Istanbul" },
      { name: "Athens", timezone: "Europe/Athens" },
      { name: "Lisbon", timezone: "Europe/Lisbon" },
      { name: "Dublin", timezone: "Europe/Dublin" },
      { name: "Zurich", timezone: "Europe/Zurich" },
      // Asia
      { name: "Tokyo", timezone: "Asia/Tokyo" },
      { name: "Hong Kong", timezone: "Asia/Hong_Kong" },
      { name: "Singapore", timezone: "Asia/Singapore" },
      { name: "Dubai", timezone: "Asia/Dubai" },
      { name: "Mumbai", timezone: "Asia/Kolkata" },
      { name: "Shanghai", timezone: "Asia/Shanghai" },
      { name: "Beijing", timezone: "Asia/Shanghai" },
      { name: "Bangkok", timezone: "Asia/Bangkok" },
      { name: "Seoul", timezone: "Asia/Seoul" },
      { name: "Manila", timezone: "Asia/Manila" },
      { name: "Jakarta", timezone: "Asia/Jakarta" },
      { name: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur" },
      { name: "Delhi", timezone: "Asia/Kolkata" },
      { name: "Bangalore", timezone: "Asia/Kolkata" },
      { name: "Karachi", timezone: "Asia/Karachi" },
      { name: "Dhaka", timezone: "Asia/Dhaka" },
      { name: "Tehran", timezone: "Asia/Tehran" },
      { name: "Tel Aviv", timezone: "Asia/Jerusalem" },
      { name: "Riyadh", timezone: "Asia/Riyadh" },
      { name: "Doha", timezone: "Asia/Qatar" },
      { name: "Abu Dhabi", timezone: "Asia/Dubai" },
      { name: "Taipei", timezone: "Asia/Taipei" },
      { name: "Hanoi", timezone: "Asia/Ho_Chi_Minh" },
      // Africa
      { name: "Cairo", timezone: "Africa/Cairo" },
      { name: "Lagos", timezone: "Africa/Lagos" },
      { name: "Johannesburg", timezone: "Africa/Johannesburg" },
      { name: "Nairobi", timezone: "Africa/Nairobi" },
      { name: "Casablanca", timezone: "Africa/Casablanca" },
      { name: "Accra", timezone: "Africa/Accra" },
      { name: "Algiers", timezone: "Africa/Algiers" },
      { name: "Tunis", timezone: "Africa/Tunis" },
      // Oceania
      { name: "Sydney", timezone: "Australia/Sydney" },
      { name: "Melbourne", timezone: "Australia/Melbourne" },
      { name: "Brisbane", timezone: "Australia/Brisbane" },
      { name: "Perth", timezone: "Australia/Perth" },
      { name: "Auckland", timezone: "Pacific/Auckland" },
      { name: "Wellington", timezone: "Pacific/Auckland" },
      { name: "Fiji", timezone: "Pacific/Fiji" },
    ]

    let selectedCities = new Map()
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    function playTickSound() {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 800
      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.05)
    }

    function playSnapSound() {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 1200
      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.08)
    }

    function loadSelectedCities() {
      try {
        const saved = localStorage.getItem("selectedTimezones")
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            selectedCities = new Map()
            parsed.forEach((city: any) => {
              if (typeof city === "object" && city.name && city.timezone) {
                selectedCities.set(`${city.name}-${city.timezone}`, city)
              }
            })
          }
        }
      } catch (e) {
        selectedCities = new Map()
      }
    }

    function saveSelectedCities() {
      try {
        localStorage.setItem("selectedTimezones", JSON.stringify(Array.from(selectedCities.values())))
      } catch (e) {}
    }

    loadSelectedCities()

    const addCityButton = document.getElementById("addCityButton")
    const sidePanel = document.getElementById("sidePanel")
    const closePanel = document.getElementById("closePanel")
    const overlay = document.getElementById("overlay")
    const container = document.querySelector(".container")

    addCityButton?.addEventListener("click", () => {
      sidePanel?.classList.add("open")
      overlay?.classList.add("active")
      container?.classList.add("panel-open")
      renderCityList()
    })

    closePanel?.addEventListener("click", () => {
      sidePanel?.classList.remove("open")
      overlay?.classList.remove("active")
      container?.classList.remove("panel-open")
    })

    overlay?.addEventListener("click", () => {
      sidePanel?.classList.remove("open")
      overlay?.classList.remove("active")
      container?.classList.remove("panel-open")
    })

    function renderCityList() {
      const cityList = document.getElementById("cityList")
      if (!cityList) return
      cityList.innerHTML = ""

      cities.forEach((city) => {
        const cityKey = `${city.name}-${city.timezone}`
        const isSelected = selectedCities.has(cityKey)
        const item = document.createElement("div")
        item.className = `city-list-item${isSelected ? " selected" : ""}`
        item.innerHTML = `
          <div class="city-list-item-name">${city.name}</div>
          <div class="checkmark">
            <svg viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        `
        item.addEventListener("click", () => {
          if (selectedCities.has(cityKey)) {
            selectedCities.delete(cityKey)
          } else {
            selectedCities.set(cityKey, city)
          }
          saveSelectedCities()
          renderCityList()
          rebuildTimelines()
        })
        cityList.appendChild(item)
      })
    }

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      if (target.closest(".delete-button")) {
        const button = target.closest(".delete-button") as HTMLElement
        const cityKey = button.dataset.city
        if (cityKey) {
          selectedCities.delete(cityKey)
          saveSelectedCities()
          rebuildTimelines()
          renderCityList()
        }
      }
    })

    function getTimeCategory(hours: number) {
      if (hours >= 6 && hours < 12) return "morning"
      if (hours >= 12 && hours < 18) return "day"
      if (hours >= 18 && hours < 22) return "evening"
      return "night"
    }

    function getTransitionIcon(hour24: number) {
      if (hour24 === 6) {
        return `<div class="transition-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#FDB813" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div>`
      } else if (hour24 === 12) {
        return `<div class="transition-icon"><svg viewBox="0 0 24 24" fill="#FDB813" stroke="#FDB813" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div>`
      } else if (hour24 === 18) {
        return `<div class="transition-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div>`
      } else if (hour24 === 22) {
        return `<div class="transition-icon"><svg viewBox="0 0 24 24" fill="#E8E8E8" stroke="#E8E8E8" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>`
      } else if (hour24 === 0) {
        return `<div class="transition-icon"><svg viewBox="0 0 24 24" fill="#C0C0C0" stroke="#C0C0C0" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>`
      }
      return null
    }

    function createCityDial(city: any, isLocal: boolean) {
      const container = document.createElement("div")
      container.className = `city-dial-container${isLocal ? " local" : ""}`
      container.dataset.timezone = city.timezone

      const now = new Date()
      const cityTime = new Date(now.toLocaleString("en-US", { timeZone: city.timezone }))
      const localTime = new Date(now.toLocaleString("en-US", { timeZone: localTimezone }))
      const diffMs = cityTime.getTime() - localTime.getTime()
      const diffHours = Math.round(diffMs / (1000 * 60 * 60))
      const cityDay = cityTime.getDate()
      const localDay = localTime.getDate()
      const dayDiff = cityDay - localDay

      let offsetString = ""
      if (!isLocal) {
        if (dayDiff > 0) {
          offsetString = `Tomorrow, ${diffHours >= 0 ? "+" : ""}${diffHours}h`
        } else if (dayDiff < 0) {
          offsetString = `Yesterday, ${diffHours >= 0 ? "+" : ""}${diffHours}h`
        } else {
          offsetString = `${diffHours >= 0 ? "+" : ""}${diffHours}h`
        }
      }

      const deleteButton = isLocal ? "" : `<button class="delete-button" data-city="${city.name}-${city.timezone}" title="Remove city"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>`
      const homeIcon = isLocal ? `🏠 ` : ""
      const timezoneLabel = offsetString ? `<span class="city-timezone">${offsetString}</span>` : ""

      container.innerHTML = `
        <div class="city-header">
          <div>
            <div>
              ${homeIcon}<span class="city-name">${city.name}</span>
            </div>
            ${timezoneLabel}
          </div>
          <div class="city-header-right">
            <div class="city-current-time">
              <div class="time-display" data-time="${city.timezone}" data-city-name="${city.name}">--:--</div>
              <div class="local-time-label" data-local-time="${city.timezone}" data-city-name="${city.name}"></div>
            </div>
            ${deleteButton}
          </div>
        </div>
        <div class="dial-wrapper" data-dial="${city.timezone}">
          <div class="dial-track" data-track="${city.timezone}"></div>
          <div class="dial-indicator"></div>
        </div>
      `
      return container
    }

    function initializeDial(dialWrapper: HTMLElement, timezone: string) {
      const dialTrack = dialWrapper.querySelector(`[data-track="${timezone}"]`) as HTMLElement
      if (!dialTrack) return

      dialTrack.innerHTML = ""

      const now = new Date()
      const adjustedTime = new Date(now.getTime() + currentMinuteOffset * 60 * 1000)
      const cityTime = new Date(adjustedTime.toLocaleString("en-US", { timeZone: timezone }))
      const cityHour = cityTime.getHours()
      const cityMinutes = cityTime.getMinutes()

      for (let hourOffset = -144; hourOffset <= 144; hourOffset++) {
        const hour24 = (cityHour + hourOffset + 2400) % 24
        const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
        const period = hour24 < 12 ? "AM" : "PM"
        const category = getTimeCategory(hour24)

        const hourSegment = document.createElement("div")
        hourSegment.className = `hour-segment ${category}`
        const hourLabel = document.createElement("div")
        hourLabel.className = "hour-label"
        hourLabel.textContent = hour12.toString()
        hourLabel.style.color = "#333"
        hourLabel.style.fontSize = "1rem"
        const periodLabel = document.createElement("div")
        periodLabel.className = "hour-period"
        periodLabel.textContent = period
        periodLabel.style.color = "#999"
        hourSegment.appendChild(hourLabel)
        hourSegment.appendChild(periodLabel)

        const transitionIcon = getTransitionIcon(hour24)
        if (transitionIcon) {
          const iconContainer = document.createElement("div")
          iconContainer.innerHTML = transitionIcon
          hourSegment.appendChild(iconContainer.firstElementChild!)
        }

        for (let minute = 1; minute < 30; minute++) {
          const marker = document.createElement("div")
          marker.className = minute % 10 === 0 ? "minute-marker major" : "minute-marker"
          marker.style.left = `${(minute / 30) * 100}%`
          hourSegment.appendChild(marker)
        }

        dialTrack.appendChild(hourSegment)

        const halfHourSegment = document.createElement("div")
        halfHourSegment.className = `hour-segment half-hour ${category}`
        const halfHourLabel = document.createElement("div")
        halfHourLabel.className = "hour-label"
        halfHourLabel.textContent = `${hour12}:30`
        halfHourLabel.style.color = "#333"
        halfHourLabel.style.fontSize = "1rem"
        const halfPeriodLabel = document.createElement("div")
        halfPeriodLabel.className = "hour-period"
        halfPeriodLabel.textContent = period
        halfPeriodLabel.style.color = "#999"
        halfPeriodLabel.style.fontSize = "0.65rem"
        halfHourSegment.appendChild(halfHourLabel)
        halfHourSegment.appendChild(halfPeriodLabel)

        for (let minute = 1; minute < 30; minute++) {
          const marker = document.createElement("div")
          marker.className = minute % 10 === 0 ? "minute-marker major" : "minute-marker"
          marker.style.left = `${(minute / 30) * 100}%`
          halfHourSegment.appendChild(marker)
        }

        dialTrack.appendChild(halfHourSegment)
      }

      const segmentWidth = 100
      const centerSegmentIndex = 288
      const centerPosition = centerSegmentIndex * segmentWidth
      const minuteOffset = (cityMinutes / 60) * (segmentWidth * 2)
      const wrapperWidth = dialWrapper.offsetWidth
      const centerOffset = wrapperWidth / 2
      const finalPosition = centerPosition + minuteOffset - centerOffset

      dialTrack.style.transform = `translateX(-${finalPosition}px)`
      dialTrack.dataset.centerOffset = finalPosition.toString()

      setupDialDrag(dialWrapper)
    }

    function setupDialDrag(dialWrapper: HTMLElement) {
      dialWrapper.addEventListener("mousedown", startDrag)
      dialWrapper.addEventListener("touchstart", startDrag)
    }

    function startDrag(e: MouseEvent | TouchEvent) {
      isDragging = true
      autoUpdate = false
      dragStartX = e.type === "mousedown" ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX

      const dialWrapper = e.currentTarget as HTMLElement
      const dialTrack = dialWrapper.querySelector(".dial-track") as HTMLElement
      const transform = dialTrack.style.transform
      const match = transform.match(/translateX\(([^)]+)px\)/)
      dragStartOffset = match ? Number.parseFloat(match[1]) : 0

      dialWrapper.style.cursor = "grabbing"
    }

    function drag(e: MouseEvent | TouchEvent) {
      if (!isDragging) return

      const currentX = e.type === "mousemove" ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX
      const diff = currentX - dragStartX
      const newOffset = dragStartOffset + diff

      dialElements.forEach((dialWrapper) => {
        const dialTrack = dialWrapper.querySelector(".dial-track") as HTMLElement
        dialTrack.style.transform = `translateX(${newOffset}px)`
      })

      const segmentWidth = 100
      const wrapperWidth = dialElements[0]?.offsetWidth || 0
      const centerOfWrapper = wrapperWidth / 2

      const timezone = dialElements[0]?.dataset.dial
      const now = new Date()
      const cityTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
      const currentMinutes = cityTime.getMinutes()

      const centerSegmentIndex = 288
      const centerPosition = centerSegmentIndex * segmentWidth
      const currentMinutesPixelOffset = (currentMinutes / 60) * 200
      const actualCurrentPosition = centerPosition + currentMinutesPixelOffset

      const trackPositionAtIndicator = -newOffset + centerOfWrapper
      const pixelOffset = trackPositionAtIndicator - actualCurrentPosition
      const minuteDiff = (pixelOffset / 200) * 60

      currentMinuteOffset = Math.round(minuteDiff)

      const pixelsPerMinute = segmentWidth / 30
      const totalMinutesFromCenter = pixelOffset / pixelsPerMinute
      const currentMinute = Math.round(totalMinutesFromCenter)

      if (lastSnappedMinute !== null && lastSnappedMinute !== currentMinute) {
        playTickSound()
      }
      lastSnappedMinute = currentMinute

      updateAllTimes()
    }

    function stopDrag() {
      if (isDragging) {
        isDragging = false
        dialElements.forEach((dialWrapper) => {
          dialWrapper.style.cursor = "grab"
        })

        playSnapSound()
        lastSnappedMinute = null
        // Critical: autoUpdate stays false, dial stays where dragged
      }
    }

    document.addEventListener("mousemove", drag)
    document.addEventListener("touchmove", drag)
    document.addEventListener("mouseup", stopDrag)
    document.addEventListener("touchend", stopDrag)

    function resetToCurrentTime() {
      currentMinuteOffset = 0
      autoUpdate = true
      updateDialPositions()
    }

    document.getElementById("resetButton")?.addEventListener("click", resetToCurrentTime)

    function updateDialPositions() {
      if (isDragging || dialElements.length === 0 || !autoUpdate) return

      dialElements.forEach((dialWrapper) => {
        const dialTrack = dialWrapper.querySelector(".dial-track") as HTMLElement
        const timezone = dialWrapper.dataset.dial
        if (!timezone) return

        const now = new Date()
        const adjustedTime = new Date(now.getTime() + currentMinuteOffset * 60 * 1000)
        const cityTime = new Date(adjustedTime.toLocaleString("en-US", { timeZone: timezone }))
        const cityMinutes = cityTime.getMinutes()

        const segmentWidth = 100
        const centerSegmentIndex = 288
        const centerPosition = centerSegmentIndex * segmentWidth
        const minuteOffset = (cityMinutes / 60) * (segmentWidth * 2)
        const wrapperWidth = dialWrapper.offsetWidth
        const centerOffset = wrapperWidth / 2
        const finalPosition = centerPosition + minuteOffset - centerOffset

        dialTrack.style.transform = `translateX(-${finalPosition}px)`
      })
    }

    function updateAllTimes() {
      const now = new Date()
      const adjustedTime = new Date(now.getTime() + currentMinuteOffset * 60 * 1000)

      const localCityName =
        cities.find((c) => c.timezone === localTimezone)?.name || localTimezone.split("/").pop()?.replace(/_/g, " ")
      const localCity = { name: localCityName, timezone: localTimezone }
      const allCities = [localCity, ...Array.from(selectedCities.values())]

      allCities.forEach((city) => {
        const cityTime = new Date(adjustedTime.toLocaleString("en-US", { timeZone: city.timezone }))
        const timeElements = document.querySelectorAll(`[data-time="${city.timezone}"][data-city-name="${city.name}"]`)

        timeElements.forEach((timeElement) => {
          timeElement.textContent = cityTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        })

        const localTimeElements = document.querySelectorAll(
          `[data-local-time="${city.timezone}"][data-city-name="${city.name}"]`,
        )

        if (currentMinuteOffset !== 0) {
          const actualLocalTime = new Date(now.toLocaleString("en-US", { timeZone: city.timezone }))
          localTimeElements.forEach((localTimeElement) => {
            localTimeElement.textContent =
              "Local: " +
              actualLocalTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
          })
        } else {
          localTimeElements.forEach((localTimeElement) => {
            localTimeElement.textContent = ""
          })
        }
      })
    }

    function rebuildTimelines() {
      const timelineSection = document.getElementById("timelineSection")
      if (!timelineSection) return

      timelineSection.innerHTML = ""
      dialElements = []

      const localCityName =
        cities.find((c) => c.timezone === localTimezone)?.name || localTimezone.split("/").pop()?.replace(/_/g, " ")

      const localCity = { name: localCityName, timezone: localTimezone }
      const allCities = [localCity, ...Array.from(selectedCities.values())]

      allCities.forEach((city) => {
        const isLocal = city.timezone === localTimezone
        const cityDial = createCityDial(city, isLocal)
        timelineSection.appendChild(cityDial)

        const dialWrapper = cityDial.querySelector(`[data-dial="${city.timezone}"]`) as HTMLElement
        dialElements.push(dialWrapper)
        initializeDial(dialWrapper, city.timezone)
      })

      setTimeout(() => {
        if (dialElements[0]?.offsetWidth) {
          updateDialPositions()
          updateAllTimes()
        }
      }, 100)
    }

    const updateInterval = setInterval(() => {
      updateDialPositions()
      updateAllTimes()
    }, 1000)

    window.addEventListener("resize", updateDialPositions)

    rebuildTimelines()

    return () => {
      clearInterval(updateInterval)
      document.removeEventListener("mousemove", drag)
      document.removeEventListener("touchmove", drag)
      document.removeEventListener("mouseup", stopDrag)
      document.removeEventListener("touchend", stopDrag)
    }
  }, [])

  return (
    <>
      <div className="container">
        <div className="header-bar">
          <h1 className="font-serif tracking-normal font-semibold text-xl leading-6">☀️ Remote Timezone</h1>
          <div className="header-buttons">
            <button className="icon-button" id="resetButton" title="Reset to Current Time">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </button>
            <button className="icon-button add-button" id="addCityButton" title="Add City">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="timeline-section" id="timelineSection"></div>
      </div>

      <div className="side-panel" id="sidePanel">
        <div className="side-panel-header">
          <h2>Select Cities</h2>
          <button className="close-button" id="closePanel">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="side-panel-body">
          <div className="city-list" id="cityList"></div>
        </div>
      </div>

      <div className="overlay" id="overlay"></div>
    </>
  )
}
