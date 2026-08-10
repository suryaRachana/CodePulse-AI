from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str 
    password: str

class UserLogin(BaseModel):
    email:str 
    password:str 

class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
class DashboardResponse(BaseModel):
    health_score: int
    technical_debt_score: int
    total_projects: int
    last_scan: str



class PredictionRequest(BaseModel):
    project_name: str
    lines_of_code: int
    code_complexity:int
    bugs:int 
    code_duplication:int 


class PredictionResponse(BaseModel):
    project_name: str
    health_score: int
    technical_debt_score: int
    risk_level:str 
    recommendation: str 
    

class RepositoryAnalysisRequest(BaseModel):
    repository_url: str

class HistoryResponse(BaseModel):
    id: int
    project_name: str
    health_score: int
    technical_debt_score: int
    risk_level: str
    recommendation: str

    class Config:
        from_attributes = True


class RepositoryPredictionRequest(BaseModel):
    repository_url: str


class RefactorRequest(BaseModel):
    code: str
    language: str = "python"
    repository_id: Optional[int] = None


class RefactorResponse(BaseModel):
    original_code: str
    refactored_code: str
    issue_description: str
    complexity_reduction: float
    maintainability_increase: float
    technical_debt_reduction: float



    