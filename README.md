# todo. 📝

A full-stack Todo App built to practice REST API development with FastAPI.

🔗 **Live demo:** [todo-app-ten-psi-21.vercel.app](https://todo-app-ten-psi-21.vercel.app)

---

## Tech Stack

**Backend**
- FastAPI — REST API with full CRUD
- SQLAlchemy ORM — database interactions
- PostgreSQL — persistent storage
- Pydantic — request/response validation
- CORS Middleware — frontend-backend communication

**Frontend**
- Vanilla JavaScript + CSS

**Deployment**
- Backend + PostgreSQL → Railway
- Frontend → Vercel

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| GET | `/task/{id}` | Get task by ID |
| POST | `/task` | Create new task |
| PUT | `/task` | Update task |
| DELETE | `/task` | Delete task |

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/irizayev/todo-app.git
cd todo-app

# Install dependencies
pip install -r requirements.txt

# Set environment variable
export DATABASE_URL=your_postgresql_url

# Start the server
uvicorn main:app --reload
```

API docs available at: `http://localhost:8000/docs`

---

## Project Structure

```
todo-app/
├── main.py              # FastAPI app & endpoints
├── models.py            # Pydantic schemas
├── database.py          # Database connection
├── database_models.py   # SQLAlchemy models
├── requirements.txt
├── Dockerfile
└── frontend/            # Vanilla JS frontend
```
