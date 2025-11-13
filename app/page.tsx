"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import "./timezone.css"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { Sidebar } from "@/components/sidebar"

// Move static data outside component to prevent recreation on every render
const CITIES = [
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
    ] as const

const COUNTRY_FLAGS: { [key: string]: string } = {
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
} as const

export default function RemoteTimezonePage() {
  const initializedRef = useRef(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Memoize callbacks to prevent unnecessary re-renders
  const handleSidebarOpen = useCallback(() => setIsSidebarOpen(true), [])
  const handleSidebarClose = useCallback(() => setIsSidebarOpen(false), [])

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
      return CITIES
        .map(city => ({
          ...city,
          distance: calculateDistance(lat, lng, city.lat, city.lng)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
    }

    // Geocoding using OpenStreetMap Nominatim API - fetch multiple results
    async function geocodeLocation(searchQuery: string): Promise<Array<{ lat: number, lng: number, displayName: string }>> {
      // If not in hardcoded list, try geocoding API
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=50&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'RemoteTimezoneApp/1.0'
            }
          }
        )

        if (!response.ok) {
          return []
        }

        const data = await response.json()

        if (data && data.length > 0) {
          // Use a permissive approach: exclude bad stuff rather than whitelist
          // This allows cities/towns with various OSM classifications to appear
          const filteredData = data.filter((item: any) => {
            const type = item.type?.toLowerCase() || ''
            const itemClass = item.class?.toLowerCase() || ''
            const displayName = item.display_name?.toLowerCase() || ''

            // EXCLUDE: Any result with postal codes (all formats)
            // Catches numeric (94614, 21519) and alphanumeric (G83 0PB, M1 1AA, etc.)
            const postalCodePattern = /\b\d{5,6}\b|\b[a-z]\d{1,2}\s*\d[a-z]{2}\b|\b[a-z]{1,2}\d{1,2}[a-z]?\s*\d[a-z]{2}\b/i
            if (postalCodePattern.test(displayName)) {
              return false
            }

            // EXCLUDE: Airports and specific facilities
            const facilityKeywords = ['airport', 'international airport', 'parkway', 'boulevard', 'avenue', 'street', 'road']
            if (facilityKeywords.some(keyword => displayName.includes(keyword))) {
              return false
            }

            // Exclude very specific locations with too many commas (overly detailed addresses)
            const commaCount = (displayName.match(/,/g) || []).length
            if (commaCount > 5) {
              return false
            }

            // KEY FILTER: Exclude administrative subdivisions by checking display name
            // This catches "Ward 105", "Metropolitan Municipality", etc.
            const excludedKeywords = [
              'ward ', ' ward,', ' ward ',
              'municipality,', 'metropolitan municipality',
              'administrative',
              'township,',
              'subdivision'
            ]
            if (excludedKeywords.some(keyword => displayName.includes(keyword))) {
              return false
            }

            // Exclude non-geographic places (businesses, buildings, amenities)
            const excludedClasses = ['tourism', 'amenity', 'shop', 'leisure', 'building', 'highway', 'aeroway']
            if (excludedClasses.includes(itemClass)) {
              return false
            }

            // Exclude very small locations (hamlets, isolated dwellings, farms)
            const excludedSmallTypes = ['hamlet', 'isolated_dwelling', 'farm', 'locality']
            if (excludedSmallTypes.includes(type)) {
              return false
            }

            // Include place and boundary classes (these contain cities, states, countries)
            if (itemClass === 'place' || itemClass === 'boundary') {
              return true
            }

            // If we can't determine the class, be permissive and allow it
            return true
          })

          // Smart sorting: prioritize results where city name starts with search query
          // This ensures "alex" shows "Alexandria" before "Alexanderplatz"
          const sortedData = filteredData.sort((a: any, b: any) => {
            // Get the first part of display name (the city/location name)
            const nameA = (a.display_name?.split(',')[0] || '').toLowerCase().trim()
            const nameB = (b.display_name?.split(',')[0] || '').toLowerCase().trim()
            const queryLower = searchQuery.toLowerCase().trim()

            // Check if names start with the search query
            const aStartsWith = nameA.startsWith(queryLower)
            const bStartsWith = nameB.startsWith(queryLower)

            // Prioritize results that start with query
            if (aStartsWith && !bStartsWith) return -1
            if (!aStartsWith && bStartsWith) return 1

            // If both start with query (or neither do), sort by importance
            const importanceA = parseFloat(a.importance || 0)
            const importanceB = parseFloat(b.importance || 0)
            return importanceB - importanceA
          })

          // Deduplicate similar results (e.g., "Alexandria, 21519, Egypt" vs "Alexandria, Egypt")
          // Remove postal codes and compare normalized names
          const deduplicatedData: any[] = []
          const seenLocations = new Set<string>()

          for (const item of sortedData) {
            // Normalize by removing postal codes (typically 3-6 digit numbers) and extra spaces
            const normalized = item.display_name
              .replace(/,\s*\d{3,6}\s*,/g, ',') // Remove postal codes between commas
              .replace(/,\s+/g, ', ') // Normalize spacing
              .toLowerCase()
              .trim()

            if (!seenLocations.has(normalized)) {
              seenLocations.add(normalized)
              deduplicatedData.push(item)
            }
          }

          // Return top 8 unique results for better autocomplete experience
          return deduplicatedData.slice(0, 8).map((item: any) => ({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            displayName: item.display_name
          }))
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      }

      return []
    }

    let selectedCities = new Map()
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Reuse AudioContext or create new one
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const audioContext = audioContextRef.current

    // Helper function to correctly get time components in a specific timezone
    function getTimeInTimezone(date: Date, timezone: string) {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      const parts = formatter.formatToParts(date)
      const getValue = (type: string) => parts.find(p => p.type === type)?.value || '0'

      return {
        year: parseInt(getValue('year')),
        month: parseInt(getValue('month')) - 1,
        day: parseInt(getValue('day')),
        hour: parseInt(getValue('hour')),
        minute: parseInt(getValue('minute')),
        second: parseInt(getValue('second'))
      }
    }

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
      const cityTimeParts = getTimeInTimezone(now, timezone)
      const localTimeParts = getTimeInTimezone(now, localTimezone)

      // Create dates in UTC to compare
      const cityTime = Date.UTC(cityTimeParts.year, cityTimeParts.month, cityTimeParts.day,
                                 cityTimeParts.hour, cityTimeParts.minute, cityTimeParts.second)
      const localTime = Date.UTC(localTimeParts.year, localTimeParts.month, localTimeParts.day,
                                  localTimeParts.hour, localTimeParts.minute, localTimeParts.second)

      const diffMs = cityTime - localTime
      const diffHours = Math.round(diffMs / (1000 * 60 * 60))
      return diffHours !== 0 ? `${diffHours >= 0 ? "+" : ""}${diffHours}` : "0"
    }

    function showNearestCities(lat: number, lng: number, locationName: string) {
      if (!floatingSearchResults) return

      // Show loading indicator while calculating
      floatingSearchResults.innerHTML = `
        <div class="floating-search-no-results" style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 16px; height: 16px; border: 2px solid #ddd; border-top-color: #666; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          Finding nearest cities...
        </div>
      `

      // Use setTimeout to ensure loading state is visible
      setTimeout(() => {
        const nearestCities = findNearestCities(lat, lng, 5)

        floatingSearchResults.innerHTML = `<div class="floating-search-no-results">Showing nearest cities to ${locationName}:</div>`

        nearestCities.forEach((cityWithDistance) => {
          const city = cityWithDistance
          const offset = getTimezoneOffset(city.timezone)
          const offsetDisplay = offset !== "0" ? `${offset >= "0" ? "+" : ""}${offset}h` : "Local"
          const cityKey = `${city.name}-${city.timezone}`
          const isAlreadySelected = selectedCities.has(cityKey) || city.timezone === localTimezone
          const flag = COUNTRY_FLAGS[city.country] || "🏳️"
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
            resultItem.addEventListener("click", (e) => {
              e.stopPropagation()
              // Prepend new city (newest first) by creating new Map with new city first
              const newSelectedCities = new Map()
              newSelectedCities.set(cityKey, city)
              selectedCities.forEach((value, key) => {
                newSelectedCities.set(key, value)
              })
              selectedCities = newSelectedCities
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
      }, 100)
    }

    async function renderFloatingSearchResults(query: string) {
      if (!floatingSearchResults) return

      const searchLower = query.toLowerCase().trim()

      // If query is empty, show all cities
      const filteredCities = searchLower
        ? CITIES.filter((city) => {
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
        : CITIES // Show all cities when query is empty

      // If no exact match, show location suggestions from geocoding
      if (filteredCities.length === 0 && searchLower.length >= 3) {
        // Show loading state with spinner
        floatingSearchResults.innerHTML = `
          <div class="floating-search-no-results" style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 16px; height: 16px; border: 2px solid #ddd; border-top-color: #666; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            Searching for location...
          </div>
          <style>
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        `
        floatingSearchResults.style.display = "block"

        const locations = await geocodeLocation(query)
        if (locations.length > 0) {
          floatingSearchResults.innerHTML = '<div class="floating-search-no-results">Select a location:</div>'

          locations.forEach((location) => {
            const resultItem = document.createElement("div")
            resultItem.className = "floating-search-result-item"
            resultItem.style.cursor = "pointer"
            resultItem.innerHTML = `
              <div class="floating-search-result-main" style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                <div class="floating-search-result-name">📍 ${location.displayName}</div>
                <div style="color: #999; font-size: 1.2em; margin-left: 8px;">›</div>
              </div>
            `

            resultItem.addEventListener("click", (e) => {
              e.stopPropagation()
              // Show nearest cities to this location
              showNearestCities(location.lat, location.lng, location.displayName)
            })

            floatingSearchResults.appendChild(resultItem)
          })

          floatingSearchResults.style.display = "block"
          return
        }

        floatingSearchResults.innerHTML = '<div class="floating-search-no-results">No locations found</div>'
        floatingSearchResults.style.display = "block"
        return
      }

      if (filteredCities.length === 0) {
        floatingSearchResults.innerHTML = '<div class="floating-search-no-results">Type at least 3 characters to search</div>'
        floatingSearchResults.style.display = "block"
        return
      }

      floatingSearchResults.innerHTML = ""
      // Show all cities when no search query, limit to 10 when searching
      const resultsToShow = searchLower ? filteredCities.slice(0, 10) : filteredCities

      resultsToShow.forEach((city) => {
        const offset = getTimezoneOffset(city.timezone)
        const offsetDisplay = offset !== "0" ? `${offset >= "0" ? "+" : ""}${offset}h` : "Local"
        const cityKey = `${city.name}-${city.timezone}`
        const isAlreadySelected = selectedCities.has(cityKey) || city.timezone === localTimezone
        const flag = COUNTRY_FLAGS[city.country] || "🏳️"

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
          resultItem.addEventListener("click", (e) => {
            e.stopPropagation()
            // Prepend new city (newest first) by creating new Map with new city first
            const newSelectedCities = new Map()
            newSelectedCities.set(cityKey, city)
            selectedCities.forEach((value, key) => {
              newSelectedCities.set(key, value)
            })
            selectedCities = newSelectedCities
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

    // Throttle search input to reduce DOM operations
    let searchTimeout: NodeJS.Timeout | null = null
    floatingSearchInput?.addEventListener("input", (e) => {
      const query = (e.target as HTMLInputElement).value
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      searchTimeout = setTimeout(() => {
        renderFloatingSearchResults(query)
        searchTimeout = null
      }, 150) // 150ms debounce
    })

    floatingSearchInput?.addEventListener("focus", (e) => {
      const query = (e.target as HTMLInputElement).value
      // Always show results on focus, even if query is empty (shows full list)
      renderFloatingSearchResults(query)
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
      const cityTimeParts = getTimeInTimezone(now, city.timezone)
      const localTimeParts = getTimeInTimezone(now, localTimezone)

      // Create dates in UTC to compare
      const cityTime = Date.UTC(cityTimeParts.year, cityTimeParts.month, cityTimeParts.day,
                                 cityTimeParts.hour, cityTimeParts.minute, cityTimeParts.second)
      const localTime = Date.UTC(localTimeParts.year, localTimeParts.month, localTimeParts.day,
                                  localTimeParts.hour, localTimeParts.minute, localTimeParts.second)

      const diffMs = cityTime - localTime
      const diffHours = Math.round(diffMs / (1000 * 60 * 60))
      const cityDay = cityTimeParts.day
      const localDay = localTimeParts.day
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
                  <div class="city-name-wrapper">
                    <svg class="drag-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="9" x2="19" y2="9"/>
                      <line x1="5" y1="15" x2="19" y2="15"/>
                    </svg>
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
      const cityTimeParts = getTimeInTimezone(adjustedTime, timezone)
      const cityHour = cityTimeParts.hour
      const cityMinutes = cityTimeParts.minute

      // Reduce DOM elements for mobile performance: use -24 to +24 instead of -720 to +720
      // This reduces ~15,000 DOM elements per dial to ~500 elements
      for (let hourOffset = -24; hourOffset <= 24; hourOffset++) {
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

        // Create minute markers for every 5 minutes
        for (let minute = 5; minute < 60; minute += 5) {
          const marker = document.createElement("div")

          // Determine marker class based on minute
          if (minute === 30) {
            marker.className = "minute-marker big" // 30px height, 2px width
          } else if (minute === 15 || minute === 45) {
            marker.className = "minute-marker small" // 20px height
          } else {
            marker.className = "minute-marker" // 12px height (default)
          }

          marker.style.left = `${(minute / 60) * 100}%`
          hourSegment.appendChild(marker)
        }

        dialTrack.appendChild(hourSegment)
      }

      // Wait for DOM to settle before calculating positions
      // Use requestAnimationFrame twice to ensure layout is complete, especially on mobile
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const firstSegment = dialTrack.querySelector(".hour-segment") as HTMLElement
          const segmentWidth = firstSegment?.offsetWidth

          // Ensure we have valid dimensions before positioning
          if (!segmentWidth || segmentWidth === 0) {
            console.warn('Segment width not ready, retrying...')
            setTimeout(() => initializeDial(dialWrapper, timezone), 50)
            return
          }

          const centerSegmentIndex = 24
          const centerPosition = centerSegmentIndex * segmentWidth
          const minuteOffset = (cityMinutes / 60) * segmentWidth
          const wrapperWidth = dialWrapper.offsetWidth
          const centerOffset = wrapperWidth / 2
          const finalPosition = centerPosition + minuteOffset - centerOffset

          dialTrack.style.transform = `translateX(-${finalPosition}px)`
          dialTrack.dataset.centerOffset = finalPosition.toString()
        })
      })

      setupDialDrag(dialWrapper)
    }

    function setupDialDrag(dialWrapper: HTMLElement) {
      dialWrapper.addEventListener("mousedown", startDrag)
      // Use passive: false for touchstart to allow preventDefault for better touch handling
      dialWrapper.addEventListener("touchstart", startDrag, { passive: false })
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
        const segmentWidth = firstSegment?.offsetWidth

        // Skip calculations if segments aren't properly laid out (important for mobile)
        if (!segmentWidth || segmentWidth === 0) {
          rafId = null
          return
        }

        const wrapperWidth = dialElements[0]?.offsetWidth || 0
        const centerOfWrapper = wrapperWidth / 2

        const timezone = dialElements[0]?.dataset.dial
        const now = new Date()
        const cityTimeParts = timezone ? getTimeInTimezone(now, timezone) : { minute: 0 }
        const currentMinutes = cityTimeParts.minute

        const centerSegmentIndex = 24
        const centerPosition = centerSegmentIndex * segmentWidth
        // Each segment represents 60 minutes
        const currentMinutesPixelOffset = (currentMinutes / 60) * segmentWidth
        const actualCurrentPosition = centerPosition + currentMinutesPixelOffset

        const trackPositionAtIndicator = -newOffset + centerOfWrapper
        const pixelOffset = trackPositionAtIndicator - actualCurrentPosition
        // Each segment represents 60 minutes
        const minuteDiff = (pixelOffset / segmentWidth) * 60

        currentMinuteOffset = Math.round(minuteDiff)

        const pixelsPerMinute = segmentWidth / 60
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
    // Use passive: false for touchmove to allow smooth dragging without scroll interference
    document.addEventListener("touchmove", drag, { passive: false })
    document.addEventListener("mouseup", stopDrag)
    document.addEventListener("touchend", stopDrag, { passive: true })

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
        const cityTimeParts = getTimeInTimezone(adjustedTime, timezone)
        const cityMinutes = cityTimeParts.minute

        // Get actual segment width from the DOM to handle mobile responsive sizing
        const firstSegment = dialTrack.querySelector(".hour-segment") as HTMLElement
        const segmentWidth = firstSegment?.offsetWidth

        // Skip update if segments aren't laid out yet (important for mobile)
        if (!segmentWidth || segmentWidth === 0) {
          return
        }

        const centerSegmentIndex = 24
        const centerPosition = centerSegmentIndex * segmentWidth
        const minuteOffset = (cityMinutes / 60) * segmentWidth
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
        CITIES.find((c) => c.timezone === localTimezone)?.name || localTimezone.split("/").pop()?.replace(/_/g, " ")
      const localCity = { name: localCityName, timezone: localTimezone }
      const allCities = [localCity, ...Array.from(selectedCities.values())]

      allCities.forEach((city) => {
        const timeElements = document.querySelectorAll(`[data-time="${city.timezone}"][data-city-name="${city.name}"]`)

        timeElements.forEach((timeElement) => {
          timeElement.textContent = adjustedTime.toLocaleTimeString("en-US", {
            timeZone: city.timezone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        })

        const localTimeElements = document.querySelectorAll(
          `[data-local-time="${city.timezone}"][data-city-name="${city.name}"]`,
        )

        if (currentMinuteOffset !== 0) {
          localTimeElements.forEach((localTimeElement) => {
            localTimeElement.textContent =
              "Local: " +
              now.toLocaleTimeString("en-US", {
                timeZone: city.timezone,
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

    // Custom drag and drop for city reordering
    let isDraggingCity = false
    let draggedContainer: HTMLElement | null = null
    let dragClone: HTMLElement | null = null
    let dragStartY = 0
    let initialMouseY = 0
    let dragPlaceholder: HTMLElement | null = null

    function handleCityNameMouseDown(e: MouseEvent | TouchEvent) {
      const target = e.target as HTMLElement

      // Allow drag from city-name, drag-icon, city-timezone, or city-header-right
      const isDraggableElement =
        target.classList.contains('city-name') ||
        target.classList.contains('drag-icon') ||
        target.closest('.drag-icon') ||
        target.classList.contains('city-timezone') ||
        target.classList.contains('city-header-right') ||
        target.closest('.city-header-right')

      if (!isDraggableElement) {
        return
      }

      // Find the parent city-dial-container
      draggedContainer = target.closest('.city-dial-container') as HTMLElement
      if (!draggedContainer || draggedContainer.classList.contains('local')) {
        return
      }

      isDraggingCity = true
      initialMouseY = e.type === 'touchstart' ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
      const rect = draggedContainer.getBoundingClientRect()
      dragStartY = rect.top

      // Create placeholder
      dragPlaceholder = document.createElement('div')
      dragPlaceholder.className = 'drag-placeholder'
      dragPlaceholder.style.height = `${rect.height}px`
      dragPlaceholder.style.marginBottom = '16px'
      draggedContainer.parentNode?.insertBefore(dragPlaceholder, draggedContainer)

      // Create visual clone
      dragClone = draggedContainer.cloneNode(true) as HTMLElement
      dragClone.classList.add('drag-clone')
      dragClone.style.position = 'fixed'
      dragClone.style.left = `${rect.left}px`
      dragClone.style.top = `${rect.top}px`
      dragClone.style.width = `${rect.width}px`
      dragClone.style.pointerEvents = 'none'
      dragClone.style.zIndex = '10000'
      document.body.appendChild(dragClone)

      // Collapse original (hide it completely)
      draggedContainer.style.height = '0'
      draggedContainer.style.overflow = 'hidden'
      draggedContainer.style.marginBottom = '0'
      draggedContainer.style.padding = '0'
      draggedContainer.style.opacity = '0'
      draggedContainer.style.pointerEvents = 'none'

      e.preventDefault()
    }

    function handleCityNameMouseMove(e: MouseEvent | TouchEvent) {
      if (!isDraggingCity || !dragClone || !draggedContainer || !dragPlaceholder) {
        return
      }

      const clientY = e.type === 'touchmove' ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
      const deltaY = clientY - initialMouseY
      const newTop = dragStartY + deltaY

      // Move the clone
      dragClone.style.top = `${newTop}px`

      // Find where to insert based on touch/mouse position
      const timelineSection = document.getElementById('timelineSection')
      if (!timelineSection) return

      const allContainers = Array.from(timelineSection.querySelectorAll('.city-dial-container:not(.local)')) as HTMLElement[]
      let insertBeforeElement: HTMLElement | null = null

      for (const container of allContainers) {
        if (container === draggedContainer) continue

        const rect = container.getBoundingClientRect()
        const containerMiddle = rect.top + rect.height / 2

        if (clientY < containerMiddle) {
          insertBeforeElement = container
          break
        }
      }

      // Move placeholder
      if (insertBeforeElement) {
        insertBeforeElement.parentNode?.insertBefore(dragPlaceholder, insertBeforeElement)
      } else {
        // Insert at end
        const lastNonLocal = allContainers[allContainers.length - 1]
        if (lastNonLocal) {
          lastNonLocal.parentNode?.insertBefore(dragPlaceholder, lastNonLocal.nextSibling)
        }
      }
    }

    function handleCityNameMouseUp(e: MouseEvent | TouchEvent) {
      if (!isDraggingCity || !draggedContainer || !dragPlaceholder) {
        return
      }

      // Calculate new order based on placeholder position
      const timelineSection = document.getElementById('timelineSection')
      if (timelineSection) {
        const allContainers = Array.from(timelineSection.querySelectorAll('.city-dial-container:not(.local)')) as HTMLElement[]
        const placeholderIndex = Array.from(timelineSection.children).indexOf(dragPlaceholder)

        // Find the position in the non-local containers
        let targetIndex = 0
        for (let i = 0; i < timelineSection.children.length; i++) {
          if (timelineSection.children[i] === dragPlaceholder) {
            break
          }
          if (!timelineSection.children[i].classList.contains('local')) {
            targetIndex++
          }
        }

        const draggedCityKey = draggedContainer.dataset.cityKey
        if (draggedCityKey) {
          // Reorder in Map
          const citiesArray = Array.from(selectedCities.entries())
          const draggedIndex = citiesArray.findIndex(([key]) => key === draggedCityKey)

          if (draggedIndex !== -1) {
            const [draggedItem] = citiesArray.splice(draggedIndex, 1)
            citiesArray.splice(targetIndex, 0, draggedItem)
            selectedCities = new Map(citiesArray)
            saveSelectedCities()
          }
        }
      }

      // Cleanup
      if (dragClone) {
        dragClone.remove()
        dragClone = null
      }
      if (dragPlaceholder) {
        dragPlaceholder.remove()
        dragPlaceholder = null
      }
      if (draggedContainer) {
        draggedContainer.style.height = ''
        draggedContainer.style.overflow = ''
        draggedContainer.style.marginBottom = ''
        draggedContainer.style.padding = ''
        draggedContainer.style.opacity = ''
        draggedContainer.style.pointerEvents = ''
      }

      isDraggingCity = false
      draggedContainer = null

      // Rebuild to reflect new order
      rebuildTimelines()
    }

    function rebuildTimelines() {
      const timelineSection = document.getElementById("timelineSection")
      if (!timelineSection) return

      timelineSection.innerHTML = ""
      dialElements = []

      const localCityName =
        CITIES.find((c) => c.timezone === localTimezone)?.name || localTimezone.split("/").pop()?.replace(/_/g, " ")

      const localCity = { name: localCityName, timezone: localTimezone }
      const allCities = [localCity, ...Array.from(selectedCities.values())]

      allCities.forEach((city, index) => {
        const isLocal = city.timezone === localTimezone
        const cityDial = createCityDial(city, isLocal)
        timelineSection.appendChild(cityDial)

        const dialWrapper = cityDial.querySelector(`[data-dial="${city.timezone}"]`) as HTMLElement
        dialElements.push(dialWrapper)

        // Defer initialization slightly on mobile for better perceived performance
        // Initialize local city immediately, defer others by 50ms each
        const delay = index === 0 ? 0 : index * 50
        setTimeout(() => {
          initializeDial(dialWrapper, city.timezone)
        }, delay)

        // Setup drag and drop handlers for reordering (except local city)
        if (!isLocal) {
          cityDial.dataset.cityKey = `${city.name}-${city.timezone}`

          // Attach mouse and touch handlers for custom dragging on multiple elements
          const cityName = cityDial.querySelector('.city-name')
          const dragIcon = cityDial.querySelector('.drag-icon')
          const cityTimezone = cityDial.querySelector('.city-timezone')
          const cityHeaderRight = cityDial.querySelector('.city-header-right')

          if (cityName) {
            cityName.addEventListener('mousedown', handleCityNameMouseDown as EventListener)
            cityName.addEventListener('touchstart', handleCityNameMouseDown as EventListener, { passive: false })
          }
          if (dragIcon) {
            dragIcon.addEventListener('mousedown', handleCityNameMouseDown as EventListener)
            dragIcon.addEventListener('touchstart', handleCityNameMouseDown as EventListener, { passive: false })
          }
          if (cityTimezone) {
            cityTimezone.addEventListener('mousedown', handleCityNameMouseDown as EventListener)
            cityTimezone.addEventListener('touchstart', handleCityNameMouseDown as EventListener, { passive: false })
          }
          if (cityHeaderRight) {
            cityHeaderRight.addEventListener('mousedown', handleCityNameMouseDown as EventListener)
            cityHeaderRight.addEventListener('touchstart', handleCityNameMouseDown as EventListener, { passive: false })
          }
        }
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

    // Add global mouse and touch event listeners for city reordering
    document.addEventListener("mousemove", handleCityNameMouseMove)
    document.addEventListener("mouseup", handleCityNameMouseUp)
    document.addEventListener("touchmove", handleCityNameMouseMove as EventListener, { passive: false })
    document.addEventListener("touchend", handleCityNameMouseUp as EventListener)

    rebuildTimelines()

    return () => {
      clearInterval(updateInterval)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      document.removeEventListener("mousemove", drag)
      // @ts-ignore - passive option is valid but TypeScript doesn't recognize it in removeEventListener
      document.removeEventListener("touchmove", drag, { passive: false })
      document.removeEventListener("mouseup", stopDrag)
      // @ts-ignore
      document.removeEventListener("touchend", stopDrag, { passive: true })
      document.removeEventListener("mousemove", handleCityNameMouseMove)
      document.removeEventListener("mouseup", handleCityNameMouseUp)
      // @ts-ignore
      document.removeEventListener("touchmove", handleCityNameMouseMove, { passive: false })
      document.removeEventListener("touchend", handleCityNameMouseUp)
      // Note: AudioContext is kept alive for reuse (stored in ref)
    }
  }, [])

  // Cleanup AudioContext on component unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      <div className="container">
        <div className="header-bar">
          <div className="header-left">
            <HamburgerMenu onClick={handleSidebarOpen} />
          </div>
          <h1 className="tracking-normal font-semibold leading-6 header-title text-center font-serif">🕒 Remote Timezone</h1>
          <div className="header-buttons">
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
            placeholder="Add city (search by name, country, or timezone)..."
          />
          <div className="floating-search-results" id="floatingSearchResults"></div>
        </div>
      </div>

      <div className="overlay" id="overlay"></div>
    </>
  )
}
