export interface LocationSuggestion {
  id: string;
  label: string;
  subtitle: string;
}

export const LOCATION_SUGGESTIONS: LocationSuggestion[] = [
  { id: "lax", label: "Los Angeles International Airport (LAX)", subtitle: "1 World Way, Los Angeles, CA" },
  { id: "burbank", label: "Hollywood Burbank Airport", subtitle: "2627 N Hollywood Way, Burbank, CA" },
  { id: "long-beach", label: "Long Beach Airport (LGB)", subtitle: "4100 Donald Douglas Dr, Long Beach, CA" },
  { id: "dtla", label: "Downtown Los Angeles", subtitle: "Los Angeles, CA" },
  { id: "santa-monica", label: "Santa Monica", subtitle: "Santa Monica, CA" },
  { id: "beverly-hills", label: "Beverly Hills", subtitle: "Beverly Hills, CA" },
  { id: "hollywood", label: "Hollywood", subtitle: "Hollywood, Los Angeles, CA" },
  { id: "malibu", label: "Malibu", subtitle: "Malibu, CA" },
  { id: "pasadena", label: "Pasadena", subtitle: "Pasadena, CA" },
  { id: "the-beverly-hills-hotel", label: "The Beverly Hills Hotel", subtitle: "9641 Sunset Blvd, Beverly Hills, CA" },
  { id: "ritz-dtla", label: "The Ritz-Carlton Los Angeles", subtitle: "900 W Olympic Blvd, Los Angeles, CA" },
  { id: "four-seasons", label: "Four Seasons Hotel Los Angeles", subtitle: "300 S Doheny Dr, Los Angeles, CA" },
  { id: "waldorf", label: "Waldorf Astoria Beverly Hills", subtitle: "9850 Wilshire Blvd, Beverly Hills, CA" },
  { id: "sofi", label: "SoFi Stadium", subtitle: "1001 Stadium Dr, Inglewood, CA" },
  { id: "staples", label: "Crypto.com Arena", subtitle: "1111 S Figueroa St, Los Angeles, CA" },
  { id: "union-station", label: "Union Station Los Angeles", subtitle: "800 N Alameda St, Los Angeles, CA" },
  { id: "venice", label: "Venice Beach", subtitle: "Venice, Los Angeles, CA" },
  { id: "orange-county", label: "John Wayne Airport (SNA)", subtitle: "18601 Airport Way, Santa Ana, CA" },
];
