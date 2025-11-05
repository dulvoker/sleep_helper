from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine, is_database_available
from .schemas import SleepInput, SleepOutput
from .core.sleep_score import calculate_sleep_score
import logging

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sleep Helper API",
    description="A FastAPI application for Sleep Helper",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    if is_database_available() and engine is not None:
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize database tables: {e}")
    else:
        logger.info("Running without database - database initialization skipped")


@app.get("/")
async def root():
    return {"message": "Welcome to Sleep Helper API"}


@app.post("/check-sleep-quality")
async def check_sleep_quality(sleep_input: SleepInput) -> SleepOutput:
    quality = calculate_sleep_score(sleep_input)
    return quality

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

