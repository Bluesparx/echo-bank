// src/components/VoiceEnrollment.js
import React, { useState } from 'react';
import { recordVoice, createVoiceProfile } from '@/utils/voiceAuth';

const VoiceEnrollment = ({ userId, onEnrollmentComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(5000); // 5 seconds

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setProgress(0);
      setEnrollmentStatus('recording');
      
      // Set up progress counter
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / (recordingDuration / 100));
        });
      }, 100);
      
      // Record voice using Web Speech API
      const voiceData = await recordVoice(recordingDuration);
      clearInterval(progressInterval);
      setProgress(100);
      setEnrollmentStatus('processing');
      
      // Create voice profile
      const result = await createVoiceProfile(userId, voiceData);
      
      if (result.success) {
        setEnrollmentStatus('success');
        if (onEnrollmentComplete) {
          onEnrollmentComplete(result);
        }
      } else {
        setEnrollmentStatus('error');
        console.error("Enrollment failed:", result.error);
      }
    } catch (error) {
      console.error("Error in voice enrollment:", error);
      setEnrollmentStatus('error');
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <h3 className="font-medium text-gray-900">Voice Profile Enrollment</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Add voice authentication for extra security. Please speak clearly when recording.
      </p>
      
      {enrollmentStatus === 'success' ? (
        <div className="flex items-center text-green-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Voice profile enrolled successfully!
        </div>
      ) : (
        <>
          {enrollmentStatus === 'recording' && (
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-100" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Recording... {Math.round(progress)}%</p>
            </div>
          )}
          
          {enrollmentStatus === 'processing' && (
            <div className="flex items-center text-blue-600 mb-4">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing your voice profile...
            </div>
          )}
          
          {enrollmentStatus === 'error' && (
            <div className="text-red-600 mb-4">
              Something went wrong. Please try again.
            </div>
          )}
          
          <button
            type="button"
            onClick={startRecording}
            disabled={isRecording}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isRecording ? (
              <>
                <svg className="animate-pulse w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
                </svg>
                Recording...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
                </svg>
                Record Voice
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default VoiceEnrollment;