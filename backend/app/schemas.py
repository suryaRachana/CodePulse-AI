from pydantic import BaseModel
class UserCreate(BaseModel):
    name: str
    email: str 
    password: str

class UserLogin(BaseModel):
    email:str 
    password:str 
class DashboardResponse(BaseModel):
    health_score: int
    technical_debt_score: int
    total_projects: int
    last_scan: str



class PredictionRequest(BaseModel):
    project_name: str
    lines_of_code: int


class PredictionResponse(BaseModel):
    project_name: str
    health_score: int
    technical_debt_score: int
    recommendation: str