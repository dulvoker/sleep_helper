from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sleep_helper.database import Base, engine


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


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

