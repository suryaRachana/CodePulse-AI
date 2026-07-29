from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import engine, SessionLocal
from app import models
from app.schemas import UserCreate, UserLogin
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
