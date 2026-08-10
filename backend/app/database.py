import os
from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base

DEFAULT_LOCAL_DB = "postgresql://postgres:02122007@localhost:5432/codepulse_ai"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_LOCAL_DB)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()