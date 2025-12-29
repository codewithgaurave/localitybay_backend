/**
 * Google Maps Configuration for LocalityBay
 * 
 * To enable Google Maps functionality:
 * 1. Get an API key from Google Cloud Console
 * 2. Replace 'YOUR_GOOGLE_MAPS_API_KEY' below with your actual API key
 * 3. Save this file
 * 
 * Example:
 * export const GOOGLE_MAPS_API_KEY = 'AIzaSyBvOkBH2jlnpEXAMPLEKEY';
 */

export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

/**
 * Google Maps Configuration Options
 */
export const GOOGLE_MAPS_CONFIG = {
  // Default map center (Connaught Place, New Delhi)
  defaultCenter: {
    lat: 28.6139,
    lng: 77.2090
  },
  
  // Default zoom level
  defaultZoom: 13,
  
  // Required Google Maps libraries
  libraries: ['marker'],
  
  // Map style configuration
  mapOptions: {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    gestureHandling: 'cooperative' as const
  }
};

/**
 * Helper function to check if API key is configured
 */
export const isGoogleMapsConfigured = (): boolean => {
  return GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' && 
         GOOGLE_MAPS_API_KEY.length > 20;
};
