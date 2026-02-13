from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # safer than "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load model once
model = YOLO("yolov8x.pt")

# Waste category mapping
waste_map = {
    "bottle": "Recyclable",
    "banana": "Organic",
    "apple": "Organic",
    "laptop": "E-waste",
    "cell phone": "E-waste",
    "tv": "E-waste",
    "book": "Recyclable",
}

# Carbon savings data (grams)
carbon_data = {
    "bottle": 82,
    "banana": 50,
    "apple": 50,
    "book": 70,
    "laptop": 300,
    "cell phone": 150,
}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    results = model(image)

    detections = []
    total_carbon = 0

    for r in results:
         for box in r.boxes:
           label = model.names[int(box.cls)]
           confidence = float(box.conf)
           bbox = box.xyxy.tolist()[0]

           print("RAW DETECTION:", label, confidence)

           detections.append({
            "label": label,
            "confidence": round(confidence, 2),
            "bbox": bbox
           })
           if confidence > 0.4:
               
               detections.append({
               "label": label,
               "confidence": round(confidence, 2),
               "bbox": bbox
             })

               if label in carbon_data:
                 total_carbon += carbon_data[label]
   

    return {
        "detections": detections,
        "total_carbon_saved_g": total_carbon
    }
