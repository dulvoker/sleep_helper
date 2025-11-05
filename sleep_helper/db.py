from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = None
SessionLocal = None

if DATABASE_URL:
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 5}
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info("Database connection configured successfully")
    except Exception as e:
        logger.warning(f"Failed to initialize database connection: {e}")
        engine = None
        SessionLocal = None
else:
    logger.info("No DATABASE_URL provided, running without database")


def get_db():
    if SessionLocal is None:
        raise RuntimeError("Database is not configured. Set DATABASE_URL environment variable.")
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def is_database_available():
    return engine is not None

