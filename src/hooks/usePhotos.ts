import { useState, useEffect } from 'react';
import { Photo, Comment } from '../types';

const PHOTOS_STORAGE_KEY = 'photo_complaint_photos';

export const usePhotos = (userId: string) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
    if (savedPhotos) {
      const allPhotos = JSON.parse(savedPhotos);
      setPhotos(allPhotos.filter((photo: Photo) => photo.userId === userId));
    }
  }, [userId]);

  const addPhoto = (filename: string, dataUrl: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      userId,
      filename,
      dataUrl,
      uploadedAt: new Date(),
      comments: []
    };

    const allPhotos = JSON.parse(localStorage.getItem(PHOTOS_STORAGE_KEY) || '[]');
    allPhotos.push(newPhoto);
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(allPhotos));
    setPhotos(prev => [...prev, newPhoto]);
  };

  const clearAllPhotos = () => {
    const allPhotos = JSON.parse(localStorage.getItem(PHOTOS_STORAGE_KEY) || '[]');
    const filteredPhotos = allPhotos.filter((photo: Photo) => photo.userId !== userId);
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(filteredPhotos));
    setPhotos([]);
  };

  return { photos, addPhoto, clearAllPhotos };
};