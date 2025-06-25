import React, { useState, useEffect } from 'react';

function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null, name: 'Loading location...' });
  const [searchCity, setSearchCity] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // API key - replace with your actual key
  const API_KEY = 'your_openweathermap_api_key';

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'Current Location'
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to a location if geolocation fails (New York in this case)
          setLocation({ lat: 40.7128, lon: -74.0060, name: 'New York' });
        }
      );
    } else {
      // Geolocation not supported by browser
      setLocation({ lat: 40.7128, lon: -74.0060, name: 'New York' });
    }
  }, []);

  // Fetch weather data whenever location changes
  useEffect(() => {
    if (location.lat && location.lon) {
      fetchForecastData(location.lat, location.lon);
    }
  }, [location.lat, location.lon]);

  // Function to fetch 5-day forecast by coordinates
  const fetchForecastData = async (lat, lon) => {
    setLoading(true);
    try {
      // Get 5-day forecast data
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Forecast data not available');
      }
      
      const data = await response.json();

      // Update location name if needed
      if (location.name === 'Current Location') {
        setLocation(prev => ({
          ...prev,
          name: `${data.city.name}, ${data.city.country}`
        }));
      }
      
      setWeatherData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      setError(err.message || 'Failed to fetch forecast data');
    } finally {
      setLoading(false);
    }
  };

  // Function to search for a city
  const searchByCity = async (e) => {
    e.preventDefault();
    
    if (!searchCity.trim()) return;
    
    setLoading(true);
    try {
      // Geocoding API to get coordinates from city name
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=1&appid=${API_KEY}`
      );
      
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        throw new Error('City not found');
      }
      
      // Update location with the found city
      setLocation({
        lat: geoData[0].lat,
        lon: geoData[0].lon,
        name: `${geoData[0].name}, ${geoData[0].country}`
      });
      
      setSearchCity('');
      setShowSearch(false);
    } catch (err) {
      console.error('Error searching for city:', err);
      setError(err.message || 'City not found');
      setLoading(false);
    }
  };

  // Get current weather from the first forecast item
  const getCurrentWeather = () => {
    if (!weatherData || !weatherData.list || weatherData.list.length === 0) return null;
    return weatherData.list[0];
  };

  // Group forecast data by day
  const getDailyForecasts = () => {
    if (!weatherData) return [];
    
    const dailyData = {};
    
    // Group forecasts by day
    weatherData.list.forEach(forecast => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          dt: forecast.dt,
          temp_min: forecast.main.temp_min,
          temp_max: forecast.main.temp_max,
          weather: forecast.weather[0]
        };
      } else {
        // Update min/max temperature
        dailyData[date].temp_min = Math.min(dailyData[date].temp_min, forecast.main.temp_min);
        dailyData[date].temp_max = Math.max(dailyData[date].temp_max, forecast.main.temp_max);
      }
    });
    
    // Convert to array and limit to 5 days
    return Object.values(dailyData).slice(0, 5);
  };

  // Get forecasts for the next 24 hours (8 forecasts, 3 hours apart)
  const getHourlyForecasts = () => {
    if (!weatherData) return [];
    return weatherData.list.slice(0, 8);
  };

  // Format time from Unix timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Format day from Unix timestamp
  const formatDay = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString([], { 
      weekday: 'short'
    });
  };

  if (loading && !weatherData) {
    return (
      <div className="text-white p-4 rounded-lg flex flex-col items-center justify-center h-60">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const currentWeather = getCurrentWeather();

  return (
    <div className="text-white rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Weather</h2>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
        >
          {/* Search Icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
      </div>
      
      {showSearch && (
        <form onSubmit={searchByCity} className="mb-4 flex gap-2">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search for a city..."
            className="flex-grow p-2 rounded-lg bg-transparent border border-gray-400 focus:outline-none focus:border-white"
          />
          <button 
            type="submit"
            className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          >
            Search
          </button>
        </form>
      )}
      
      {error && (
        <div className="bg-red-500 bg-opacity-30 p-3 rounded-lg text-center mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {weatherData && currentWeather && (
        <>
          {/* Current Weather */}
          <div className="text-center mb-4">
            <p className="text-lg font-semibold">{location.name}</p>
            <div className="flex items-center justify-center">
              <img 
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} 
                alt={currentWeather.weather[0].main}
                className="w-16 h-16"
              />
              <p className="text-5xl font-bold">{Math.round(currentWeather.main.temp)}°C</p>
            </div>
            <p className="text-sm capitalize">{currentWeather.weather[0].description}</p>
          </div>

          {/* Hourly Forecast */}
          <div className="mb-4">
            <h3 className="text-md font-bold mb-2">Hourly</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {getHourlyForecasts().map((forecast, index) => (
                <div key={index} className="text-center p-2 rounded-lg bg-white bg-opacity-10 min-w-[60px]">
                  <p className="text-sm">{formatTime(forecast.dt)}</p>
                  <img 
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} 
                    alt={forecast.weather[0].main}
                    className="w-10 h-10 mx-auto"
                  />
                  <p className="text-md font-semibold">{Math.round(forecast.main.temp)}°</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="flex-grow flex flex-col">
            <h3 className="text-md font-bold mb-2">5-Day Forecast</h3>
            <div className="space-y-2 flex-grow overflow-y-auto">
              {getDailyForecasts().map((day, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-white bg-opacity-10">
                  <p className="font-semibold w-12">{formatDay(day.dt)}</p>
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.weather.icon}.png`} 
                    alt={day.weather.main}
                    className="w-8 h-8"
                  />
                  <div className="flex gap-2 text-sm w-24 justify-end">
                    <span>H: {Math.round(day.temp_max)}°</span>
                    <span>L: {Math.round(day.temp_min)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherWidget;