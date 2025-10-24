import { CurrentWeather } from "@/components/current-weather";
import { FavoriteCities } from "@/components/favorite-cities";
import { HourlyTemperature } from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WeatherDetails } from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useState, useEffect } from "react";

import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isloading: locationLoading,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (!lastUpdated) return;

    const updateAgo = () => {
      const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (diff < 60) {
        setTimeAgo(`${diff}s ago`);
      } else {
        const mins = Math.floor(diff / 60);
        setTimeAgo(`${mins}m ago`);
      }
    };

    updateAgo(); // initial call
    const interval = setInterval(updateAgo, 60000); // har 1 min baad update

    return () => clearInterval(interval); // cleanup
  }, [lastUpdated]);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
      setLastUpdated(new Date());
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather.</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      <FavoriteCities />
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">My Location</h1>
          {lastUpdated && (
            <span className="text-base text-muted-foreground">
              Last updated: {timeAgo}
            </span>
          )}
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "aminate-spin" : ""
            }`}
          />
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-6">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />

          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
