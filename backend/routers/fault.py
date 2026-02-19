from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.fault import Fault
from models.component import Component
from schemas.fault import FaultCreate
from auth.security import require_role

router =APIRouter(prefix="/faults",tags=["Faults"])

@router.post("/", dependencies=[Depends(require_role(["employee"]))])
def report_fault(data:FaultCreate,db: Session = Depends(get_db)):
    component=db.query(Component).get(data.component_id)
    if not component:
        raise HTTPException(status_code=404,detail="Component not found")
    
    if data.severity=="High":
        component.health_status="Critical"

    elif data.severity=="Medium":
        component.health_status="Warning"

    fault=Fault(**data.dict())
    db.add(fault)
    db.commit()
    return {"message":"Fault reported"}

@router.get("/")  
def get_faults(db: Session = Depends(get_db)):
    """
    Fetch all faults from the database.
    """
    faults = db.query(Fault).all()
    return faults