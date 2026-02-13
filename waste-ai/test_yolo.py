from ultralytics import YOLO

# Load pretrained model
model = YOLO("yolov8n.pt")

# Run inference
results = model("https://ultralytics.com/images/bus.jpg")

# Print detections
for r in results:
    for box in r.boxes:
        print("Class:", model.names[int(box.cls)])
        print("Confidence:", float(box.conf))
        print("BBox:", box.xyxy.tolist())
