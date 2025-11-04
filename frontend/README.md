# Sleep Helper Frontend

A modern React application for analyzing sleep quality and receiving personalized recommendations. Features a clean, minimal design with intuitive user interface.

## Features

- **Custom Time Picker**: 12-hour format with AM/PM support for easy time selection
- **Sleep Quality Analysis**: Enter sleep data and get instant analysis with detailed scores
- **Personalized Recommendations**: Receive actionable recommendations based on your sleep patterns
- **Field Hints**: Helpful explanations for each field to ensure accurate data entry
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- **React 19.2.0**: Modern React library for building user interfaces
- **Inter Font**: Google Fonts for premium typography
- **CSS3**: Custom styling with animations and transitions
- **Fetch API**: For communicating with the backend API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically reload when you make changes to the code.

## Available Scripts

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. The build is optimized and ready for deployment.

### `npm run eject`

**Note: This is a one-way operation. Once you eject, you can't go back!**

Ejects from Create React App, giving you full control over the configuration.

## Project Structure

```
frontend/
├── public/              # Static assets
│   ├── index.html      # HTML template
│   └── manifest.json   # PWA manifest
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
└── package.json        # Dependencies and scripts
```

## Components

### TimePicker

A custom time picker component with:
- 12-hour format display (e.g., "10:30 PM")
- AM/PM selector
- Hour and minute dropdowns
- Automatic conversion to 24-hour format for API
- Smooth animations and transitions

### Form Fields

The application includes the following form fields:

- **Bedtime**: Time you went to sleep (custom time picker)
- **Wake Time**: Time you woke up (custom time picker)
- **Total Sleep Time**: Actual time spent sleeping in minutes
- **Wake After Sleep Onset (WASO)**: Total minutes awake after falling asleep
- **Number of Awakenings**: Count of how many times you woke up
- **Deep Sleep**: Optional - time spent in deep sleep stage
- **REM Sleep**: Optional - time spent in REM sleep stage
- **Caffeine After 2 PM**: Checkbox for caffeine consumption

Each field includes helpful hints explaining what data to enter.

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`.

### Endpoint

- **POST** `/check-sleep-quality`: Submits sleep data and receives analysis

### Request Format

```javascript
{
  bedtime: "23:30",        // 24-hour format (HH:MM)
  wake_time: "07:00",     // 24-hour format (HH:MM)
  tst_min: 420,           // Total sleep time in minutes
  waso_min: 15,           // Wake after sleep onset in minutes
  awakenings: 2,          // Number of awakenings
  deep_min: 90,           // Deep sleep in minutes (optional)
  rem_min: 120,           // REM sleep in minutes (optional)
  caffeine_after_14: false // Caffeine after 2 PM
}
```

## Styling

The application uses a custom CSS design system with:

- **Dark Theme**: Deep blue-gray background (#0a1929)
- **Typography**: Inter font family for clean, readable text
- **Color Palette**: 
  - Primary: White and light gray text
  - Accents: Blue tones for interactive elements
  - Quality Scores: Green (excellent), Yellow (fair), Red (poor)
- **Animations**: Smooth transitions and fade-in effects
- **Responsive**: Mobile-first design with breakpoints at 768px

## Environment Configuration

The API URL is configured in `src/App.js`:

```javascript
const API_URL = 'http://localhost:8000';
```

For production, update this to your production API URL.

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The `build` folder contains the optimized production build.

3. Deploy the `build` folder to your hosting service (e.g., Netlify, Vercel, AWS S3).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting for optimal loading
- Lazy loading where applicable
- Optimized images and assets
- Minified production builds

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [Inter Font](https://fonts.google.com/specimen/Inter)

## License

This project is private and proprietary.
