'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploadProps = {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  acceptedTypes?: string[];
};

const FileUpload = ({ onFileSelected, isLoading, acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] }: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      setError('Please upload a valid file (PDF, JPG, PNG, or DOCX)');
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    onFileSelected(file);
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="w-full max-w-2xl mx-auto" role="region" aria-label="File upload area">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
            : 'border-indigo-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        aria-describedby="file-upload-description"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            input?.click();
          }
        }}
      >
        <input 
          {...getInputProps()} 
          aria-label="File input"
        />
        <div className="space-y-4">
          <div 
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 rounded-xl flex items-center justify-center shadow-sm transform transition-transform duration-200 hover:scale-105"
            aria-hidden="true"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          {isLoading ? (
            <p className="text-gray-700">Processing your invoice...</p>
          ) : isDragActive ? (
            <p className="text-indigo-700 font-medium">Drop the file here</p>
          ) : (
            <div id="file-upload-description">
              <p className="text-gray-800">
                <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF, JPG, PNG, or DOCX (max 10MB)
              </p>
              <p className="sr-only">
                Press enter or space to open file dialog
              </p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
