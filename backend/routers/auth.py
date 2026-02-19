'''from fastapi import APIRouter
from auth.security import create_access_token

router = APIRouter(prefix="/login", tags=["Auth"])

@router.post("/")
def login(username: str, role: str):
    """
    Demo login: accepts role directly
    """
    token = create_access_token({
        "sub": username,
        "role": role
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role
    }
'''

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from auth_utils import verify_password
from auth.security import create_access_token

from schemas.auth_schemas import LoginRequest

router = APIRouter(prefix="/login", tags=["Auth"])


@router.post("/")
def login(request: LoginRequest, db: Session = Depends(get_db)):

    #user = db.query(User).filter(User.username == request.username).first()
    user = db.query(User).filter(
        User.username == request.username.strip()
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid username")

    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({
        "sub": user.username,
        "role": user.role.lower()
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username
    }

from schemas.auth_schemas import RegisterRequest
from auth_utils import hash_password

@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
    username=request.username,
    hashed_password=hash_password(request.password),
    role=request.role.lower()  # store all roles in lowercase
)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

