from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.maintenance import MaintenanceLog
from models.component import Component
from schemas.maintenance import MaintenanceCreate
from .utils import calculate_health
from auth.security import require_role

router=APIRouter(prefix="/maintenance",tags=["Maintenance"])

@router.post("/")
def log_maintenance(data:MaintenanceCreate,db: Session = Depends(get_db)):
    component=db.query(Component).get(data.component_id)
    if not component:
        raise HTTPException(status_code=404,detail="Component not found")
    
    component.last_maintenance_hours=component.current_usage_hours
    component.health_status = calculate_health(
        component.current_usage_hours,
        component.last_maintenance_hours
    )

    log=MaintenanceLog(
        component_id=data.component_id if component else None, 
        technician_name=data.technician_name,
        remarks=data.remarks
    )

    db.add(log)
    db.commit()
    return {"message":"Maintenance logged & component reset"}

@router.get("/", dependencies=[Depends(require_role(["manager", "employee"]))])
def get_maintenance_logs(db: Session = Depends(get_db)):
    return db.query(MaintenanceLog).order_by(MaintenanceLog.maintenance_date.desc()).all()
