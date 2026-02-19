from sqlalchemy import Column,Integer,String,Float,ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Component(Base):
    __tablename__="components"

    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,nullable=False)
    aircraft_id=Column(Integer,ForeignKey("aircraft.id"))
    aircraft=relationship("Aircraft",backref="components")
    last_maintenance_hours=Column(Float,default=0.0)
    current_usage_hours=Column(Float,default=0.0)
    health_status=Column(String,nullable=False)