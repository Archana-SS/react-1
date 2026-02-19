from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.component import Component
from schemas.component import ComponentCreate
from routers.utils import calculate_health

router=APIRouter(prefix="/components",tags=["Components"])

@router.post("/")
def add_components(data:ComponentCreate,db: Session = Depends(get_db)):
    health=calculate_health(
        data.current_usage_hours,
        data.last_maintenance_hours
    )

    component=Component(
        name=data.name,
        aircraft_id=data.aircraft_id,
        last_maintenance_hours=data.last_maintenance_hours,
        current_usage_hours=data.current_usage_hours,
        health_status=health
    )

    db.add(component)
    db.commit()
    db.refresh(component)
    return component

@router.get("/")
def get_components(db: Session = Depends(get_db)):
    return db.query(Component).all()

@router.put("/{component_id}")
def update_component(
    component_id: int,
    data: ComponentCreate,
    db: Session = Depends(get_db)
):
    component = db.query(Component).filter(Component.id == component_id).first()

    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    component.name = data.name
    component.aircraft_id = data.aircraft_id
    component.current_usage_hours = data.current_usage_hours
    component.last_maintenance_hours = data.last_maintenance_hours

    component.health_status = calculate_health(
        component.current_usage_hours,
        component.last_maintenance_hours
    )

    db.commit()
    db.refresh(component)
    return component


@router.delete("/{component_id}")
def delete_component(
    component_id: int,
    db: Session = Depends(get_db)
):
    component = db.query(Component).filter(Component.id == component_id).first()

    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    db.delete(component)
    db.commit()
    return {"message": "Component deleted successfully"}
