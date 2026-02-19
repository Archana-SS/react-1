from sqlalchemy import Column,Integer,String,DateTime,ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from sqlalchemy.sql import func

class MaintenanceLog(Base):
    __tablename__="maintenance_logs"

    id=Column(Integer,primary_key=True,index=True)
    component_id=Column(Integer,ForeignKey("components.id",ondelete="SET NULL"),nullable=True)
    #component_name = Column(String, nullable=False)
    component=relationship("Component",backref="maintenance_logs")
    #maintenance_date=Column(DateTime(timezone=True),server_default=func.now())
    maintenance_date = Column(DateTime, default=datetime.utcnow)
    technician_name=Column(String,nullable=False)
    remarks=Column(String)