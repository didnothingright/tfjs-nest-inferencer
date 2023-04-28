"use client";

import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface Prediction {
  bbox: [number, number, number, number];
  class: number;
  score: number;
}

const classes = ['fog'];

function Upload(): JSX.Element {
  const [image, setImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
      setPrediction(null);
      setImageWidth(null);
      setImageHeight(null);

      const img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
      };
    }
  };

  const handlePrediction = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        const response = await axios.post<Prediction[]>('http://localhost:3001/yolo/inference', formData);
        setPrediction(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderBoundingBoxes = (predictions: Prediction[], width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (context) {
      const img = new Image();
      img.src = URL.createObjectURL(image as Blob);
      img.onload = () => {
        context.drawImage(img, 0, 0, width, height);

        context.clearRect(0, 0, width, height); // Clear the canvas

        predictions.forEach((prediction) => {
          const [x, y, w, h] = prediction.bbox;
          const left = (x + 1) / 2 * width;
          const top = (y + 1) / 2 * height;
          const right = (x + w + 1) / 2 * width;
          const bottom = (y + h + 1) / 2 * height;
          const className = classes[prediction.class];
          const score = (prediction.score * 100).toFixed(2);

          context.strokeStyle = 'red';
          context.lineWidth = 2;
          context.strokeRect(left, top, right - left, bottom - top);

          context.fillStyle = 'red';
          context.font = '16px Arial';
          context.fillText(`${className} - ${score}%`, left, top - 5);
        });
      };

      console.log(canvas.toDataURL());
      return canvas.toDataURL();
    }

    return undefined;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      {image ? (
        <img
          src={URL.createObjectURL(image)}
          alt="Selected Image"
          className="mb-4 border border-white rounded-lg"
        />
      ) : (
        <div className="mb-4">
          <label htmlFor="imageUpload" className="text-white font-bold mb-2">
            Select an image:
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label htmlFor="imageUpload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">
            Upload Image
          </label>
        </div>
      )}
      <button
        onClick={handlePrediction}
        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg"
        disabled={!image}
      >
        Get Prediction
      </button>
      {prediction ? (
        <div className="mt-4">
          <h2 className="text-white font-bold mb-2">Predictions:</h2>
          {imageWidth && imageHeight && renderBoundingBoxes(prediction, imageWidth, imageHeight) && (
            <div className="border border-white rounded-lg overflow-hidden">
              <img
                src={renderBoundingBoxes(prediction, imageWidth, imageHeight)}
                alt="Predictions"
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Upload;