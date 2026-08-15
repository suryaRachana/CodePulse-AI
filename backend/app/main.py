import os
import ast
import re
import secrets

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, SessionLocal
from app import models
from app.schemas import (
    UserCreate,
    UserLogin,
    GoogleLoginRequest,
    DashboardResponse,
    PredictionRequest,
    PredictionResponse,
    HistoryResponse,
    RepositoryAnalysisRequest,
    RepositoryPredictionRequest,
    UserProfileResponse,
    RefactorRequest,
    RefactorResponse,
)
from app.auth import (
    create_user,
    login_user,
    create_access_token,
    get_current_user,
    verify_token,
    hash_password,
)
from fastapi.security import OAuth2PasswordRequestForm
from app.services.github_service import (
    get_repository_info,
    get_repository_metrics,
    count_functions_and_classes,
    calculate_complexity,
    calculate_maintainability_index,
    calculate_duplicate_code,
    calculate_repository_health,
    GitHubRateLimitError,
    GitHubNotFoundError,
    GitHubAPIError,
)
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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


@app.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )

    return db_user


def analyze_and_refactor_python_code(code: str) -> dict:
    try:
        parsed_ast = ast.parse(code)
    except SyntaxError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Python syntax: {e.msg} at line {e.lineno}"
        )

    # 1. Simple list accumulator pattern
    accumulator_pattern = re.compile(
        r"def\s+(?P<func_name>\w+)\s*\((?P<arg>\w+)\):\s*\n"
        r"\s*(?P<var>\w+)\s*=\s*\[\]\s*\n"
        r"\s*for\s+(?P<item>\w+)\s+in\s+(?P=arg):\s*\n"
        r"\s*if\s+(?P<item2>\w+)\.(?P<cond>\w+):\s*\n"
        r"\s*(?P=var)\.append\((?P=item2)\)\s*\n"
        r"\s*return\s+(?P=var)",
        re.MULTILINE
    )
    match = accumulator_pattern.search(code)
    if match and match.group("item") == match.group("item2"):
        func_name = match.group("func_name")
        arg = match.group("arg")
        item = match.group("item")
        cond = match.group("cond")
        refactored = f"def {func_name}({arg}):\n    return [{item} for {item} in {arg} if {item}.{cond}]"
        return {
            "refactored_code": refactored,
            "issue_description": "Estimated rule-based optimization: Simplifies loop accumulator into a clean Pythonic list comprehension.",
            "complexity_reduction": 32.0,
            "maintainability_increase": 28.0,
            "technical_debt_reduction": 24.0
        }

    # 2. Check for nested if statements (depth >= 2)
    max_if_depth = 0
    for node in ast.walk(parsed_ast):
        if isinstance(node, ast.If):
            depth = 1
            curr = node
            while hasattr(curr, "body") and len(curr.body) == 1 and isinstance(curr.body[0], ast.If):
                depth += 1
                curr = curr.body[0]
            if depth > max_if_depth:
                max_if_depth = depth

    if max_if_depth >= 2:
        lines = code.splitlines()
        refactored_lines = []
        for line in lines:
            if re.search(r"if\s+.*:\s*$", line) and "return" not in line:
                refactored_lines.append(line.replace("if ", "if not ") + " # Guard clause suggested")
            else:
                refactored_lines.append(line)
        return {
            "refactored_code": "\n".join(refactored_lines),
            "issue_description": "Estimated rule-based optimization: Replaces deeply nested conditional blocks with early exit guard clauses.",
            "complexity_reduction": 35.0,
            "maintainability_increase": 30.0,
            "technical_debt_reduction": 25.0
        }

    # 3. Check for redundant boolean comparison (== True / == False)
    if re.search(r"==\s*True|==\s*False", code):
        refactored = re.sub(r"==\s*True", "", code)
        refactored = re.sub(r"==\s*False", " is False", refactored)
        return {
            "refactored_code": refactored,
            "issue_description": "Estimated rule-based optimization: Simplifies redundant boolean comparisons.",
            "complexity_reduction": 20.0,
            "maintainability_increase": 25.0,
            "technical_debt_reduction": 18.0
        }

    # 4. Default fallback if no safe rule matched
    return {
        "refactored_code": code,
        "issue_description": "No safe automatic rule-based refactoring was identified for this code snippet. Code structure is acceptable.",
        "complexity_reduction": 0.0,
        "maintainability_increase": 0.0,
        "technical_debt_reduction": 0.0
    }


