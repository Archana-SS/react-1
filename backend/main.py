from fastapi import FastAPI
from database import Base,engine,get_db
from models.aircraft import Aircraft
from models.component import Component
from models.maintenance import MaintenanceLog
from models.fault import Fault
from fastapi.middleware.cors import CORSMiddleware
from routers import aircraft,component,maintenance,fault,dashboard
from routers import auth
from pydantic import BaseModel
from auth_utils import hash_password, verify_password
from auth.security import create_access_token
from models.user import User
from schemas.auth_schemas import RegisterRequest, LoginRequest

app=FastAPI(title="Aircraft Maintenance System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message":"Aircraft Maintenance API running"}

app.include_router(aircraft.router)
app.include_router(component.router)
app.include_router(maintenance.router)
app.include_router(fault.router)
app.include_router(dashboard.router)