import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Main App Component
 * Manages state, fetches data, and orchestrates child components.
 */
function App() {
  // OpenWeatherMap API key - Moved inside App to ensure it's in scope for all nested components/functions.
  // In a real application, consider using environment variables for API keys.
  const API_KEY = 'aeaf89644b1bada5f6086d2b12fa3892';

  // State variables to manage the application's data and UI
  const [city, setCity] = useState(''); // Stores the user-entered city name
  const [unit, setUnit] = useState('metric'); // Stores the selected temperature unit ('metric' for Celsius, 'imperial' for Fahrenheit)
  const [currentWeather, setCurrentWeather] = useState(null); // New state for current weather data
  const [forecast, setForecast] = useState([]); // Stores the 5-day weather forecast data
  const [error, setError] = useState(''); // Stores any error messages (e.g., city not found)
  const [cityName, setCityName] = useState(''); // Stores the full city name and country from the API response
  const [searchClicked, setSearchClicked] = useState(false); // Flag to track if a search has been performed
  const [loading, setLoading] = useState(false); // New state to indicate loading status
  const [weatherCondition, setWeatherCondition] = useState(''); // New state for main weather condition (e.g., 'Clear', 'Clouds')

  // Nested Component Definitions:
  // These components are defined inside App to ensure they have access to
  // useState and other variables defined within the App's scope.
  // This structure maintains logical separation while adhering to the
  // single-file output requirement of this environment.

  /**
   * SearchBar Component (Nested)
   * Handles city input and search button.
   * @param {object} props - Component props
   * @param {string} props.city - Current city input value
   * @param {function} props.setCity - Function to update city input value
   * @param {function} props.onSearchImmediate - Function to call for immediate search (e.g., Enter key, button click)
   * @param {function} props.onSearchDebounced - Function to call for debounced search (e.g., on change)
   * @param {boolean} props.loading - Indicates if data is currently loading
   */
  function SearchBar({ city, setCity, onSearchImmediate, onSearchDebounced, loading }) {
    // Ref for the debounce timer, managed within SearchBar for cleaner separation
    const debounceTimerRef = useRef(null);

    const handleInputChange = (e) => {
      const inputValue = e.target.value;
      setCity(inputValue); // Update the city state immediately

      // Clear previous timer to reset the debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set a new timer for debounced action (clearing previous results)
      debounceTimerRef.current = setTimeout(() => {
        onSearchDebounced(inputValue); // Trigger debounced action in App
      }, 300); // Shorter debounce time for clearing, as no API call is made
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        // Clear any pending debounced action when Enter is pressed
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        onSearchImmediate(); // Trigger immediate search on Enter key
      }
    };

    return (
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter city"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 shadow-sm"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={onSearchImmediate} // Trigger immediate search on button click
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </div>
    );
  }

  /**
   * UnitToggle Component (Nested)
   * Handles the Celsius/Fahrenheit unit selection buttons.
   * @param {object} props - Component props
   * @param {string} props.unit - Current selected unit ('metric' or 'imperial')
   * @param {function} props.setUnit - Function to update the unit
   * @param {boolean} props.loading - Indicates if data is currently loading
   */
  function UnitToggle({ unit, setUnit, loading }) {
    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          className={`px-5 py-2 rounded-lg border-2 transition duration-200 ease-in-out ${
            unit === 'metric'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-indigo-600 border-indigo-400 hover:bg-indigo-50'
          }`}
          onClick={() => setUnit('metric')}
          disabled={loading}
        >
          °C
        </button>
        <button
          className={`px-5 py-2 rounded-lg border-2 transition duration-200 ease-in-out ${
            unit === 'imperial'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-indigo-600 border-indigo-400 hover:bg-indigo-50'
          }`}
          onClick={() => setUnit('imperial')}
          disabled={loading}
        >
          °F
        </button>
      </div>
    );
  }

  /**
   * ForecastCard Component (Nested)
   * Displays the weather information for a single day.
   * @param {object} props - Component props
   * @param {object} props.day - Weather data object for a specific day
   * @param {string} props.unit - Current selected unit ('metric' or 'imperial')
   */
  function ForecastCard({ day, unit }) {
    return (
      <div className="bg-gray-50 p-4 rounded-xl shadow-md text-center border border-gray-200 flex flex-col items-center justify-between">
        <p className="text-gray-600 font-medium text-lg mb-2">
          {new Date(day.dt_txt).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
          alt="Weather icon"
          className="w-20 h-20 object-contain"
        />
        <p className="text-gray-800 font-bold text-2xl mt-2">
          {Math.round(day.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
        </p>
        <p className="text-sm text-gray-500 mt-1 capitalize">{day.weather[0].description}</p>
      </div>
    );
  }

  /**
   * CurrentWeatherDisplay Component (Nested)
   * Displays the current weather information.
   * @param {object} props - Component props
   * @param {object} props.currentWeather - Current weather data object
   * @param {string} props.unit - Current selected unit ('metric' or 'imperial')
   * @param {string} props.cityName - Formatted city name
   */
  function CurrentWeatherDisplay({ currentWeather, unit, cityName }) {
    if (!currentWeather) return null;

    return (
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-700 mb-2">
          {cityName}
        </h2>
        <div className="flex items-center justify-center mb-4">
          <img
            src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
            alt="Current weather icon"
            className="w-24 h-24 object-contain"
          />
          <p className="text-6xl font-bold text-gray-800 ml-4">
            {Math.round(currentWeather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
          </p>
        </div>
        <p className="text-2xl text-gray-600 capitalize mb-2">
          {currentWeather.weather[0].description}
        </p>
        <div className="text-lg text-gray-500 flex justify-center gap-4">
          <p>Humidity: {currentWeather.main.humidity}%</p>
          <p>Wind: {Math.round(currentWeather.wind.speed)}{unit === 'metric' ? ' m/s' : ' mph'}</p>
        </div>
      </div>
    );
  }


  /**
   * Helper function to get background class based on weather condition.
   * Maps OpenWeatherMap 'main' condition to Tailwind CSS gradient classes.
   * @param {string} condition - The main weather condition (e.g., 'Clear', 'Clouds', 'Rain').
   * @returns {string} Tailwind CSS classes for background gradient.
   */
  const getBackgroundImageClass = (condition) => {
    switch (condition) {
      case 'Clear':
        return 'bg-gradient-to-br from-blue-300 to-blue-500';
      case 'Clouds':
        return 'bg-gradient-to-br from-gray-300 to-gray-500';
      case 'Rain':
      case 'Drizzle':
        return 'bg-gradient-to-br from-indigo-300 to-indigo-600';
      case 'Thunderstorm':
        return 'bg-gradient-to-br from-gray-700 to-gray-900 text-white'; // Added text-white for contrast
      case 'Snow':
        return 'bg-gradient-to-br from-blue-100 to-blue-300';
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Dust':
      case 'Fog':
      case 'Sand':
      case 'Ash':
      case 'Squall':
      case 'Tornado':
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
      default:
        return 'bg-gradient-to-br from-blue-50 to-indigo-100'; // Default background
    }
  };

  /**
   * Fetches both current weather and 5-day forecast data from OpenWeatherMap API.
   * @param {string} cityToSearch - The city name to search for.
   * @param {string} unitToUse - The temperature unit to use.
   */
  const fetchWeatherData = useCallback(async (cityToSearch, unitToUse) => {
    setError('');
    setLoading(true);
    setCurrentWeather(null); // Clear current weather
    setForecast([]); // Clear forecast
    setCityName('');
    setWeatherCondition('');

    // Ensure cityToSearch is a string before trimming
    const processedCityToSearch = String(cityToSearch || '').trim();

    if (!processedCityToSearch) {
      setLoading(false);
      return;
    }

    try {
      // Fetch Current Weather
      const currentWeatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${processedCityToSearch}&appid=${API_KEY}&units=${unitToUse}`
      );
      const currentWeatherData = await currentWeatherRes.json();

      // Fetch 5-day / 3-hour Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${processedCityToSearch}&appid=${API_KEY}&units=${unitToUse}`
      );
      const forecastData = await forecastRes.json();

      let hasError = false;
      let errorMessage = '';

      if (currentWeatherData.cod === 200) {
        setCurrentWeather(currentWeatherData);
        setCityName(`${currentWeatherData.name}, ${currentWeatherData.sys.country}`);
        setWeatherCondition(currentWeatherData.weather[0].main);
      } else {
        hasError = true;
        errorMessage = currentWeatherData.message || 'City not found for current weather.';
      }

      if (forecastData.cod === '200') {
        // Filter for 12:00:00 PM for daily forecast, ensuring it doesn't duplicate current weather if current time is near 12PM
        const dailyData = forecastData.list.filter(item =>
          item.dt_txt.includes('12:00:00')
        );
        setForecast(dailyData);
      } else {
        hasError = true;
        errorMessage = forecastData.message || 'City not found for forecast.';
      }

      if (hasError) {
        setError(errorMessage);
        setCurrentWeather(null);
        setForecast([]);
        setCityName('');
        setWeatherCondition('');
      } else {
        setError(''); // Clear error if both calls are successful
      }

    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setCurrentWeather(null);
      setForecast([]);
      setCityName('');
      setWeatherCondition('');
      setError('Failed to fetch data. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, [unit, API_KEY]); // Dependencies for useCallback

  // Effect hook to refetch forecast when the unit changes, but only after an initial search has been performed.
  useEffect(() => {
    // Only refetch if a search has been explicitly clicked or debounced, and a city is present.
    if (searchClicked && city.trim()) {
      fetchWeatherData(city, unit);
    }
  }, [unit, searchClicked, city, fetchWeatherData]);

  // Function to handle immediate search action (button click or Enter key)
  const handleSearchImmediate = (inputCity = city) => {
    // Ensure inputCity is always treated as a string for safety
    const cityValue = String(inputCity || '').trim();

    // Clear any pending debounced search
    // The debounceTimerRef is now managed within SearchBar, so we don't clear it here.

    // Ensure the city state is up-to-date before fetching
    if (cityValue === '') {
      setError('Please enter a city');
      setCurrentWeather(null);
      setForecast([]);
      setCityName('');
      setLoading(false);
      setSearchClicked(false);
      setWeatherCondition('');
      return;
    }
    fetchWeatherData(cityValue, unit);
    setSearchClicked(true);
  };

  // Function to handle debounced search action (typing in input)
  const handleSearchDebounced = (inputCity) => {
    // Ensure inputCity is always treated as a string for safety
    const cityValue = String(inputCity || '').trim();

    // This function's purpose is now solely to clear previous results
    // when the user is typing or has cleared the input, without fetching.
    setCurrentWeather(null);
    setForecast([]);
    setCityName('');
    setError(''); // Clear any errors
    setLoading(false); // Ensure loading is false
    setSearchClicked(false); // Reset search clicked state
    setWeatherCondition(''); // Clear condition if input is empty
  };

  // Dynamically apply background class based on weather condition
  const backgroundClass = getBackgroundImageClass(weatherCondition);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-all duration-500 ease-in-out ${backgroundClass}`}>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl border border-gray-200 bg-opacity-90 backdrop-filter backdrop-blur-sm">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
            <span role="img" aria-label="weather-icon">🌦</span> Weather App
          </h1>

          {/* Render SearchBar component */}
          <SearchBar
            city={city}
            setCity={setCity}
            onSearchImmediate={handleSearchImmediate}
            onSearchDebounced={handleSearchDebounced}
            loading={loading}
          />

          {/* Render UnitToggle component */}
          <UnitToggle
            unit={unit}
            setUnit={setUnit}
            loading={loading}
          />
        </header>

        {/* Error message display */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center" role="alert">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Current Weather Display */}
        {currentWeather && !loading && (
          <CurrentWeatherDisplay
            currentWeather={currentWeather}
            unit={unit}
            cityName={cityName}
          />
        )}

        {/* Forecast cards display */}
        {forecast.length > 0 && !loading && ( // Only show forecast if not loading
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
            {forecast.map((day, index) => (
              <ForecastCard key={index} day={day} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;