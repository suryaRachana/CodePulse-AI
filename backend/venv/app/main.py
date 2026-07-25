from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "CodePulse AI Backend Running"}