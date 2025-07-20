import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePhotos } from './hooks/usePhotos';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Header/Header';
import { FileUpload } from './components/Upload/FileUpload';
import { CameraCapture } from './components/Camera/CameraCapture';
import { PhotoCard } from './components/Photos/PhotoCard';
import { ComplaintModal } from './components/Complaint/ComplaintModal';

function App() {
  const { authState, login, register, logout } = useAuth();
  const { photos, addPhoto, clearAllPhotos } = usePhotos(authState.user?.id || '');
  const [showCamera, setShowCamera] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);

  const handlePhotoCapture = (dataUrl: string, filename: string) => {
    addPhoto(filename, dataUrl);
  };

  const handleClearAllPhotos = () => {
    if (confirm('Are you sure you want to delete all photos? This action cannot be undone.')) {
      clearAllPhotos();
    }
  };
  const handleSendComplaint = async (complaintData: any) => {
    // This function is no longer needed as EmailJS is handled directly in ComplaintModal
    return true;
  };

  if (!authState.isAuthenticated) {
    return <AuthForm onLogin={login} onRegister={register} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={authState.user!} 
        onLogout={logout}
        onOpenComplaint={() => setShowComplaint(true)}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <FileUpload 
          onFileUpload={handlePhotoCapture}
          onCameraOpen={() => setShowCamera(true)}
          onClearData={handleClearAllPhotos}
          hasPhotos={photos.length > 0}
        />
        
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No photos uploaded yet</div>
            <p className="text-gray-400 mt-2">Upload your first photo to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {photos.map((photo) => (
              <PhotoCard 
                key={photo.id} 
                photo={photo} 
              />
            ))}
          </div>
        )}
      </main>

      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {showComplaint && (
        <ComplaintModal
          photos={photos}
          onClose={() => setShowComplaint(false)}
          onSendComplaint={handleSendComplaint}
        />
      )}
    </div>
  );
}

export default App;