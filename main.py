from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import detect_ethnicity

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    result = detect_ethnicity(contents)
    return {"ethnicity_prediction": result}
# FastAPI Endpoint