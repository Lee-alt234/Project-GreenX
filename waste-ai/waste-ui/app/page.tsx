"use client"

import { useState, useRef, useCallback } from "react"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import Webcam from "react-webcam"

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [cameraMode, setCameraMode] = useState(false)
  const [cameraPreview, setCameraPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const webcamRef = useRef<Webcam>(null)

  // ================================
  // DRAG & DROP
  // ================================
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }
  })

  // ================================
  // ANALYZE BUTTON
  // ================================
  const analyzeImage = async () => {
    if (!imageFile) return

    const formData = new FormData()
    formData.append("file", imageFile)

    setLoading(true)

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/detect",
        formData
      )
      setResult(res.data)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  // ================================
  // CAMERA CAPTURE
  // ================================
  const capture = () => {
    if (!webcamRef.current) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    setCameraPreview(imageSrc)
  }

  const useCapturedImage = async () => {
    if (!cameraPreview) return

    const blob = await fetch(cameraPreview).then(res => res.blob())
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" })

    setImageFile(file)
    setPreview(cameraPreview)
    setCameraMode(false)
    setCameraPreview(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white flex flex-col items-center p-10">

      <h1 className="text-5xl font-bold text-purple-400 mb-10 drop-shadow-[0_0_20px_#9333ea]">
        AI Waste Vision
      </h1>

      {/* Toggle Buttons */}
<div className="flex gap-4 mb-6">

  <button
    
  onClick={() => {
    setCameraMode(false)
    setCameraPreview(null)

    // small delay ensures mode switch completes
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 100)
  }}

    className={`px-5 py-2 rounded-lg transition 
      ${!cameraMode
        ? "bg-purple-600 shadow-[0_0_25px_#a855f7]"
        : "bg-[#1c2333] shadow-[0_0_15px_#7c3aed] hover:shadow-[0_0_25px_#a855f7]"
      }`}
  >
    Upload
  </button>

  <button
    onClick={() => {
      setCameraMode(true)
      setPreview(null)
      setImageFile(null)
      setResult(null)
    }}
    className={`px-5 py-2 rounded-lg transition 
      ${cameraMode
        ? "bg-blue-600 shadow-[0_0_25px_#60a5fa]"
        : "bg-[#1c2333] shadow-[0_0_15px_#3b82f6] hover:shadow-[0_0_25px_#60a5fa]"
      }`}
  >
    Webcam
  </button>

</div>

{/* ========================= */}
{/* UPLOAD BOX */}
{/* ========================= */}
{!cameraMode && (
  <div
    className="w-[420px] h-[300px] 
               bg-[#111827] 
               border-2 border-purple-500 
               rounded-xl 
               flex items-center justify-center 
               shadow-[0_0_30px_#7c3aed] 
               cursor-pointer relative overflow-hidden"
    onClick={() => fileInputRef.current?.click()}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (!file) return
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
    }}
  >

    {/* Hidden File Input */}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setPreview(URL.createObjectURL(file))
        setResult(null)
      }}
    />

    {!preview && (
      <p className="text-gray-400 text-lg pointer-events-none">
        Drag & Drop or Click to Upload
      </p>
    )}

    {preview && (
      <>
        <img
          src={preview}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        <div className="absolute bottom-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setPreview(null)
              setImageFile(null)
              setResult(null)
            }}
            className="px-3 py-1 bg-red-600 rounded shadow-[0_0_15px_red]"
          >
            Remove
          </button>
        </div>
      </>
    )}
  </div>
)}


      {/* ========================= */}
      {/* CAMERA */}
      {/* ========================= */}
      {cameraMode && (
        <div className="flex flex-col items-center gap-4">
          {!cameraPreview && (
            <>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-xl shadow-[0_0_25px_#3b82f6]"
              />
              <button
                onClick={capture}
                className="px-6 py-2 bg-blue-600 rounded-lg 
                           shadow-[0_0_15px_#3b82f6] 
                           hover:shadow-[0_0_30px_#60a5fa] 
                           transition"
              >
                Capture
              </button>
            </>
          )}

          {cameraPreview && (
            <>
              <img
                src={cameraPreview}
                className="rounded-xl shadow-[0_0_25px_#7c3aed]"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setCameraPreview(null)}
                  className="px-5 py-2 bg-gray-700 rounded-lg shadow-[0_0_15px_#555]"
                >
                  Retake
                </button>

                <button
                  onClick={useCapturedImage}
                  className="px-5 py-2 bg-purple-600 rounded-lg 
                             shadow-[0_0_20px_#a855f7]"
                >
                  Use This
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ANALYZE BUTTON */}
      {preview && !cameraMode && (
        <button
          onClick={analyzeImage}
          className="mt-6 px-8 py-3 bg-purple-600 rounded-xl 
                     shadow-[0_0_25px_#a855f7] 
                     hover:shadow-[0_0_40px_#c084fc] 
                     transition text-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Analyze Waste"}
        </button>
      )}

      {/* RESULTS */}
      {/* RESULTS */}
{result && result.detections && result.detections.length > 0 && (() => {

  console.log("RAW RESULT:", result)

  const classMap: Record<string, { count: number, totalConf: number }> = {}

  result.detections.forEach((det: any) => {

    // 🔥 IMPORTANT: adjust key here if needed
    const className = det.class_name || det.class || det.label

    if (!className) return

    if (!classMap[className]) {
      classMap[className] = { count: 0, totalConf: 0 }
    }

    classMap[className].count += 1
    classMap[className].totalConf += det.confidence
  })

  let dominantClass = ""
  let maxCount = 0

  for (const key in classMap) {
    if (classMap[key].count > maxCount) {
      dominantClass = key
      maxCount = classMap[key].count
    }
  }

  if (!dominantClass) {
    return (
      <div className="mt-8 text-red-400">
        Could not determine waste type.
      </div>
    )
  }

  const avgConfidence =
    classMap[dominantClass].totalConf /
    classMap[dominantClass].count

  return (
    <div className="mt-8 bg-[#111827] p-8 rounded-xl 
                    shadow-[0_0_40px_#3b82f6] 
                    w-[420px] text-center">

      <h2 className="text-2xl text-blue-400 mb-6">
        Most Likely Waste Type
      </h2>

      <p className="text-4xl font-bold text-purple-400 
                    drop-shadow-[0_0_20px_#a855f7] capitalize">
        {dominantClass.replace("_", " ")}
      </p>

      <p className="mt-4 text-lg text-gray-300">
        Confidence: {(avgConfidence * 100).toFixed(1)}%
      </p>

      <div className="mt-6">
        <p className="text-3xl font-bold text-green-400 
                      drop-shadow-[0_0_10px_#22c55e]">
          🌍 {result.total_carbon_saved_g} g CO₂ Saved if the object is recycled 
        </p>
      </div>

    </div>
  )

})()}

      
    </div>
  )
}
