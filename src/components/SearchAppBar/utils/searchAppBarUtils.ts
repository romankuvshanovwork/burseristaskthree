import axios from "axios";
import {
  BASE_GEOCODING_API_URL,
  BASE_METEO_API_URL,
} from "../../../constants/baseURLs";

export function getLabel(result: any, windSpeed: string) {
  const parts = [
    result.country,
    result.admin1,
    result.admin2,
    result.admin3,
    result.admin4,
    result.name,
  ].filter(Boolean);
  return `${parts.join(", ")} (Скорость ветра: ${windSpeed} км/ч)`;
}

export function getCitiesData(query: string) {
  return axios
    .get(
      `${BASE_GEOCODING_API_URL}/search?name=${query}&count=100&language=ru&format=json`
    )
    .then((response) => {
      const cityResults = response.data?.results || [];

      const fetchWindSpeedPromises = cityResults.map((result: any) => {
        const { latitude, longitude } = result;

        return axios
          .get(
            `${BASE_METEO_API_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m&forecast_days=0`
          )
          .then((response) => {
            const windSpeed = response.data.current?.wind_speed_10m || "н/д";

            return {
              label: getLabel(result, windSpeed),
              value: result.name,
              cityData: {
                cityName: result.name,
                windSpeed: windSpeed,
              },
              key: result?.id,
            };
          })
          .catch((error) => {
            throw error;
          });
      });

      return Promise.all(fetchWindSpeedPromises);
    })
    .catch((error) => {
      throw error;
    });
}
