export interface LocationSuggestion {
  id: string;
  label: string;
  subtitle: string;
  lat: number;
  lng: number;
}

export const LOCATION_SUGGESTIONS: LocationSuggestion[] = [
  // Los Angeles Major Airports & Private Jet FBOs
  { id: "lax", label: "Los Angeles International Airport (LAX)", subtitle: "1 World Way, Los Angeles, CA 90045", lat: 33.9416, lng: -118.4085 },
  { id: "lax-atlantic", label: "Atlantic Aviation LAX (FBO)", subtitle: "6411 W Imperial Hwy, Los Angeles, CA", lat: 33.9304, lng: -118.4025 },
  { id: "lax-signature", label: "Signature Aviation LAX (FBO)", subtitle: "6201 W Imperial Hwy, Los Angeles, CA", lat: 33.9308, lng: -118.3970 },
  { id: "vny", label: "Van Nuys Airport (VNY - Private Aviation)", subtitle: "16461 Sherman Way, Van Nuys, CA", lat: 34.2098, lng: -118.4899 },
  { id: "burbank", label: "Hollywood Burbank Airport (BUR)", subtitle: "2627 N Hollywood Way, Burbank, CA", lat: 34.2007, lng: -118.3587 },
  { id: "long-beach", label: "Long Beach Airport (LGB)", subtitle: "4100 Donald Douglas Dr, Long Beach, CA", lat: 33.8177, lng: -118.1516 },
  { id: "orange-county", label: "John Wayne Airport (SNA)", subtitle: "18601 Airport Way, Santa Ana, CA", lat: 33.6757, lng: -117.8675 },

  // Beverly Hills & Luxury Hotels
  { id: "beverly-hills-hotel", label: "The Beverly Hills Hotel", subtitle: "9641 Sunset Blvd, Beverly Hills, CA 90210", lat: 34.0817, lng: -118.4138 },
  { id: "beverly-wilshire", label: "Beverly Wilshire, A Four Seasons Hotel", subtitle: "9500 Wilshire Blvd, Beverly Hills, CA 90212", lat: 34.0664, lng: -118.4008 },
  { id: "waldorf-astoria-bh", label: "Waldorf Astoria Beverly Hills", subtitle: "9850 Wilshire Blvd, Beverly Hills, CA 90210", lat: 34.0673, lng: -118.4124 },
  { id: "peninsula-bh", label: "The Peninsula Beverly Hills", subtitle: "9882 S Santa Monica Blvd, Beverly Hills, CA", lat: 34.0670, lng: -118.4135 },
  { id: "four-seasons-la", label: "Four Seasons Hotel Los Angeles at Beverly Hills", subtitle: "300 S Doheny Dr, Los Angeles, CA 90048", lat: 34.0728, lng: -118.3887 },
  { id: "hotel-bel-air", label: "Hotel Bel-Air", subtitle: "701 Stone Canyon Rd, Los Angeles, CA 90077", lat: 34.0877, lng: -118.4449 },
  { id: "chateau-marmont", label: "Chateau Marmont", subtitle: "8221 Sunset Blvd, Los Angeles, CA 90046", lat: 34.0983, lng: -118.3685 },
  { id: "ritz-carlton-dtla", label: "The Ritz-Carlton, Los Angeles", subtitle: "900 W Olympic Blvd, Los Angeles, CA 90015", lat: 34.0454, lng: -118.2673 },
  { id: "proper-hotel-sm", label: "Santa Monica Proper Hotel", subtitle: "700 Wilshire Blvd, Santa Monica, CA 90401", lat: 34.0198, lng: -118.4962 },
  { id: "shutters-on-beach", label: "Shutters on the Beach", subtitle: "1 Pico Blvd, Santa Monica, CA 90405", lat: 34.0069, lng: -118.4878 },
  { id: "nobu-ryokan-malibu", label: "Nobu Ryokan Malibu", subtitle: "22752 Pacific Coast Hwy, Malibu, CA 90265", lat: 34.0379, lng: -118.6534 },

  // Iconic Los Angeles Destinations & Entertainment
  { id: "rodeo-drive", label: "Rodeo Drive", subtitle: "Beverly Hills, CA 90210", lat: 34.0676, lng: -118.4014 },
  { id: "santa-monica-pier", label: "Santa Monica Pier", subtitle: "200 Santa Monica Pier, Santa Monica, CA", lat: 34.0089, lng: -118.4974 },
  { id: "malibu-pier", label: "Malibu Pier & Beach", subtitle: "23000 Pacific Coast Hwy, Malibu, CA", lat: 34.0366, lng: -118.6766 },
  { id: "sofi-stadium", label: "SoFi Stadium", subtitle: "1001 Stadium Dr, Inglewood, CA 90305", lat: 33.9535, lng: -118.3390 },
  { id: "crypto-arena", label: "Crypto.com Arena (Staples Center)", subtitle: "1111 S Figueroa St, Los Angeles, CA 90015", lat: 34.0430, lng: -118.2673 },
  { id: "dodger-stadium", label: "Dodger Stadium", subtitle: "1000 Vin Scully Ave, Los Angeles, CA 90012", lat: 34.0739, lng: -118.2400 },
  { id: "universal-studios", label: "Universal Studios Hollywood", subtitle: "100 Universal City Plaza, Universal City, CA", lat: 34.1381, lng: -118.3534 },
  { id: "disneyland", label: "Disneyland Resort", subtitle: "1313 Disneyland Dr, Anaheim, CA 92802", lat: 33.8121, lng: -117.9190 },
  { id: "hollywood-bowl", label: "Hollywood Bowl", subtitle: "2301 N Highland Ave, Los Angeles, CA 90068", lat: 34.1128, lng: -118.3390 },
  { id: "walk-of-fame", label: "Hollywood Walk of Fame", subtitle: "Hollywood Blvd, Los Angeles, CA", lat: 34.1016, lng: -118.3418 },
  { id: "getty-center", label: "The Getty Center", subtitle: "1200 Getty Center Dr, Los Angeles, CA 90049", lat: 34.0780, lng: -118.4741 },
  { id: "griffith-observatory", label: "Griffith Observatory", subtitle: "2800 E Observatory Rd, Los Angeles, CA 90027", lat: 34.1184, lng: -118.3004 },
  { id: "dtla", label: "Downtown Los Angeles", subtitle: "Los Angeles, CA", lat: 34.0407, lng: -118.2468 },
  { id: "beverly-hills", label: "Beverly Hills", subtitle: "Beverly Hills, CA", lat: 34.0736, lng: -118.4004 },
  { id: "santa-monica", label: "Santa Monica", subtitle: "Santa Monica, CA", lat: 34.0195, lng: -118.4912 },
  { id: "malibu", label: "Malibu", subtitle: "Malibu, CA", lat: 34.0259, lng: -118.7798 },
  { id: "century-city", label: "Century City", subtitle: "Los Angeles, CA 90067", lat: 34.0537, lng: -118.4168 },
  { id: "bel-air", label: "Bel Air", subtitle: "Los Angeles, CA 90077", lat: 34.0837, lng: -118.4487 },

  // Alexandria & Cairo, Egypt
  { id: "sidi-beshr", label: "Sidi Bishr (سيدي بشر)", subtitle: "Alexandria, Egypt", lat: 31.2571, lng: 29.9940 },
  { id: "janaklis", label: "Janaklis / Gnaklis (جناكليس)", subtitle: "El Raml, Alexandria, Egypt", lat: 31.2432, lng: 29.9692 },
  { id: "san-stefano", label: "San Stefano (سان ستيفانو)", subtitle: "El Raml, Alexandria, Egypt", lat: 31.2443, lng: 29.9678 },
  { id: "smouha", label: "Smouha (سموحة)", subtitle: "Alexandria, Egypt", lat: 31.2156, lng: 29.9458 },
  { id: "stanley", label: "Stanley (ستانلي)", subtitle: "Alexandria, Egypt", lat: 31.2355, lng: 29.9497 },
  { id: "borg-el-arab", label: "Borg El Arab International Airport (HBE)", subtitle: "Alexandria, Egypt", lat: 30.9177, lng: 29.6964 },
  { id: "cairo-airport", label: "Cairo International Airport (CAI)", subtitle: "Heliopolis, Cairo, Egypt", lat: 30.1219, lng: 31.4056 },
  { id: "new-cairo", label: "New Cairo / Fifth Settlement (التجمع الخامس)", subtitle: "Cairo, Egypt", lat: 30.0296, lng: 31.4786 },
  { id: "zamalek", label: "Zamalek (الزمالك)", subtitle: "Cairo, Egypt", lat: 30.0610, lng: 31.2198 },
];
