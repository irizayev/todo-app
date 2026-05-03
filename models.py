from pydantic import BaseModel
from typing import Optional

class Task(BaseModel):
  id: Optional[int] = None
  title: str
  description: str = ''
  date: Optional[str] = None