@app.post("/refactor-suggestion", response_model=RefactorResponse)
def get_refactor_suggestion(
    payload: RefactorRequest,
    current_user: str = Depends(get_current_user)
):
    if not payload.code or not payload.code.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code snippet cannot be empty."
        )

    lang = (payload.language or "python").lower()
    if lang not in ["python", "py"]:
        return RefactorResponse(
            original_code=payload.code,
            refactored_code=payload.code,
            issue_description=f"Automatic refactoring is currently optimized for Python. For language '{payload.language}', no safe transformation was applied.",
            complexity_reduction=0.0,
            maintainability_increase=0.0,
            technical_debt_reduction=0.0
        )

    result = analyze_and_refactor_python_code(payload.code)

    return RefactorResponse(
        original_code=payload.code,
        refactored_code=result["refactored_code"],
        issue_description=result["issue_description"],
        complexity_reduction=result["complexity_reduction"],
        maintainability_increase=result["maintainability_increase"],
        technical_debt_reduction=result["technical_debt_reduction"]
    )


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
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    new_user = create_user(db, user)

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


@app.post("/auth/google")
def google_auth(
    payload: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    if not payload.id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google ID token is required"
        )

    google_client_id = os.getenv("GOOGLE_CLIENT_ID")

    try:
        id_info = google_id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            audience=google_client_id if google_client_id else None
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google ID token: {str(e)}"
        )

    if not id_info.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google email is not verified"
        )

    raw_email = id_info.get("email")
    if not raw_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not provided by Google token"
        )

    normalized_email = raw_email.strip().lower()
    name = id_info.get("name") or normalized_email.split("@")[0]

    db_user = db.query(models.User).filter(
        models.User.email == normalized_email
    ).first()

    if not db_user:
        # Create user with a secure random password hash to satisfy hashed_password NOT NULL constraint
        random_pwd = secrets.token_urlsafe(32)
        hashed_pwd = hash_password(random_pwd)

        db_user = models.User(
            name=name,
            email=normalized_email,
            hashed_password=hashed_pwd
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

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




@app.post("/analyze-repository")
def analyze_repository(
    request: RepositoryAnalysisRequest,
    current_user: str = Depends(get_current_user),
):
    try:
        repository_info = get_repository_info(
            request.repository_url
        )

        repository_metrics = get_repository_metrics(
            request.repository_url,
            repository_info["default_branch"]
        )
        code_structure = count_functions_and_classes(
            request.repository_url,
            repository_info["default_branch"]
        )
        complexity_data = calculate_complexity(
            request.repository_url,
          
          
            repository_info["default_branch"]
        )
        maintainability_data = calculate_maintainability_index(
            request.repository_url,
            repository_info["default_branch"]
        )
        duplicate_code_data = calculate_duplicate_code(
            request.repository_url,
            repository_info["default_branch"]
        )
        health_data = calculate_repository_health(
            repository_metrics["lines_of_code"],
            complexity_data["cyclomatic_complexity"],
            maintainability_data["maintainability_index"],
            duplicate_code_data["duplicate_code_percentage"]
        )
        return {
            "message": "Repository analyzed successfully",
            "repository_url": request.repository_url,
            "user": current_user,
            "repository": repository_info,
            "metrics": repository_metrics,
            "code_structure": code_structure,
            "complexity": complexity_data,
            "maintainability": maintainability_data,
            "duplicate_code": duplicate_code_data,
            "prediction": health_data
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except GitHubNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except GitHubRateLimitError as e:
        raise HTTPException(
            status_code=429,
            detail=str(e)
        )

    except GitHubAPIError as e:
        raise HTTPException(
            status_code=502,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze repository"
        )



@app.post("/predict-repository")
def predict_repository(
    request: RepositoryPredictionRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        repository_info = get_repository_info(
            request.repository_url
        )

        repository_metrics = get_repository_metrics(
            request.repository_url,
            repository_info["default_branch"]
        )

        code_structure = count_functions_and_classes(
            request.repository_url,
            repository_info["default_branch"]
        )

        complexity_data = calculate_complexity(
            request.repository_url,
            repository_info["default_branch"]
        )

        maintainability_data = calculate_maintainability_index(
            request.repository_url,
            repository_info["default_branch"]
        )

        duplicate_code_data = calculate_duplicate_code(
            request.repository_url,
            repository_info["default_branch"]
        )

        health_data = calculate_repository_health(
            repository_metrics["lines_of_code"],
            complexity_data["cyclomatic_complexity"],
            maintainability_data["maintainability_index"],
            duplicate_code_data["duplicate_code_percentage"]
        )

        db_user = db.query(models.User).filter(
            models.User.email == current_user
        ).first()

        if not db_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        analysis = models.ProjectAnalysis(
            project_name=repository_info["name"],
            health_score=health_data["health_score"],
            technical_debt_score=health_data["technical_debt_score"],
            risk_level=health_data["risk_level"],
            recommendation=health_data["recommendation"],
            user_id=db_user.id
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return {
            "repository": repository_info,
            "metrics": repository_metrics,
            "code_structure": code_structure,
            "complexity": complexity_data,
            "maintainability": maintainability_data,
            "duplicate_code": duplicate_code_data,
            "prediction": health_data
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except GitHubNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except GitHubRateLimitError as e:
        raise HTTPException(status_code=429, detail=str(e))
    except GitHubAPIError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to predict repository"
        )




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