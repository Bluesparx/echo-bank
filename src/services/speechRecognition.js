import React from 'react';

// Speech Recognition Hook
export function SpeechRecognition() {
  const [isListening, setIsListening] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Initialize speech recognition
  const initRecognition = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported');
      return null;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    return recognition;
  };

  // Start listening method
  const startListening = (inputType = 'navigation', onResult, onError) => {
    const recognition = initRecognition();
    
    if (!recognition) {
      if (onError) onError('Speech recognition not supported');
      return;
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      setError(err.message);
      setIsListening(false);
      if (onError) onError(err.message);
    }
  };

  // Stop listening method
  const stopListening = () => {
    const recognition = initRecognition();
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    startListening,
    stopListening,
    isListening,
    error
  };
}