from sqlalchemy import Column, Integer, String, DateTime,ForeignKey
from sqlalchemy.sql import func
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False, index=True)

    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    projects = relationship("ProjectAnalysis", back_populates="user")



class ProjectAnalysis(Base):
    __tablename__ = "project_analysis"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    health_score = Column(Integer)
    technical_debt_score = Column(Integer)
    risk_level = Column(String)
    recommendation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="projects")