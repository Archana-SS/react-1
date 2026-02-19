from pydantic import BaseModel

class ComponentCreate(BaseModel):
    name:str
    aircraft_id:int
    last_maintenance_hours: float=0.0
    current_usage_hours:float=0.0
    
class ComponentResponse(ComponentCreate):
    id:int
    health_status:str

    class Config:
        from_attributes=True