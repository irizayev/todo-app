from sqlalchemy import Column, Integer, String, Float

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
class Task(Base):

  __tablename__= "Task"

  id = Column(Integer, primary_key=True, index=True)
  title = Column(String)
  description= Column(String)
  date = Column(String)