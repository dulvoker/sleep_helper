# Sleep Helper

A comprehensive sleep analysis application that helps users track their sleep quality and receive personalized recommendations for better rest. Built with FastAPI backend and React frontend.

## Features

- **Sleep Quality Analysis**: Input your sleep data and get a detailed sleep quality score
- **Personalized Recommendations**: Receive actionable recommendations based on your sleep patterns
- **Modern UI**: Clean, minimal design with intuitive time picker and helpful field hints
- **Comprehensive Metrics**: Track bedtime, wake time, sleep duration, awakenings, and sleep stages
- **Real-time Analysis**: Get instant feedback on your sleep quality

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Relational database for data storage
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for running the FastAPI application

### Frontend
- **React**: UI library for building interactive user interfaces
- **Inter Font**: Premium typography for better readability
- **Custom Components**: Built-in time picker with AM/PM support
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
sleep-helper/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── App.js        # Main application component
│   │   ├── App.css       # Application styles
│   │   └── index.js      # Entry point
│   └── package.json      # Frontend dependencies
├── sleep_helper/          # Python backend application
│   ├── main.py           # FastAPI application entry point
│   ├── schemas.py        # Pydantic models for data validation
│   ├── database.py       # Database configuration
│   └── core/
│       └── sleep_score.py # Sleep quality calculation logic
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile            # Backend Docker configuration
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** (for backend setup)
- **Node.js** (v14 or higher) and **npm** (for frontend)
- **Python 3.9+** (if running backend locally)

### Backend Setup

#### Using Docker (Recommended)

1. Make sure Docker and Docker Compose are installed and running
2. Navigate to the project root directory
3. Start the services:
   ```bash
   docker-compose up -d
   ```
4. The API will be available at `http://localhost:8000`
5. API documentation available at `http://localhost:8000/docs`

#### Running Locally

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up PostgreSQL database and configure the connection string in your environment

4. Run the application:
   ```bash
   uvicorn sleep_helper.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application will open at `http://localhost:3000`

## API Endpoints

### POST `/check-sleep-quality`

Analyze sleep quality and get recommendations.

**Request Body:**
```json
{
  "bedtime": "23:30",
  "wake_time": "07:00",
  "tst_min": 420,
  "waso_min": 15,
  "awakenings": 2,
  "deep_min": 90,
  "rem_min": 120,
  "caffeine_after_14": false
}
```

**Response:**
```json
{
  "sleep_quality": "good",
  "sleep_quality_score": 75,
  "sleep_quality_description": "Your sleep quality is good, though there's room for optimization.",
  "sleep_quality_recommendations": [
    "Improve sleep efficiency by reducing time awake in bed...",
    "Reduce wake time after sleep onset..."
  ],
  "sleep_quality_score_explanation": "Duration: 7h 0min | Efficiency: 87.5% | WASO: 15min | Awakenings: 2",
  "sleep_quality_score_recommendations": [...]
}
```

### GET `/health`

Health check endpoint.

### GET `/`

Welcome message.

## Environment Variables

Create a `.env` file in the root directory for local development:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sleephelper
```

## Development

### Backend Development

The backend uses FastAPI with automatic reloading when running with `--reload` flag. API documentation is available at `/docs` endpoint.

### Frontend Development

The frontend uses Create React App with hot module replacement. Changes are reflected immediately in the browser.

## Building for Production

### Backend

The backend is containerized using Docker. Build the image:

```bash
docker build -t sleep-helper-api .
```

### Frontend

Build the frontend for production:

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/build` directory.

## Sleep Quality Scoring

The application calculates sleep quality based on multiple factors:

- **Duration Score** (25%): Based on total sleep time (optimal: 7-9 hours)
- **Efficiency Score** (30%): Ratio of sleep time to time in bed
- **Continuity Score** (30%): Based on wake after sleep onset and number of awakenings
- **Sleep Stages Score** (15%): Based on deep sleep and REM sleep percentages (if provided)
- **Lifestyle Penalty**: -5 points for caffeine consumption after 2 PM

The final score ranges from 0-100:
- **85-100**: Excellent
- **70-84**: Good
- **50-69**: Fair
- **0-49**: Poor

## License

This project is private and proprietary.

## Contributing

This is a private project. For questions or issues, please contact the project maintainer.
