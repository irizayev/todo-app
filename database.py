import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = os.environ.get("DATABASE_URL", "postgresql://ismailrizayev@localhost:5432/todo_list")

# Railway даёт URL с "postgres://", SQLAlchemy требует "postgresql://"
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)
session = sessionmaker(bind=engine, autoflush=False, autocommit=False)