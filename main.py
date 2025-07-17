# FastAPI Endpoint
# To run the FastAPI server, use the command:
# uvicorn main:app --reload
# This will start the server at http://127.0.0.1:8000/predict.
# You can test the endpoint using tools like Postman or curl by sending a POST request with an image file.
# Ensure you have the required libraries installed:
# pip install fastapi uvicorn deepface opencv-python pillow numpy

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import detect_ethnicity


app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Add a simple root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Ethnicity Prediction API. Use the /predict endpoint with a POST request and an image file."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    result = detect_ethnicity(contents)
    return {"ethnicity_prediction": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
# To run the FastAPI server, use the command:
# uvicorn main:app --reload

