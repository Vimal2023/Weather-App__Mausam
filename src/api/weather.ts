import { API_CONFIG } from "./config";
import type {
  Coordinates,
  ForecastData,
  GeocodingResponse,
  WeatherData,
} from "./types";

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });

    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }

    return response.json();
  }

  //  CHANGED: Added units param (optional)
  async getCurrentWeather({
    lat,
    lon,
    units = API_CONFIG.DEFAULT_PARAMS.units,
  }: Coordinates & { units?: string }): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units,
    });

    return this.fetchData<WeatherData>(url);
  }

  //  CHANGED: Added units param (optional)
  async getForecast({
    lat,
    lon,
    units = API_CONFIG.DEFAULT_PARAMS.units,
  }: Coordinates & { units?: string }): Promise<ForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units,
    });

    return this.fetchData<ForecastData>(url);
  }

  async reverseGeocode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: 1,
    });

    return this.fetchData<GeocodingResponse[]>(url);
  }

  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: "5",
    });

    return this.fetchData<GeocodingResponse[]>(url);
  }

  //  CHANGED: Added units param (optional)
  async getWeatherByCity(
    city: string,
    units = API_CONFIG.DEFAULT_PARAMS.units
  ): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      q: city,
      units,
    });

    return this.fetchData<WeatherData>(url);
  }

  //  CHANGED: Added units param (optional)
  async getForecastByCity(
    city: string,
    units = API_CONFIG.DEFAULT_PARAMS.units
  ): Promise<ForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      q: city,
      units,
    });

    return this.fetchData<ForecastData>(url);
  }
}

export const weatherAPI = new WeatherAPI();
