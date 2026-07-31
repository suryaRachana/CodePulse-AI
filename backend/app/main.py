from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, SessionLocal
from app import models
from app.schemas import UserCreate, UserLogin,DashboardResponse,PredictionRequest, PredictionResponse,HistoryResponse
from app.auth import create_user, login_user,create_access_token,get_current_user,verify_token
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    

@app.get("/dashboard", response_model=DashboardResponse)
def get_dashboard():

    return {
        "health_score": 92,
        "technical_debt_score": 18,
        "total_projects": 5,
        "last_scan": "2026-07-29"
    }



@app.post("/analyze-project", response_model=PredictionResponse)
def analyze_project(
    request: PredictionRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return predict(request, current_user, db)


@app.get("/latest-analysis")
def latest_analysis(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    if not db_user:
        return {
            "message": "User not found"
        }

    latest = db.query(models.ProjectAnalysis).filter(
        models.ProjectAnalysis.user_id == db_user.id
    ).order_by(
        models.ProjectAnalysis.id.desc()
    ).first()

    if not latest:
        return {
            "message": "No analysis found"
        }

    return latest

@app.get("/history-chart")
def history_chart(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    if not db_user:
        return []

    history = db.query(models.ProjectAnalysis).filter(
        models.ProjectAnalysis.user_id == db_user.id
    ).order_by(
        models.ProjectAnalysis.id
    ).all()

    return [
        {
            "project": item.project_name,
            "health_score": item.health_score
        }
        for item in history
    ]

@app.get("/history-chart")
def get_history_chart(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    if not db_user:
        return []

    history = db.query(models.ProjectAnalysis).filter(
        models.ProjectAnalysis.user_id == db_user.id
    ).order_by(
        models.ProjectAnalysis.id.asc()
    ).all()

    return [
        {
            "project": analysis.project_name,
            "health_score": analysis.health_score
        }
        for analysis in history
    ]


@app.get("/history", response_model=list[HistoryResponse])
def get_history(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    if not db_user:
        return []

    history = db.query(models.ProjectAnalysis).filter(
        models.ProjectAnalysis.user_id == db_user.id
    ).all()

    return history



@app.get("/history/{id}", response_model=HistoryResponse)
def get_history_by_id(
    id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    if not db_user:
        return {
            "message": "User not found"
        }

    analysis = db.query(models.ProjectAnalysis).filter(
        models.ProjectAnalysis.id == id,
        models.ProjectAnalysis.user_id == db_user.id
    ).first()

    if not analysis:
        return {
            "message": "Analysis not found"
        }

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

@app.post("/predict", response_model=PredictionResponse)
def predict(
    request: PredictionRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("Current User Email:", current_user)
    print("Current User Type:", type(current_user))

    # Get logged-in user
    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    if not db_user:
        return {
            "message": "User not found"
        }

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
    
    print("DB User ID:", db_user.id)
    
    # Save analysis to database
    analysis = models.ProjectAnalysis(
        project_name=request.project_name,
        health_score=health_score,
        technical_debt_score=technical_debt_score,
        risk_level=risk_level,
        recommendation=recommendation,
        user_id=db_user.id
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    print("Saved user_id =", analysis.user_id)

    return {
        "project_name": request.project_name,
        "health_score": health_score,
        "technical_debt_score": technical_debt_score,
        "risk_level": risk_level,
        "recommendation": recommendation
    }