from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app import models, schemas
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

from app.database import SessionLocal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")



def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_user(db: Session, user: schemas.UserCreate):

    normalized_email = user.email.strip().lower()

    existing_user = db.query(models.User).filter(
        models.User.email == normalized_email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    db_user = models.User(
        name=user.name,
        email=normalized_email,
        hashed_password=hashed_password
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user



def login_user(db: Session, user: schemas.UserLogin):
    
    normalized_email = user.email.strip().lower()

    db_user = db.query(models.User).filter(
        models.User.email == normalized_email
    ).first()

    if not db_user:
        return None

    if not verify_password(user.password, db_user.hashed_password):
        return None

    return db_user 



def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
   
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt 




def verify_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            return None

        return email

    except JWTError:
        return None




def get_current_user(token: str = Depends(oauth2_scheme)):
    email = verify_token(token)

    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return email


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
