import { useQuery } from "@tanstack/react-query";
import { weatherAPI } from "@/api/weather";
import type { Coordinates } from "@/api/types";
import { useState, useEffect } from "react";

//  CHANGED: Import useTemperature context
import { useTemperature } from "@/context/temperature-provider";

function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export const WEATHER_KEYS = {
  weather: (coords: Coordinates) =>
    ["weather", `${coords.lat},${coords.lon}`] as const,
  forecast: (coords: Coordinates) =>
    ["forecast", `${coords.lat},${coords.lon}`] as const,
  location: (coords: Coordinates) =>
    ["location", `${coords.lat},${coords.lon}`] as const,
  search: (query: string) => ["location-search", query] as const,
} as const;

//  CHANGED: Add unit in queryKey + API call
export function useWeatherQuery(coordinates: Coordinates | null) {
  const { unit } = useTemperature(); // get unit from context

  return useQuery({
    queryKey: coordinates
      ? [...WEATHER_KEYS.weather(coordinates), unit] // add unit in cache key
      : ["weather"],
    queryFn: () =>
      coordinates
        ? weatherAPI.getCurrentWeather({ ...coordinates, units: unit })
        : null,
    enabled: !!coordinates,
    staleTime: 1000 * 60 * 5, // 5 min fresh
    gcTime: 1000 * 60 * 30, // 30 min cache
    retry: 1,
    refetchInterval: 1000 * 60 * 10, // auto refresh every 10 min
    refetchOnWindowFocus: false, // disable on tab switch
  });
}

//  CHANGED: Add unit in queryKey + API call
export function useForecastQuery(coordinates: Coordinates | null) {
  const { unit } = useTemperature();

  return useQuery({
    queryKey: coordinates
      ? [...WEATHER_KEYS.forecast(coordinates), unit]
      : ["forecast"],
    queryFn: () =>
      coordinates
        ? weatherAPI.getForecast({ ...coordinates, units: unit })
        : null,
    enabled: !!coordinates,
    staleTime: 1000 * 60 * 10, // forecast valid longer
    gcTime: 1000 * 60 * 60, // 1 hour cache
    retry: 1,
  });
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: coordinates ? WEATHER_KEYS.location(coordinates) : ["location"],
    queryFn: () =>
      coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 1 day
  });
}

export function useLocationSearch(query: string) {
  const debouncedQuery = useDebounce(query, 500);

  return useQuery({
    queryKey: WEATHER_KEYS.search(debouncedQuery),
    queryFn: () => weatherAPI.searchLocations(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
  });
}
