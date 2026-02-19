from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.aircraft import Aircraft
from schemas.aircraft import AircraftCreate
from auth.security import require_role

router=APIRouter(prefix="/aircraft",tags=["Aircraft"])

@router.post("/")
def create_aircraft(data:AircraftCreate,db:Session=Depends(get_db)):
    aircraft=Aircraft(**data.dict())
    db.add(aircraft)
    db.commit()
    db.refresh(aircraft)
    return aircraft

@router.get("/", dependencies=[Depends(require_role(["manager"]))])
def get_aircraft(db:Session=Depends(get_db)):
    return db.query(Aircraft).all()

@router.put("/{aircraft_id}")
def update_aircraft(
    aircraft_id: int,
    data: AircraftCreate,
    db: Session = Depends(get_db)
):
    aircraft = db.query(Aircraft).filter(Aircraft.id == aircraft_id).first()

    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")

    aircraft.model = data.model
    aircraft.registration_number = data.registration_number
    aircraft.total_flight_hours = data.total_flight_hours
    aircraft.status = data.status

    db.commit()
    db.refresh(aircraft)
    return aircraft


@router.delete("/{aircraft_id}")
def delete_aircraft(
    aircraft_id: int,
    db: Session = Depends(get_db)
):
    aircraft = db.query(Aircraft).filter(Aircraft.id == aircraft_id).first()

    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")

    if aircraft.components:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete aircraft with components"
        )

    db.delete(aircraft)
    db.commit()
    return {"message": "Aircraft deleted successfully"}
