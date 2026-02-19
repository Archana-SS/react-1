from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.aircraft import Aircraft
from models.component import Component
from models.fault import Fault

router=APIRouter(prefix="/dashboard",tags=["Dashboard"])

@router.get("/aircraft-summary")
def aircraft_summary(db:Session=Depends(get_db)):
    total=db.query(Aircraft).count()
    grounded=db.query(Aircraft).filter(Aircraft.status=="GROUNDED").count()

    return {
        "total_aircraft":total,
        "grounded_aircraft":grounded,
        "active_aircraft":total-grounded
    }

@router.get("/component-health")
def component_health(db:Session=Depends(get_db)):
    return {
        "good":db.query(Component).filter(Component.health_status=="Good").count(),
        "warning":db.query(Component).filter(Component.health_status=="Warning").count(),
        "critical":db.query(Component).filter(Component.health_status=="Critical").count(),
    }

@router.get("/maintenance-alerts")
def maintenance_alerts(db:Session=Depends(get_db)):
    components=db.query(Component).all()
    alerts=[]

    for c in components:
        usage=c.current_usage_hours-c.last_maintenance_hours
        if usage>=300:
            alerts.append({
                "component_id":c.id,
                "component":c.name,
                "aircraft_id":c.aircraft_id,
                "usage_hours":usage,
                "health_status":c.health_status
            })

    return alerts


@router.get("/fault-summary")
def fault_summary(db:Session=Depends(get_db)):
    return {
        "low":db.query(Fault).filter(Fault.severity=="Low").count(),
        "medium":db.query(Fault).filter(Fault.severity=="Medium").count(),
        "high":db.query(Fault).filter(Fault.severity=="High").count(),
    }