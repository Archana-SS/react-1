from sqlalchemy import Column,Integer,String,DateTime,ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Fault(Base):
    __tablename__="faults"

    id=Column(Integer,primary_key=True,index=True)
    component_id=Column(Integer,ForeignKey("components.id"))
    component=relationship("Component",backref="faults")
    description=Column(String,nullable=False)
    severity=Column(String,nullable=False)
    reported_date=Column(DateTime,default=datetime.utcnow)