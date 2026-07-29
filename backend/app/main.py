from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import engine, SessionLocal
from app import models
from app.schemas import UserCreate, UserLogin,DashboardResponse,PredictionRequest, PredictionResponse,HistoryResponse
from app.auth import create_user, login_user,create_access_token,get_current_user
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "CodePulse AI Backend Running"
    }


@app.get("/test-db")
def test_database():
    try:
        connection = engine.connect()
        connection.close()

        return {
            "message": "Database connection successful"
        }

    except Exception as e:
        return {
            "error": str(e)
        }


@app.post("/register")
def register_user(user: UserCreate):

    db = SessionLocal()

    new_user = create_user(db, user)

    db.close()

    return {
        "message": "User registered successfully",
        "user": new_user.email
    }

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = UserLogin(
        email=form_data.username,
        password=form_data.password
    )

    db_user = login_user(db, user)

    if not db_user:
        return {
            "message": "Invalid email or password"
        }

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get("/profile")
def get_profile(current_user: str = Depends(get_current_user)):
    return {
        "message": "Protected Route Accessed Successfully",
        "email": current_user
    }


@app.get("/dashboard", response_model=DashboardResponse)
def get_dashboard():

    return {
        "health_score": 92,
        "technical_debt_score": 18,
        "total_projects": 5,
        "last_scan": "2026-07-29"
    }




@app.post("/predict", response_model=PredictionResponse)
def predict(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):

    health_score = 100

    # Lines of Code
    if request.lines_of_code > 5000:
        health_score -= 10

    # Code Complexity
    if request.code_complexity > 50:
        health_score -= 20

    # Bugs
    if request.bugs > 10:
        health_score -= 20

    # Code Duplication
    if request.code_duplication > 20:
        health_score -= 15

    # Prevent negative score
    if health_score < 0:
        health_score = 0

    technical_debt_score = 100 - health_score

    # Risk Level
    if technical_debt_score <= 20:
        risk_level = "Low"
    elif technical_debt_score <= 40:
        risk_level = "Medium"
    elif technical_debt_score <= 60:
        risk_level = "High"
    else:
        risk_level = "Critical"

    # Recommendation
    if health_score >= 90:
        recommendation = "Excellent Code Quality"
    elif health_score >= 75:
        recommendation = "Good Code Quality"
    elif health_score >= 60:
        recommendation = "Average Code Quality"
    elif health_score >= 40:
        recommendation = "Poor Code Quality"
    else:
        recommendation = "Critical! Immediate Refactoring Required"

    # Save to Database
    analysis = models.ProjectAnalysis(
        project_name=request.project_name,
        health_score=health_score,
        technical_debt_score=technical_debt_score,
        risk_level=risk_level,
        recommendation=recommendation
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "project_name": request.project_name,
        "health_score": health_score,
        "technical_debt_score": technical_debt_score,
        "risk_level": risk_level,
        "recommendation": recommendation
    }


@app.post("/analyze-project", response_model=PredictionResponse)
def analyze_project(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):
    return predict(request, db)





@app.get("/history", response_model=list[HistoryResponse])
def get_history(db: Session = Depends(get_db)):

    history = db.query(models.ProjectAnalysis).all()

    return history 




@app.get("/history/{id}", response_model=HistoryResponse)
def get_history_by_id(
    id: int,
    db: Session = Depends(get_db)
):

    analysis = db.query(models.ProjectAnalysis).filter(
        models.ProjectAnalysis.id == id
    ).first()

    return analysis  





@app.delete("/history/{id}")
def delete_history(
    id: int,
    db: Session = Depends(get_db)
):

    analysis = db.query(models.ProjectAnalysis).filter(
        models.ProjectAnalysis.id == id
    ).first()

    if not analysis:
        return {
            "message": "Analysis not found"
        }

    db.delete(analysis)
    db.commit()

    return {
        "message": "Analysis deleted successfully"
    }