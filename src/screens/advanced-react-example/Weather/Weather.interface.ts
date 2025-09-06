export interface Coord {
  lon: number;
  lat: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherResponse {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

/*
const res = {
  "coord": {
    "lon": -122.084,
    "lat": 37.422
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01n"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 289.23,
    "feels_like": 288.96,
    "temp_min": 289.23,
    "temp_max": 289.23,
    "pressure": 1015,
    "humidity": 79,
    "sea_level": 1015,
    "grnd_level": 1002
  },
  "visibility": 10000,
  "wind": {
    "speed": 2.38,
    "deg": 204,
    "gust": 3.33
  },
  "clouds": {
    "all": 0
  },
  "dt": 1756878604,
  "sys": {
    "country": "US",
    "sunrise": 1756820402,
    "sunset": 1756866972
  },
  "timezone": -25200,
  "id": 5375480,
  "name": "Mountain View",
  "cod": 200
};*/