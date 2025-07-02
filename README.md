# 🌦 Interactive Weather Forecast Application

## ✨ Live Demo

Explore the live application here: **[Your Live Demo URL Here]**
*(Remember to replace `[Your Live Demo URL Here]` with the actual URL after you deploy it on Netlify, Vercel, or GitHub Pages!)*

## 📄 Overview

This is a responsive web application built with React.js that provides real-time current weather conditions and a 5-day forecast for any city around the globe. It features a dynamic user interface that adapts to different weather conditions and offers a smooth user experience.

## 🚀 Features

* **Current Weather Display:** Shows real-time temperature, conditions, humidity, and wind speed for the searched city.
* **5-Day Forecast:** Provides a daily forecast (at 12:00 PM) for the next five days.
* **Unit Toggle:** Easily switch between Celsius (°C) and Fahrenheit (°F) temperature units.
* **Debounced Search:** Optimizes API calls by delaying the search until the user pauses typing, preventing unnecessary requests and improving performance.
* **Dynamic Backgrounds:** The application's background visually changes to reflect the current weather conditions (e.g., clear skies, clouds, rain).
* **Responsive Design:** Optimized for seamless viewing and interaction across various devices (desktops, tablets, mobile phones).
* **Clear UI Feedback:** Input fields and buttons are disabled during data fetching to indicate loading.

## 🛠 Technologies Used

* **Frontend:**
    * [React.js](https://react.dev/): A JavaScript library for building user interfaces.
    * [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript): Core programming language.
    * [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML): Structure of the web pages.
    * [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
* **API:**
    * [OpenWeatherMap API](https://openweathermap.org/api): Used for fetching current weather data and 5-day / 3-hour forecast data.
* **React Hooks:**
    * `useState`: For managing component state.
    * `useEffect`: For handling side effects like data fetching.
    * `useRef`: For persisting values across renders (e.g., debounce timer).
    * `useCallback`: For memoizing functions to optimize performance.

## ⚙️ Setup and Installation (Local Development)

To run this project locally on your machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/angras2881/react-weather-app.git](https://github.com/angras2881/react-weather-app.git)
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd react-weather-app
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The app will open in your browser at `http://localhost:3000`.

## 💡 How to Use

1.  **Enter City Name:** Type the name of a city into the search bar.
2.  **Search:** Press `Enter` or click the "Search" button.
3.  **View Weather:** The current weather conditions and a 5-day forecast for the entered city will be displayed.
4.  **Change Units:** Use the "°C" and "°F" buttons to switch between Celsius and Fahrenheit.

## 🤝 Contributing

Feel free to fork this repository, open issues, or submit pull requests if you have suggestions for improvements or bug fixes!

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## ✉️ Contact

* **GitHub:** [angras2881](https://github.com/angras2881)
* **LinkedIn:** [Your LinkedIn Profile URL (Optional)]

---
