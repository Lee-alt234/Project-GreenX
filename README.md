# 🌱 AI Waste Detection & Carbon Intelligence Platform

An AI-powered full-stack web application that detects waste materials from images and calculates associated carbon footprint reduction metrics.

---

## 🧠 Core Capabilities

- AI-based waste classification (image upload or webcam capture)
- Carbon savings estimation engine
- Real-time image processing
- Modern, responsive UI with dynamic state handling
- REST API integration between frontend and backend
- Modular, scalable architecture

---

## 🏗 Architecture Overview

The platform follows a modular full-stack architecture:

### Frontend Layer
- UI rendering
- Image capture & upload handling
- State management
- API communication

### Backend API Layer
- Accepts image input
- Runs AI inference
- Computes carbon impact metrics

### AI Inference Layer
- Computer vision model for waste detection

### Carbon Intelligence Engine
- Maps detected waste types to estimated CO₂ savings

This separation ensures maintainability, scalability, and production readiness.

---

## 🎨 Frontend Stack

- Next.js (App Router)
- React (Hooks + State Management)
- TypeScript
- TailwindCSS
- React Webcam API
- Custom Drag & Drop File Handling

### Frontend Features

- Upload ↔ Webcam mode switching
- Real-time image preview
- Optimized file handling
- Smooth UI transitions
- Modular component architecture

---

## ⚙️ Backend & AI Stack

- FastAPI (Python)
- Computer Vision Model
- Image Preprocessing Pipeline
- Carbon Mapping Logic Engine
- RESTful API Design
- Structured JSON Responses

### Example API Response

```json
{
  "detections": [
    {
      "label": "plastic_bottle",
      "confidence": 0.92
    }
  ],
  "total_carbon_saved_g": 150
}
