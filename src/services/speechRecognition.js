import { stopSpeaking } from './textToSpeech';
// Check if browser supports speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

let recognition = null;

// Initialize speech recognition
export const initSpeechRecognition = (language = 'en-US') => {
  try {
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return false;
    }
    stopSpeaking();
    recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    
    // Add event listeners for better error handling
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        console.error('Microphone access denied');
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
    };

    return true;
  } catch (error) {
    console.error('Error initializing speech recognition:', error);
    return false;
  }
};

// Process email input from speech
const processEmailInput = (transcript) => {
  // Convert number words to digits
  const numberWords = {
    'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
    'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
  };

  // Convert common email-related spoken words to symbols
  let processedTranscript = transcript
    .toLowerCase()
    .replace(/\b(at the rate|at)\b/g, '@') // Convert "at the rate" or "at" to @
    .replace(/\b(dot|period)\b/g, '.') // Convert "dot" or "period" to .
    .replace(/\b(underscore|under score)\b/g, '_') // Convert "underscore" to _
    .replace(/\b(hyphen|dash)\b/g, '-') // Convert "hyphen" or "dash" to -
    .replace(/\s+/g, '') // Remove all spaces
    .trim();

  // Convert number words to digits
  Object.entries(numberWords).forEach(([word, digit]) => {
    processedTranscript = processedTranscript.replace(new RegExp(word, 'g'), digit);
  });

  return processedTranscript;
};

// Start listening for voice input
export const startListening = (onResultCallback, onErrorCallback, isEmailInput = false) => {
  try {
    if (!recognition) {
      const initialized = initSpeechRecognition();
      if (!initialized) {
        if (onErrorCallback) onErrorCallback('Speech recognition not supported');
        return false;
      }
    }
    
    // Stop any ongoing speech before starting voice recognition
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const processedTranscript = isEmailInput ? processEmailInput(transcript) : transcript;
      if (onResultCallback) onResultCallback(processedTranscript, event.results[0][0].confidence);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (onErrorCallback) onErrorCallback(event.error);
    };
    
    recognition.start();
    return true;
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    if (onErrorCallback) onErrorCallback(error);
    return false;
  }
};

// Stop listening
export const stopListening = () => {
  if (recognition) {
    recognition.stop();
    return true;
  }
  return false;
};

// Set the language for recognition
export const setRecognitionLanguage = (language) => {
  if (recognition) {
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    return true;
  }
  return false;
};

// Voice commands processor
export const processVoiceCommand = (transcript, commands) => {
  const lowercaseTranscript = transcript.toLowerCase();
  
  for (const command of commands) {
    if (lowercaseTranscript.includes(command.trigger.toLowerCase())) {
      stopSpeaking();
      command.action();
      return true;
    }
  }
  
  return false;
};

// Create voice navigation commands
export const createVoiceNavigationCommands = (navigate) => {
  return [
    {
      trigger: 'go to dashboard',
      action: () => navigate('/dashboard')
    },
    {
      trigger: 'go to login',
      action: () => navigate('/login')
    },
    {
      trigger: 'go home',
      action: () => navigate('/')
    },
    {
      trigger: 'log out',
      action: () => {
        // Clear auth and redirect
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  ];
};