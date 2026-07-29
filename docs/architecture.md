# CodePulse AI - System Architecture

## High-Level Architecture

```
                +----------------------+
                |       User           |
                +----------+-----------+
                           |
                           |
                           v
                +----------------------+
                | React Frontend       |
                | (User Interface)     |
                +----------+-----------+
                           |
                    REST API Calls
                           |
                           v
                +----------------------+
                | FastAPI Backend      |
                | Business Logic       |
                +----+-----------+-----+
                     |           |
                     |           |
                     v           v
          +----------------+   +----------------+
          | PostgreSQL     |   | AI Engine      |
          | Database       |   | Prediction     |
          +----------------+   +----------------+
                     |
                     |
                     v
             Analysis Results
                     |
                     v
                React Dashboard
```

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- FastAPI
- Python

### Database

- PostgreSQL

### AI / Machine Learning

- Scikit-learn
- Python

### Version Control

- Git
- GitHub

---

## Request Flow

1. User logs into the application.
2. User uploads or connects a GitHub repository.
3. Frontend sends the request to the FastAPI backend.
4. Backend analyzes repository metadata and stores required information in PostgreSQL.
5. AI engine predicts technical debt risk and maintainability.
6. Backend sends the analysis results to the frontend.
7. Dashboard displays Technical Debt Score, Health Score, AI Prediction, and Refactoring Recommendations.