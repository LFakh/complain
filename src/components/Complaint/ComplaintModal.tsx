import React, { useState } from 'react';
import { X, Send, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Photo } from '../../types';

interface ComplaintModalProps {
  photos: Photo[];
  onClose: () => void;
  onSendComplaint: (data: any) => Promise<boolean>;
}

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dnvus1oig';
const CLOUDINARY_UPLOAD_PRESET = 'complain'; // You need to create this in your Cloudinary dashboard

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_73xlrj2';
const EMAILJS_TEMPLATE_ID = 'template_h9ihkss';
const EMAILJS_PUBLIC_KEY = 'b8a7WhK1kmfb1E-Y4'; // Replace with your actual public key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ 
  photos, 
  onClose, 
  onSendComplaint 
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState('');
  const [showUrlPreview, setShowUrlPreview] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handlePhotoToggle = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('public_id', `complaint_${Date.now()}_${file.name.split('.')[0]}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate environment variables
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setStatus('Configuration error: Missing environment variables. Please check your .env file.');
      return;
    }
    
    if (!subject.trim() || !message.trim()) {
      setStatus('Please fill in both subject and message fields.');
      return;
    }

    setIsSubmitting(true);
    setStatus('Processing...');

    try {
      let uploadedImageUrls: string[] = [];

      // Upload selected photos to Cloudinary
      if (selectedPhotos.length > 0) {
        setStatus(`Uploading ${selectedPhotos.length} image(s) to Cloudinary...`);
        
        for (const photoId of selectedPhotos) {
          const photo = photos.find(p => p.id === photoId);
          if (photo) {
            try {
              const file = dataURLtoFile(photo.dataUrl, photo.filename);
              const cloudinaryUrl = await uploadToCloudinary(file);
              uploadedImageUrls.push(`${photo.filename}: ${cloudinaryUrl}`);
            } catch (error) {
              console.error(`Failed to upload ${photo.filename}:`, error);
              uploadedImageUrls.push(`${photo.filename}: Upload failed`);
            }
          }
        }
      }

      // Prepare email content
      setStatus('Sending email...');
      
      let emailMessage = `Subject: ${subject}\n\n`;
      emailMessage += `Message:\n${message}\n\n`;
      
      if (imageUrls.trim()) {
        emailMessage += `Image URLs:\n${imageUrls}\n\n`;
      }
      
      if (uploadedImageUrls.length > 0) {
        emailMessage += `Uploaded Photos:\n${uploadedImageUrls.join('\n')}\n\n`;
      }
      
      emailMessage += `Sent at: ${new Date().toLocaleString()}`;

      // Send email via EmailJS
      const emailParams = {
        name: 'Photo Complaint System',
        time: new Date().toLocaleString(),
        message: emailMessage
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);

      setStatus('Complaint sent successfully!');
      
      // Reset form
      setTimeout(() => {
        setSelectedPhotos([]);
        setImageUrls('');
        setSubject('');
        setMessage('');
        setStatus('');
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error sending complaint:', error);
      setStatus(`Failed to send complaint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Send Complaint</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter complaint subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your complaint in detail"
            />
          </div>

          {/* Image URLs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Image URLs (Optional)
              </label>
              {imageUrls.trim() && (
                <button
                  type="button"
                  onClick={() => setShowUrlPreview(!showUrlPreview)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  {showUrlPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showUrlPreview ? 'Hide Preview' : 'Preview URLs'}
                </button>
              )}
            </div>
            <textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URLs (one per line)"
            />
            
            {/* URL Preview */}
            {showUrlPreview && imageUrls.trim() && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">URL Preview:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {imageUrls
                    .split('\n')
                    .filter(url => url.trim())
                    .map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url.trim()}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const errorDiv = target.nextElementSibling as HTMLElement;
                            if (errorDiv) errorDiv.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="hidden w-full h-16 bg-red-50 border border-red-200 rounded items-center justify-center"
                          style={{ display: 'none' }}
                        >
                          <span className="text-xs text-red-600">Invalid URL</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                          URL {index + 1}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Photo Selection */}
          {photos.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Photos to Upload ({selectedPhotos.length} selected)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Selected photos will be uploaded to Cloudinary and included in your complaint email.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedPhotos.includes(photo.id)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePhotoToggle(photo.id)}
                  >
                    <img
                      src={photo.dataUrl}
                      alt={photo.filename}
                      className="w-full h-20 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
                    {selectedPhotos.includes(photo.id) && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {photo.filename}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          {status && (
            <div className={`p-3 rounded-lg ${
              status.includes('success') 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : status.includes('Failed') || status.includes('Error')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {status}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!subject.trim() || !message.trim())}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};