"use client"

import { useEffect, useRef } from "react"
import "./timezone.css"
import { ThemeToggle } from "@/components/theme-toggle"

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
    let rafId: number | null = null

    const cities = [
      // North America
      { name: "New York", country: "USA", timezone: "America/New_York", lat: 40.7128, lng: -74.0060 },
      { name: "Los Angeles", country: "USA", timezone: "America/Los_Angeles", lat: 34.0522, lng: -118.2437 },
      { name: "Chicago", country: "USA", timezone: "America/Chicago", lat: 41.8781, lng: -87.6298 },
      { name: "Toronto", country: "Canada", timezone: "America/Toronto", lat: 43.6532, lng: -79.3832 },
      { name: "Vancouver", country: "Canada", timezone: "America/Vancouver", lat: 49.2827, lng: -123.1207 },
      { name: "Mexico City", country: "Mexico", timezone: "America/Mexico_City", lat: 19.4326, lng: -99.1332 },
      { name: "Montreal", country: "Canada", timezone: "America/Montreal", lat: 45.5017, lng: -73.5673 },
      { name: "San Francisco", country: "USA", timezone: "America/Los_Angeles", lat: 37.7749, lng: -122.4194 },
      { name: "Miami", country: "USA", timezone: "America/New_York", lat: 25.7617, lng: -80.1918 },
      { name: "Denver", country: "USA", timezone: "America/Denver", lat: 39.7392, lng: -104.9903 },
      { name: "Seattle", country: "USA", timezone: "America/Los_Angeles", lat: 47.6062, lng: -122.3321 },
      { name: "Boston", country: "USA", timezone: "America/New_York", lat: 42.3601, lng: -71.0589 },
      { name: "Phoenix", country: "USA", timezone: "America/Phoenix", lat: 33.4484, lng: -112.0740 },
      { name: "Dallas", country: "USA", timezone: "America/Chicago", lat: 32.7767, lng: -96.7970 },
      { name: "Atlanta", country: "USA", timezone: "America/New_York", lat: 33.7490, lng: -84.3880 },
      { name: "Honolulu", country: "USA", timezone: "Pacific/Honolulu", lat: 21.3099, lng: -157.8581 },
      { name: "Anchorage", country: "USA", timezone: "America/Anchorage", lat: 61.2181, lng: -149.9003 },
      // South America
      { name: "São Paulo", country: "Brazil", timezone: "America/Sao_Paulo", lat: -23.5505, lng: -46.6333 },
      { name: "Buenos Aires", country: "Argentina", timezone: "America/Argentina/Buenos_Aires", lat: -34.6037, lng: -58.3816 },
      { name: "Rio de Janeiro", country: "Brazil", timezone: "America/Sao_Paulo", lat: -22.9068, lng: -43.1729 },
      { name: "Lima", country: "Peru", timezone: "America/Lima", lat: -12.0464, lng: -77.0428 },
      { name: "Bogotá", country: "Colombia", timezone: "America/Bogota", lat: 4.7110, lng: -74.0721 },
      { name: "Santiago", country: "Chile", timezone: "America/Santiago", lat: -33.4489, lng: -70.6693 },
      { name: "Caracas", country: "Venezuela", timezone: "America/Caracas", lat: 10.4806, lng: -66.9036 },
      // Europe
      { name: "London", country: "UK", timezone: "Europe/London", lat: 51.5074, lng: -0.1278 },
      { name: "Paris", country: "France", timezone: "Europe/Paris", lat: 48.8566, lng: 2.3522 },
      { name: "Berlin", country: "Germany", timezone: "Europe/Berlin", lat: 52.5200, lng: 13.4050 },
      { name: "Madrid", country: "Spain", timezone: "Europe/Madrid", lat: 40.4168, lng: -3.7038 },
      { name: "Rome", country: "Italy", timezone: "Europe/Rome", lat: 41.9028, lng: 12.4964 },
      { name: "Amsterdam", country: "Netherlands", timezone: "Europe/Amsterdam", lat: 52.3676, lng: 4.9041 },
      { name: "Brussels", country: "Belgium", timezone: "Europe/Brussels", lat: 50.8503, lng: 4.3517 },
      { name: "Vienna", country: "Austria", timezone: "Europe/Vienna", lat: 48.2082, lng: 16.3738 },
      { name: "Prague", country: "Czechia", timezone: "Europe/Prague", lat: 50.0755, lng: 14.4378 },
      { name: "Warsaw", country: "Poland", timezone: "Europe/Warsaw", lat: 52.2297, lng: 21.0122 },
      { name: "Stockholm", country: "Sweden", timezone: "Europe/Stockholm", lat: 59.3293, lng: 18.0686 },
      { name: "Copenhagen", country: "Denmark", timezone: "Europe/Copenhagen", lat: 55.6761, lng: 12.5683 },
      { name: "Oslo", country: "Norway", timezone: "Europe/Oslo", lat: 59.9139, lng: 10.7522 },
      { name: "Helsinki", country: "Finland", timezone: "Europe/Helsinki", lat: 60.1695, lng: 24.9354 },
      { name: "Moscow", country: "Russia", timezone: "Europe/Moscow", lat: 55.7558, lng: 37.6173 },
      { name: "Istanbul", country: "Turkey", timezone: "Europe/Istanbul", lat: 41.0082, lng: 28.9784 },
      { name: "Athens", country: "Greece", timezone: "Europe/Athens", lat: 37.9838, lng: 23.7275 },
      { name: "Lisbon", country: "Portugal", timezone: "Europe/Lisbon", lat: 38.7223, lng: -9.1393 },
      { name: "Dublin", country: "Ireland", timezone: "Europe/Dublin", lat: 53.3498, lng: -6.2603 },
      { name: "Zurich", country: "Switzerland", timezone: "Europe/Zurich", lat: 47.3769, lng: 8.5417 },
      // Asia
      { name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", lat: 35.6762, lng: 139.6503 },
      { name: "Hong Kong", country: "Hong Kong", timezone: "Asia/Hong_Kong", lat: 22.3193, lng: 114.1694 },
      { name: "Singapore", country: "Singapore", timezone: "Asia/Singapore", lat: 1.3521, lng: 103.8198 },
      { name: "Dubai", country: "UAE", timezone: "Asia/Dubai", lat: 25.2048, lng: 55.2708 },
      { name: "Mumbai", country: "India", timezone: "Asia/Kolkata", lat: 19.0760, lng: 72.8777 },
      { name: "Shanghai", country: "China", timezone: "Asia/Shanghai", lat: 31.2304, lng: 121.4737 },
      { name: "Beijing", country: "China", timezone: "Asia/Shanghai", lat: 39.9042, lng: 116.4074 },
      { name: "Bangkok", country: "Thailand", timezone: "Asia/Bangkok", lat: 13.7563, lng: 100.5018 },
      { name: "Seoul", country: "South Korea", timezone: "Asia/Seoul", lat: 37.5665, lng: 126.9780 },
      { name: "Manila", country: "Philippines", timezone: "Asia/Manila", lat: 14.5995, lng: 120.9842 },
      { name: "Jakarta", country: "Indonesia", timezone: "Asia/Jakarta", lat: -6.2088, lng: 106.8456 },
      { name: "Kuala Lumpur", country: "Malaysia", timezone: "Asia/Kuala_Lumpur", lat: 3.1390, lng: 101.6869 },
      { name: "Delhi", country: "India", timezone: "Asia/Kolkata", lat: 28.7041, lng: 77.1025 },
      { name: "Bangalore", country: "India", timezone: "Asia/Kolkata", lat: 12.9716, lng: 77.5946 },
      { name: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", lat: 24.8607, lng: 67.0011 },
      { name: "Dhaka", country: "Bangladesh", timezone: "Asia/Dhaka", lat: 23.8103, lng: 90.4125 },
      { name: "Tehran", country: "Iran", timezone: "Asia/Tehran", lat: 35.6892, lng: 51.3890 },
      { name: "Ramallah", country: "Palestine", timezone: "Asia/Jerusalem", lat: 31.9038, lng: 35.2034 },
      { name: "Riyadh", country: "Saudi Arabia", timezone: "Asia/Riyadh", lat: 24.7136, lng: 46.6753 },
      { name: "Doha", country: "Qatar", timezone: "Asia/Qatar", lat: 25.2854, lng: 51.5310 },
      { name: "Abu Dhabi", country: "UAE", timezone: "Asia/Dubai", lat: 24.4539, lng: 54.3773 },
      { name: "Taipei", country: "Taiwan", timezone: "Asia/Taipei", lat: 25.0330, lng: 121.5654 },
      { name: "Hanoi", country: "Vietnam", timezone: "Asia/Ho_Chi_Minh", lat: 21.0285, lng: 105.8542 },
      // Africa
      { name: "Cairo", country: "Egypt", timezone: "Africa/Cairo", lat: 30.0444, lng: 31.2357 },
      { name: "Lagos", country: "Nigeria", timezone: "Africa/Lagos", lat: 6.5244, lng: 3.3792 },
      { name: "Johannesburg", country: "South Africa", timezone: "Africa/Johannesburg", lat: -26.2041, lng: 28.0473 },
      { name: "Nairobi", country: "Kenya", timezone: "Africa/Nairobi", lat: -1.2864, lng: 36.8172 },
      { name: "Casablanca", country: "Morocco", timezone: "Africa/Casablanca", lat: 33.5731, lng: -7.5898 },
      { name: "Accra", country: "Ghana", timezone: "Africa/Accra", lat: 5.6037, lng: -0.1870 },
      { name: "Algiers", country: "Algeria", timezone: "Africa/Algiers", lat: 36.7538, lng: 3.0588 },
      { name: "Tunis", country: "Tunisia", timezone: "Africa/Tunis", lat: 36.8065, lng: 10.1815 },
      // Oceania
      { name: "Sydney", country: "Australia", timezone: "Australia/Sydney", lat: -33.8688, lng: 151.2093 },
      { name: "Melbourne", country: "Australia", timezone: "Australia/Melbourne", lat: -37.8136, lng: 144.9631 },
      { name: "Brisbane", country: "Australia", timezone: "Australia/Brisbane", lat: -27.4698, lng: 153.0251 },
      { name: "Perth", country: "Australia", timezone: "Australia/Perth", lat: -31.9505, lng: 115.8605 },
      { name: "Auckland", country: "New Zealand", timezone: "Pacific/Auckland", lat: -36.8485, lng: 174.7633 },
      { name: "Wellington", country: "New Zealand", timezone: "Pacific/Auckland", lat: -41.2865, lng: 174.7762 },
      { name: "Fiji", country: "Fiji", timezone: "Pacific/Fiji", lat: -17.7134, lng: 178.0650 },
    ]

    // Calculate distance between two coordinates using Haversine formula
    function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
      const R = 6371 // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLng = (lng2 - lng1) * Math.PI / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }

    // Find nearest cities based on coordinates
    function findNearestCities(lat: number, lng: number, limit: number = 5) {
      return cities
        .map(city => ({
          ...city,
          distance: calculateDistance(lat, lng, city.lat, city.lng)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
    }

    // Simple geocoding fallback - tries to extract coordinates from common city searches
    function tryGeocodeSearch(searchQuery: string): { lat: number, lng: number } | null {
      // For Edinburgh, Scotland - hardcoded as example
      const knownCities: { [key: string]: { lat: number, lng: number } } = {
        "edinburgh": { lat: 55.9533, lng: -3.1883 },
        "glasgow": { lat: 55.8642, lng: -4.2518 },
        "manchester": { lat: 53.4808, lng: -2.2426 },
        "birmingham": { lat: 52.4862, lng: -1.8904 },
        "liverpool": { lat: 53.4084, lng: -2.9916 },
        "leeds": { lat: 53.8008, lng: -1.5491 },
        "bristol": { lat: 51.4545, lng: -2.5879 },
        "cardiff": { lat: 51.4816, lng: -3.1791 },
        "belfast": { lat: 54.5973, lng: -5.9301 },
      }

      const queryLower = searchQuery.toLowerCase()
      for (const [cityName, coords] of Object.entries(knownCities)) {
        if (queryLower.includes(cityName)) {
          return coords
        }
      }
      return null
    }

    const countryFlags: { [key: string]: string } = {
      "USA": "🇺🇸",
      "Canada": "🇨🇦",
      "Mexico": "🇲🇽",
      "Brazil": "🇧🇷",
      "Argentina": "🇦🇷",
      "Peru": "🇵🇪",
      "Colombia": "🇨🇴",
      "Chile": "🇨🇱",
      "Venezuela": "🇻🇪",
      "UK": "🇬🇧",
      "France": "🇫🇷",
      "Germany": "🇩🇪",
      "Spain": "🇪🇸",
      "Italy": "🇮🇹",
      "Netherlands": "🇳🇱",
      "Belgium": "🇧🇪",
      "Austria": "🇦🇹",
      "Czechia": "🇨🇿",
      "Poland": "🇵🇱",
      "Sweden": "🇸🇪",
      "Denmark": "🇩🇰",
      "Norway": "🇳🇴",
      "Finland": "🇫🇮",
      "Russia": "🇷🇺",
      "Turkey": "🇹🇷",
      "Greece": "🇬🇷",
      "Portugal": "🇵🇹",
      "Ireland": "🇮🇪",
      "Switzerland": "🇨🇭",
      "Japan": "🇯🇵",
      "Hong Kong": "🇭🇰",
      "Singapore": "🇸🇬",
      "UAE": "🇦🇪",
      "India": "🇮🇳",
      "China": "🇨🇳",
      "Thailand": "🇹🇭",
      "South Korea": "🇰🇷",
      "Philippines": "🇵🇭",
      "Indonesia": "🇮🇩",
      "Malaysia": "🇲🇾",
      "Pakistan": "🇵🇰",
      "Bangladesh": "🇧🇩",
      "Iran": "🇮🇷",
      "Palestine": "🇵🇸",
      "Saudi Arabia": "🇸🇦",
      "Qatar": "🇶🇦",
      "Taiwan": "🇹🇼",
      "Vietnam": "🇻🇳",
      "Egypt": "🇪🇬",
      "Nigeria": "🇳🇬",
      "South Africa": "🇿🇦",
      "Kenya": "🇰🇪",
      "Morocco": "🇲🇦",
      "Ghana": "🇬🇭",
      "Algeria": "🇩🇿",
      "Tunisia": "🇹🇳",
      "Australia": "🇦🇺",
      "New Zealand": "🇳🇿",
      "Fiji": "🇫🇯"
    }

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

    // Floating search functionality
    const floatingSearchInput = document.getElementById("floatingSearch") as HTMLInputElement
    const floatingSearchResults = document.getElementById("floatingSearchResults")

    function getTimezoneOffset(timezone: string): string {
      const now = new Date()
      const cityTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
      const localTime = new Date(now.toLocaleString("en-US", { timeZone: localTimezone }))
      const diffMs = cityTime.getTime() - localTime.getTime()
      const diffHours = Math.round(diffMs / (1000 * 60 * 60))
      return diffHours !== 0 ? `${diffHours >= 0 ? "+" : ""}${diffHours}` : "0"
    }

    function renderFloatingSearchResults(query: string) {
      if (!floatingSearchResults) return

      if (!query.trim()) {
        floatingSearchResults.innerHTML = ""
        floatingSearchResults.style.display = "none"
        return
      }

      const searchLower = query.toLowerCase()
      const filteredCities = cities.filter((city) => {
        const offset = getTimezoneOffset(city.timezone)
        return (
          city.name.toLowerCase().includes(searchLower) ||
          city.country.toLowerCase().includes(searchLower) ||
          offset.includes(searchLower) ||
          `+${offset}`.includes(searchLower) ||
          `${offset}h`.includes(searchLower) ||
          `+${offset}h`.includes(searchLower)
        )
      })

      // If no exact match, try to find nearest cities
      if (filteredCities.length === 0) {
        const coords = tryGeocodeSearch(query)
        if (coords) {
          const nearestCities = findNearestCities(coords.lat, coords.lng, 5)

          floatingSearchResults.innerHTML = '<div class="floating-search-no-results">No exact match. Showing nearest cities:</div>'

          nearestCities.forEach((cityWithDistance) => {
            const city = cityWithDistance
            const offset = getTimezoneOffset(city.timezone)
            const offsetDisplay = offset !== "0" ? `${offset >= "0" ? "+" : ""}${offset}h` : "Local"
            const cityKey = `${city.name}-${city.timezone}`
            const isAlreadySelected = selectedCities.has(cityKey)
            const flag = countryFlags[city.country] || "🏳️"
            const distanceKm = Math.round(cityWithDistance.distance)

            const resultItem = document.createElement("div")
            resultItem.className = `floating-search-result-item${isAlreadySelected ? " disabled" : ""}`
            resultItem.innerHTML = `
              <div class="floating-search-result-main">
                <div class="floating-search-result-name">${flag} ${city.name}, ${city.country} <span style="color: #999; font-size: 0.85em;">(~${distanceKm}km)</span></div>
                <div class="floating-search-result-timezone">${offsetDisplay}</div>
              </div>
              ${isAlreadySelected ? '<div class="floating-search-result-added">Added</div>' : ""}
            `

            if (!isAlreadySelected) {
              resultItem.addEventListener("click", () => {
                selectedCities.set(cityKey, city)
                saveSelectedCities()
                rebuildTimelines()
                floatingSearchInput.value = ""
                floatingSearchResults.innerHTML = ""
                floatingSearchResults.style.display = "none"
              })
            }

            floatingSearchResults.appendChild(resultItem)
          })

          floatingSearchResults.style.display = "block"
          return
        }

        floatingSearchResults.innerHTML = '<div class="floating-search-no-results">No cities found</div>'
        floatingSearchResults.style.display = "block"
        return
      }

      floatingSearchResults.innerHTML = ""
      const resultsToShow = filteredCities.slice(0, 10) // Limit to 10 results

      resultsToShow.forEach((city) => {
        const offset = getTimezoneOffset(city.timezone)
        const offsetDisplay = offset !== "0" ? `${offset >= "0" ? "+" : ""}${offset}h` : "Local"
        const cityKey = `${city.name}-${city.timezone}`
        const isAlreadySelected = selectedCities.has(cityKey)
        const flag = countryFlags[city.country] || "🏳️"

        const resultItem = document.createElement("div")
        resultItem.className = `floating-search-result-item${isAlreadySelected ? " disabled" : ""}`
        resultItem.innerHTML = `
          <div class="floating-search-result-main">
            <div class="floating-search-result-name">${flag} ${city.name}, ${city.country}</div>
            <div class="floating-search-result-timezone">${offsetDisplay}</div>
          </div>
          ${isAlreadySelected ? '<div class="floating-search-result-added">Added</div>' : ""}
        `

        if (!isAlreadySelected) {
          resultItem.addEventListener("click", () => {
            selectedCities.set(cityKey, city)
            saveSelectedCities()
            rebuildTimelines()
            floatingSearchInput.value = ""
            floatingSearchResults.innerHTML = ""
            floatingSearchResults.style.display = "none"
          })
        }

        floatingSearchResults.appendChild(resultItem)
      })

      floatingSearchResults.style.display = "block"
    }

    floatingSearchInput?.addEventListener("input", (e) => {
      const query = (e.target as HTMLInputElement).value
      renderFloatingSearchResults(query)
    })

    floatingSearchInput?.addEventListener("focus", (e) => {
      const query = (e.target as HTMLInputElement).value
      if (query.trim()) {
        renderFloatingSearchResults(query)
      }
    })

    // Close floating search results when clicking outside
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      if (!target.closest(".floating-search-wrapper")) {
        if (floatingSearchResults) {
          floatingSearchResults.style.display = "none"
        }
      }
    })

    // Toggle slide state when clicking on city card content
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      const cardContent = target.closest(".city-card-content") as HTMLElement

      // Don't toggle if clicking on dial wrapper (for dragging) or delete button
      if (target.closest(".dial-wrapper") || target.closest(".delete-button-hidden")) {
        return
      }

      // If clicking on a city card content
      if (cardContent) {
        // Close all other slid cards first
        document.querySelectorAll(".city-card-content.slid").forEach((el) => {
          if (el !== cardContent) {
            el.classList.remove("slid")
          }
        })

        // Toggle this card's slide state
        cardContent.classList.toggle("slid")
        return
      }

      // If clicking outside any card content, close all slid cards
      if (!target.closest(".city-card-slide-wrapper")) {
        document.querySelectorAll(".city-card-content.slid").forEach((el) => {
          el.classList.remove("slid")
        })
      }
    })

    // Handle delete button clicks (both old and new styles)
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      const deleteButton = target.closest(".delete-button, .delete-button-hidden") as HTMLElement

      if (deleteButton) {
        const cityKey = deleteButton.dataset.city
        if (cityKey) {
          selectedCities.delete(cityKey)
          saveSelectedCities()
          rebuildTimelines()
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

      const homeIcon = isLocal ? `🏠 ` : ""
      const timezoneLabel = offsetString ? `<span class="city-timezone">${offsetString}</span>` : ""

      // For local city, no slide wrapper needed
      if (isLocal) {
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
            </div>
          </div>
          <div class="dial-wrapper" data-dial="${city.timezone}">
            <div class="dial-track" data-track="${city.timezone}"></div>
            <div class="dial-indicator"></div>
          </div>
        `
      } else {
        // For non-local cities, add slide wrapper with hidden delete button
        container.innerHTML = `
          <div class="city-card-slide-wrapper">
            <div class="city-card-content">
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
                </div>
              </div>
              <div class="dial-wrapper" data-dial="${city.timezone}">
                <div class="dial-track" data-track="${city.timezone}"></div>
                <div class="dial-indicator"></div>
              </div>
            </div>
            <button class="delete-button-hidden" data-city="${city.name}-${city.timezone}" title="Remove city">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        `
      }
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
        hourLabel.style.fontSize = "1rem"
        const periodLabel = document.createElement("div")
        periodLabel.className = "hour-period"
        periodLabel.textContent = period
        hourSegment.appendChild(hourLabel)
        hourSegment.appendChild(periodLabel)

        const transitionIcon = getTransitionIcon(hour24)
        if (transitionIcon) {
          const iconContainer = document.createElement("div")
          iconContainer.innerHTML = transitionIcon
          hourSegment.appendChild(iconContainer.firstElementChild!)
        }

        // Optimized: Only create major minute markers (every 10 minutes) to reduce DOM nodes
        for (let minute = 10; minute < 30; minute += 10) {
          const marker = document.createElement("div")
          marker.className = "minute-marker major"
          marker.style.left = `${(minute / 30) * 100}%`
          hourSegment.appendChild(marker)
        }

        dialTrack.appendChild(hourSegment)

        const halfHourSegment = document.createElement("div")
        halfHourSegment.className = `hour-segment half-hour ${category}`
        const halfHourLabel = document.createElement("div")
        halfHourLabel.className = "hour-label"
        halfHourLabel.textContent = `${hour12}:30`
        halfHourLabel.style.fontSize = "1rem"
        const halfPeriodLabel = document.createElement("div")
        halfPeriodLabel.className = "hour-period"
        halfPeriodLabel.textContent = period
        halfPeriodLabel.style.fontSize = "0.65rem"
        halfHourSegment.appendChild(halfHourLabel)
        halfHourSegment.appendChild(halfPeriodLabel)

        // Optimized: Only create major minute markers (every 10 minutes) to reduce DOM nodes
        for (let minute = 10; minute < 30; minute += 10) {
          const marker = document.createElement("div")
          marker.className = "minute-marker major"
          marker.style.left = `${(minute / 30) * 100}%`
          halfHourSegment.appendChild(marker)
        }

        dialTrack.appendChild(halfHourSegment)
      }

      // Wait for DOM to settle before calculating positions
      setTimeout(() => {
        const firstSegment = dialTrack.querySelector(".hour-segment") as HTMLElement
        const segmentWidth = firstSegment?.offsetWidth || 100
        const centerSegmentIndex = 288
        const centerPosition = centerSegmentIndex * segmentWidth
        const minuteOffset = (cityMinutes / 60) * (segmentWidth * 2)
        const wrapperWidth = dialWrapper.offsetWidth
        const centerOffset = wrapperWidth / 2
        const finalPosition = centerPosition + minuteOffset - centerOffset

        dialTrack.style.transform = `translateX(-${finalPosition}px)`
        dialTrack.dataset.centerOffset = finalPosition.toString()
      }, 0)

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

      // Throttle using requestAnimationFrame for better performance
      if (rafId !== null) {
        return
      }

      const currentX = e.type === "mousemove" ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX

      rafId = requestAnimationFrame(() => {
        rafId = null

        const diff = currentX - dragStartX
        const newOffset = dragStartOffset + diff

        dialElements.forEach((dialWrapper) => {
          const dialTrack = dialWrapper.querySelector(".dial-track") as HTMLElement
          dialTrack.style.transform = `translateX(${newOffset}px)`
        })

        // Get actual segment width from the DOM to handle mobile responsive sizing
        const firstSegment = dialElements[0]?.querySelector(".hour-segment") as HTMLElement
        const segmentWidth = firstSegment?.offsetWidth || 100
        const wrapperWidth = dialElements[0]?.offsetWidth || 0
        const centerOfWrapper = wrapperWidth / 2

        const timezone = dialElements[0]?.dataset.dial
        const now = new Date()
        const cityTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
        const currentMinutes = cityTime.getMinutes()

        const centerSegmentIndex = 288
        const centerPosition = centerSegmentIndex * segmentWidth
        // More precise calculation: each segment represents 30 minutes
        const currentMinutesPixelOffset = (currentMinutes / 60) * (segmentWidth * 2)
        const actualCurrentPosition = centerPosition + currentMinutesPixelOffset

        const trackPositionAtIndicator = -newOffset + centerOfWrapper
        const pixelOffset = trackPositionAtIndicator - actualCurrentPosition
        // Each pair of segments represents 60 minutes
        const minuteDiff = (pixelOffset / (segmentWidth * 2)) * 60

        currentMinuteOffset = Math.round(minuteDiff)

        const pixelsPerMinute = (segmentWidth * 2) / 60
        const totalMinutesFromCenter = pixelOffset / pixelsPerMinute
        const currentMinute = Math.round(totalMinutesFromCenter)

        if (lastSnappedMinute !== null && lastSnappedMinute !== currentMinute) {
          playTickSound()
        }
        lastSnappedMinute = currentMinute

        updateAllTimes()
      })
    }

    function stopDrag() {
      if (isDragging) {
        isDragging = false
        // Cancel any pending animation frame
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
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

        // Get actual segment width from the DOM to handle mobile responsive sizing
        const firstSegment = dialTrack.querySelector(".hour-segment") as HTMLElement
        const segmentWidth = firstSegment?.offsetWidth || 100
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
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
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
            <ThemeToggle />
            <button className="icon-button" id="resetButton" title="Reset to Current Time">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="timeline-section" id="timelineSection"></div>
      </div>

      <div className="floating-search-container">
        <div className="floating-search-wrapper">
          <input
            type="text"
            id="floatingSearch"
            className="floating-search-input"
            placeholder="Quick add city (search by name, country, or timezone)..."
          />
          <div className="floating-search-results" id="floatingSearchResults"></div>
        </div>
      </div>

      <div className="overlay" id="overlay"></div>
    </>
  )
}
