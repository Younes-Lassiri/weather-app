import React, { useState, useEffect } from 'react';
import axios from 'axios';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

const translations = {
  en: {
    "El Aaiún": "Laayoune",
    // Add more translations here
  },
  // Add other languages here
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translations.en },
    // Add other languages here
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

function App() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  const [defaultLocation, setDefaultLocation] = useState('');

  const apiKey = 'f419ea8decac4ff5923133450240807';
  
  const fetchWeatherData = (location) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

    axios.get(url).then((response) => {
      setData(response.data);
      console.log(response.data);
    }).catch(error => {
      console.error("Error fetching weather data:", error);
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude},${longitude}`;
        setDefaultLocation(location);
        fetchWeatherData(location);
      }, error => {
        console.error("Error getting geolocation:", error);
        // Fallback to a default location if geolocation fails
        fetchWeatherData('New York');
      });
    } else {
      // Geolocation is not supported by this browser, use a default location
      fetchWeatherData('New York');
    }
  }, []);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      fetchWeatherData(location);
      setLocation('');
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            {data && data.location && <p>{t(data.location.name)}</p>}
          </div>
          <div className="temp">
            {data && data.current && <h1>{data.current.temp_c.toFixed()}°C</h1>}
          </div>
          <div className="description">
            {data && data.current && <p>{data.current.condition.text}</p>}
          </div>
        </div>

        {data && data.location &&
          <div className="bottom">
            <div className="feels">
              {data && data.current && <p className='bold'>{data.current.feelslike_c.toFixed()}°C</p>}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data && data.current && <p className='bold'>{data.current.humidity}%</p>}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data && data.current && <p className='bold'>{data.current.wind_kph.toFixed()} KPH</p>}
              <p>Wind Speed</p>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
