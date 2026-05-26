from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import time

DATABASE_URL = "postgresql://marine:marine123@postgres:5432/marine_db"

# Retry connection
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        engine.connect()
        print("Database connected successfully")
        break
    except Exception:
        print("Database not ready, retrying...")
        time.sleep(3)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()