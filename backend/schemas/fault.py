from pydantic import BaseModel

class FaultCreate(BaseModel):
    component_id:int
    description:str
    severity:str