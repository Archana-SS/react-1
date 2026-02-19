from pydantic import BaseModel

class MaintenanceCreate(BaseModel):
    component_id:int
    technician_name:str
    remarks:str|None=None