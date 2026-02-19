from pydantic import BaseModel

class AircraftCreate(BaseModel):
    model:str
    registration_number:str
    total_flight_hours:float=0.0
    status: str = "ACTIVE"

class AircraftResponse(AircraftCreate):
    id:int
    status:str

    class Config:
        from_attributes=True
        