export default interface ICityOption {
  label: string;
  value: string;
  cityData: {
    cityName: string;
    windSpeed: number;
  };
  key: string;
}
