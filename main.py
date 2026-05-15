import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from models import Task
from database import session, engine
import database_models
from sqlalchemy.orm import Session
from sqlalchemy import text

app = FastAPI()

def migrate_db():
  with engine.connect() as conn:
    col_type = conn.execute(text(
      "SELECT data_type FROM information_schema.columns "
      "WHERE table_name='Task' AND column_name='date'"
    )).scalar()
    if col_type == 'integer':
      conn.execute(text('ALTER TABLE "Task" ALTER COLUMN date TYPE VARCHAR USING date::VARCHAR'))
      conn.commit()

migrate_db()
database_models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
  db = session()
  try:
    yield db
  finally:
    db.close()



@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
  return db.query(database_models.Task).all()


@app.get("/task/{id}")
def get_task_by_id(id: int, db: Session = Depends(get_db)):
  task = db.query(database_models.Task).filter(database_models.Task.id == id).first()
  if task:
    return task
  raise HTTPException(status_code=404, detail="not found")


@app.post("/task")
def add_task(task: Task, db: Session = Depends(get_db)):
  db_task = database_models.Task(**task.model_dump(exclude_none=True))
  db.add(db_task)
  db.commit()
  db.refresh(db_task)
  return db_task


@app.put("/task")
def update_task(id: int, task: Task, db: Session = Depends(get_db)):
  db_task = db.query(database_models.Task).filter(database_models.Task.id == id).first()
  if not db_task:
    raise HTTPException(status_code=404, detail="not found")
  db_task.title = task.title
  db_task.description = task.description
  db_task.date = task.date
  db.commit()
  db.refresh(db_task)
  return db_task


@app.delete("/task")
def delete_task(id: int, db: Session = Depends(get_db)):
  deleted = db.query(database_models.Task).filter(database_models.Task.id == id).delete()
  if deleted == 0:
    raise HTTPException(status_code=404, detail="not found")
  db.commit()
  return {"ok": True}


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE_DIR, "frontend", "dist")


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
  if full_path:
    file_path = os.path.join(DIST, full_path)
    if os.path.isfile(file_path):
      return FileResponse(file_path)
  index = os.path.join(DIST, "index.html")
  if os.path.isfile(index):
    return FileResponse(index)
  return {"dist": DIST, "exists": os.path.exists(DIST)}
