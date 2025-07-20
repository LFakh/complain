import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={photo.dataUrl} 
          alt={photo.filename}
          className="w-full h-64 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{photo.filename}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(photo.uploadedAt).toLocaleDateString()}
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          Ready to include in complaint
        </p>
      </div>
    </div>
  );
};