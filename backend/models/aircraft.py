from sqlalchemy import Column,Integer,String,Float
from database import Base

class Aircraft(Base):
    __tablename__="aircraft"

    id=Column(Integer,primary_key=True,index=True)
    model=Column(String,nullable=False)
    registration_number=Column(String,unique=True,nullable=False)
    total_flight_hours=Column(Float,default=0.0)
    status=Column(String,default="Active")
    