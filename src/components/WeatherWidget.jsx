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
      <div className="bg-gradient-to-b from-[rgba(32,1,34,0.5)] to-[rgba(111,0,0,0.5)] rounded-lg shadow-lg p-5 w-full mb-5">
        <h2 className="text-2xl font-josefin text-center mb-4 text-white">Weather</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  const currentWeather = getCurrentWeather();

  return (
    <div className="bg-gradient-to-b from-[rgba(32,1,34,0.5)] to-[rgba(111,0,0,0.5)] rounded-lg shadow-lg p-5 w-full mb-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-josefin text-white">Weather</h2>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className="text-white bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] p-2 rounded-full transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      {/* City Search Form */}
      {showSearch && (
        <form onSubmit={searchByCity} className="mb-4 flex">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1 p-2 bg-[rgba(32,1,34,0.25)] text-white rounded-l focus:outline-none"
          />
          <button 
            type="submit"
            className="bg-[rgba(111,0,0,0.7)] hover:bg-[rgba(111,0,0,1)] text-white p-2 rounded-r"
          >
            Search
          </button>
        </form>
      )}
      
      {error && (
        <div className="bg-red-900/30 p-4 rounded-lg text-center mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {weatherData && currentWeather && (
        <>
          {/* Current Weather (from first forecast item) */}
          <div className="bg-gradient-to-r from-[rgba(32,1,34,0.3)] to-[rgba(111,0,0,0.3)] rounded-lg p-4 mb-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{location.name}</div>
                <div className="text-3xl font-bold my-2">{Math.round(currentWeather.main.temp)}°C</div>
                <div className="text-sm capitalize">{currentWeather.weather[0].description}</div>
                <div className="text-xs mt-1">Feels like: {Math.round(currentWeather.main.feels_like)}°C</div>
              </div>
              
              <img 
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} 
                alt={currentWeather.weather[0].main}
                className="w-20 h-20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Humidity: {currentWeather.main.humidity}%
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Wind: {Math.round(currentWeather.wind.speed)} m/s
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Pressure: {currentWeather.main.pressure} hPa
              </div>
            </div>
          </div>
          
          {/* Hourly Forecast */}
          <div className="bg-gradient-to-r from-[rgba(32,1,34,0.3)] to-[rgba(111,0,0,0.3)] rounded-lg p-3 mb-3 overflow-x-auto">
            <div className="text-sm font-medium mb-2">Next 24 Hours</div>
            <div className="flex space-x-4">
              {getHourlyForecasts().map((forecast, index) => (
                <div key={index} className="flex flex-col items-center min-w-[50px]">
                  <div className="text-xs">{index === 0 ? 'Now' : formatTime(forecast.dt)}</div>
                  <img 
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} 
                    alt={forecast.weather[0].description}
                    className="w-8 h-8"
                  />
                  <div className="text-xs font-medium">{Math.round(forecast.main.temp)}°</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Daily Forecast */}
          <div className="bg-gradient-to-r from-[rgba(32,1,34,0.3)] to-[rgba(111,0,0,0.3)] rounded-lg p-3">
            <div className="text-sm font-medium mb-2">5-Day Forecast</div>
            <div className="space-y-2">
              {getDailyForecasts().map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-xs w-14">{index === 0 ? 'Today' : formatDay(day.dt)}</div>
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.weather.icon}.png`} 
                    alt={day.weather.description}
                    className="w-8 h-8"
                  />
                  <div className="flex space-x-2 text-xs">
                    <span className="font-medium">{Math.round(day.temp_max)}°</span>
                    <span className="text-gray-300">{Math.round(day.temp_min)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-2 text-xs text-right text-gray-300">
            Data from OpenWeatherMap
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherWidget;