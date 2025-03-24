import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { startListening, stopListening } from '../../services/speechRecognition';
import { speak, announce } from '../../services/textToSpeech';

const VoiceAuth = ({ onSuccess }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { translations, currentLanguage } = useLanguage();
  const { loginWithVoice } = useAuth();
  const maxAttempts = 3;
  
  // Ref for tracking timeout
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    // Announce instructions for screen readers
    announce(translations.voiceAuthPrompt);
    speak(translations.voiceAuthPrompt);
    
    // Set up keyboard shortcut to activate listening (Space key)
    const handleKeyDown = (e) => {
      if (e.key === ' ' && !isListening && !isProcessing) {
        e.preventDefault();
        startVoiceAuth();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      stopListening();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [translations, isListening, isProcessing]);
  
  const startVoiceAuth = () => {
    if (isListening || isProcessing) return;
    
    setError('');
    setTranscript('');
    setIsListening(true);
    
    // Play beep sound to indicate start of recording
    const beep = new Audio('/assets/beep.mp3'); // Ensure this asset exists
    beep.play().catch(err => console.error('Could not play beep sound', err));
    
    announce("Listening for voice passphrase");
    speak("Please speak your passphrase now");
    
    startListening(
      // Success callback
      (voiceInput, confidence) => {
        setTranscript(voiceInput);
        setIsListening(false);
        validateVoicePassphrase(voiceInput, confidence);
      },
      // Error callback
      (errorMessage) => {
        setIsListening(false);
        setError(errorMessage || 'Voice recognition failed');
        announce("Voice recognition error: " + (errorMessage || 'Please try again'));
        
        // Increment attempt count
        setAttemptCount(prev => prev + 1);
      },
      // Pass current language
      currentLanguage
    );
    
    // Set timeout for listening (10 seconds)
    timeoutRef.current = setTimeout(() => {
      if (isListening) {
        stopListening();
        setIsListening(false);
        setError('Listening timeout. Please try again.');
        announce("Listening timeout. Please try again.");
        setAttemptCount(prev => prev + 1);
      }
    }, 10000);
  };
  
  const validateVoicePassphrase = async (voiceInput, confidence) => {
    setIsProcessing(true);
    
    try {
      // This would normally check against a voice biometric system
      // For demo purposes, we'll use a simple passphrase check with confidence threshold
      const isValidPassphrase = confidence > 0.7;
      
      if (isValidPassphrase) {
        announce("Voice authentication successful");
        await loginWithVoice(voiceInput);
        onSuccess();
      } else {
        setError('Voice not recognized or confidence too low');
        announce("Voice authentication failed. Confidence too low. Please try again.");
        setAttemptCount(prev => prev + 1);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
      announce("Authentication error: " + (err.message || 'Please try again'));
      setAttemptCount(prev => prev + 1);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Check if max attempts reached
  useEffect(() => {
    if (attemptCount >= maxAttempts) {
      announce("Maximum authentication attempts reached. Switching to standard login.");
      speak("Maximum attempts reached. Please use standard login instead.");
      
      // Reset attempt count and redirect to standard login
      setAttemptCount(0);
      window.location.reload(); // Simple way to reset to standard login
    }
  }, [attemptCount]);
  
  return (
    <div className="voice-auth-container">
      <div className="voice-status" aria-live="assertive">
        {isListening ? (
          <div className="listening-indicator" role="status">
            Listening...
          </div>
        ) : isProcessing ? (
          <div className="processing-indicator" role="status">
            Processing...
          </div>
        ) : (
          <div className="ready-indicator" role="status">
            Ready for voice authentication
          </div>
        )}
      </div>
      
      {transcript && (
        <div className="transcript" aria-live="polite">
          <p>Recognized speech: {transcript}</p>
        </div>
      )}
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      <div className="voice-controls">
        <button
          className="start-listening-button"
          onClick={startVoiceAuth}
          disabled={isListening || isProcessing}
          aria-label="Start voice authentication"
        >
          {isListening ? 'Listening...' : 'Press to Speak Passphrase'}
        </button>
        
        <p className="attempts-counter" aria-live="polite">
          Attempts: {attemptCount} of {maxAttempts}
        </p>
      </div>
      
      <div className="instructions">
        <p tabIndex="0">
          Press Space bar or the button above to begin voice authentication.
          Speak your passphrase clearly when prompted.
        </p>
      </div>
    </div>
  );
};

export default VoiceAuth;