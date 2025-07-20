import React, { useRef } from 'react';
import { Upload, Camera, Image, Trash2 } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (dataUrl: string, filename: string) => void;
  onCameraOpen: () => void;
  onClearData: () => void;
  hasPhotos: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onCameraOpen, onClearData, hasPhotos }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onFileUpload(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Photo</h2>
      
      <div className="space-y-4">
        {isMobile && (
          <button
            onClick={onCameraOpen}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Take Photo
          </button>
        )}

        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click to upload an image</p>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </div>
        </div>

        {hasPhotos && (
          <button
            onClick={onClearData}
            className="w-full mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Photos
          </button>
        )}
      </div>
    </div>
  );
};