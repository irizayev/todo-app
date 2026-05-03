import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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

tasks = [
  Task(id=1,  title="Доделать роуты FastAPI",       description="Реализовать CRUD для /todos: GET, POST, PATCH, DELETE", date="2026-05-10"),
  Task(id=2,  title="Подключить SQLAlchemy",         description="Настроить движок, сессии и базовую модель Task",        date="2026-05-12"),
  Task(id=3,  title="Написать Pydantic схемы",       description="TaskIn, TaskOut, TaskPatch с валидацией полей",         date="2026-05-14"),
  Task(id=4,  title="Настроить CORS middleware",     description="Разрешить запросы с фронта на http://127.0.0.1:5500",  date="2026-05-15"),
  Task(id=5,  title="Добавить обработку ошибок",    description="HTTPException на 404, валидация входных данных",        date="2026-05-16"),
  Task(id=6,  title="Купить продукты",               description="Хлеб, молоко, кофе, овощи на неделю",                  date="2026-05-04"),
  Task(id=7,  title="Посмотреть лекцию по Alembic",  description="Разобраться с миграциями БД и автогенерацией",         date="2026-05-20"),
  Task(id=8,  title="Написать тесты на эндпоинты",  description="pytest + httpx.AsyncClient для всех CRUD операций",    date="2026-05-25"),
  Task(id=9,  title="Задеплоить на Railway",         description="Подключить GitHub репо, env переменные и Postgres",    date="2026-06-01"),
  Task(id=10, title="Позвонить маме",                description="Не забыть, давно не созванивались",                    date="2026-05-03"),
]


def get_db():
  db = session()
  try:
    yield db
  finally:
    db.close()


def init_db():
  db = session()
  count = db.query(database_models.Task).count()
  if count == 0:
    for task in tasks:
      db.add(database_models.Task(**task.model_dump()))
    db.commit()
  db.execute(text('SELECT setval(pg_get_serial_sequence(\'\"Task\"\', \'id\'), COALESCE((SELECT MAX(id) FROM "Task"), 0))'))
  db.commit()
  db.close()

init_db()


@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
  return db.query(database_models.Task).all()


@app.get("/task/{id}")
def get_task_by_id(id: int, db: Session = Depends(get_db)):
  task = db.query(database_models.Task).filter(database_models.Task.id == id).first()
  if task:
    return task
  return {"error": "not found"}


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
    return {"error": "not found"}
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
    return {"error": "not found"}
  db.commit()
  return {"ok": True}


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE_DIR, "frontend", "dist")

if os.path.exists(DIST):
  app.mount("/assets", StaticFiles(directory=os.path.join(DIST, "assets")), name="assets")

  @app.get("/favicon.svg")
  def favicon():
    return FileResponse(os.path.join(DIST, "favicon.svg"))

  @app.get("/icons.svg")
  def icons():
    return FileResponse(os.path.join(DIST, "icons.svg"))

  @app.get("/{full_path:path}")
  def serve_frontend(full_path: str):
    return FileResponse(os.path.join(DIST, "index.html"))
