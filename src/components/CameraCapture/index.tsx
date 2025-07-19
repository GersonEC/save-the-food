'use client';

import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
}

export function CameraCapture({
  onImageCapture,
  onImageRemove,
  currentImage,
}: CameraCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(
    currentImage || null
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const startCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: { facingMode: 'environment' }, // Use back camera on mobile
  //       audio: false,
  //     });

  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //       streamRef.current = stream;
  //       setIsCameraActive(true);
  //     }
  //   } catch (error) {
  //     console.error('Error accessing camera:', error);
  //     // Fallback to file upload if camera access fails
  //     fileInputRef.current?.click();
  //   }
  // };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        onImageCapture(imageData);

        // Stop camera after capture
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        onImageCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCapturedImage(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-4'>
      {/* Camera Interface */}
      {isCameraActive && (
        <div className='relative'>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className='w-full h-64 object-cover rounded-lg border'
          />
          <canvas ref={canvasRef} className='hidden' />
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
            <Button
              type='button'
              onClick={capturePhoto}
              className='bg-green-600 hover:bg-green-700'
            >
              Scatta Foto
            </Button>
            <Button
              type='button'
              onClick={stopCamera}
              variant='outline'
              className='bg-white/80'
            >
              Annulla
            </Button>
          </div>
        </div>
      )}

      {/* Captured/Uploaded Image Display */}
      {capturedImage && !isCameraActive && (
        <div className='relative'>
          <Image
            src={capturedImage}
            alt='Food'
            width={400}
            height={256}
            className='w-full h-64 object-cover rounded-lg border'
          />
          <Button
            type='button'
            onClick={removeImage}
            variant='outline'
            size='sm'
            className='absolute top-2 right-2 bg-white/80 hover:bg-white'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}

      {/* Camera/Upload Buttons */}
      {!capturedImage && !isCameraActive && (
        <div className='flex gap-2'>
          <Button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            variant='outline'
            className='flex-1 border-none shadow-none bg-green-500/20 rounded-xs p-4'
          >
            <Camera className='h-4 w-4 mr-2' />
            Carica Foto
          </Button>
        </div>
      )}

      {/* Hidden file input for fallback */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        capture='environment'
        onChange={handleFileUpload}
        className='hidden'
      />

      {/* Help text */}
      <p className='text-sm text-gray-500'>
        {!capturedImage
          ? "Scatta una foto del cibo o carica un'immagine esistente"
          : 'Foto aggiunta con successo'}
      </p>
    </div>
  );
}
