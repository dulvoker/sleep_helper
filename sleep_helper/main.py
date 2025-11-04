from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .schemas import SleepInput, SleepOutput


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
    Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "Welcome to Sleep Helper API"}


@app.post("/check-sleep-quality")
async def check_sleep_quality(sleep_input: SleepInput) -> SleepOutput:

    return SleepOutput(
        sleep_quality="good",
        sleep_quality_score=85,
        sleep_quality_description="You slept well last night",
        sleep_quality_recommendations=["Try to go to bed earlier", "Try to wake up at the same time every day"],
        sleep_quality_score_explanation="You slept well last night",
        sleep_quality_score_recommendations=["Try to go to bed earlier", "Try to wake up at the same time every day"]
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

