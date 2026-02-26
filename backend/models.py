from sqlalchemy import Column, Integer, Float, String
from database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(Float)
    vibration = Column(Float)
    current = Column(Float)
    voltage = Column(Float)
    hours = Column(Float)
    risk = Column(String)
    probability = Column(Float)