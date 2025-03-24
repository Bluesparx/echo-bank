import { stopListening } from './speechRecognition';
const speechSynthesis = window.speechSynthesis;
let selectedVoice = null;

export const initializeScreenReader = async () => {
  if (!speechSynthesis) {
    console.error('Speech synthesis not supported in this browser');
    return false;
  }
  
  await selectVoice();
  return true;
};

// Set voice for speech synthesis
const selectVoice = async () => {
  const voices = await getAvailableVoices();
  const preferredVoices = voices.filter(voice => 
    voice.lang.includes('en') && 
    (voice.name.includes('Google') || voice.name.includes('Microsoft'))
  );
  
  selectedVoice = preferredVoices[0] || voices[0];
};

// Speak text
export const speak = (text) => {
  if (!speechSynthesis || !text) return false;
  
  speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  speechSynthesis.speak(utterance);
  return true;
};

// Stop speaking
export const stopSpeaking = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
};
export const readPageContent = (selector = 'main') => {
  const element = document.querySelector(selector);
  if (!element) return false;
  
  const content = extractTextContent(element);
  return speak(content);
};


const extractTextContent = (element) => {
  if (element.getAttribute('aria-hidden') === 'true' || 
      element.style.display === 'none' || 
      element.style.visibility === 'hidden') {
    return '';
  }
  
  if (element.tagName === 'IMG' && element.alt) {
    return `Image: ${element.alt}`;
  }
  
  if (element.tagName === 'BUTTON') {
    return `Button: ${element.textContent}`;
  }
  
  let content = '';
  
  if (element.getAttribute('aria-label')) {
    content += element.getAttribute('aria-label') + ' ';
  } else {
    if (element.childNodes) {
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          content += node.textContent.trim() + ' ';
        }
      }
    }
  }
  
  for (const child of element.children) {
    content += extractTextContent(child) + ' ';
  }
  
  return content.trim();
};

const convertEmailToSpeech = (email) => {
  if (!email) return '';
  
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;
  
  let speechLocalPart = localPart
    .replace(/[0-9]/g, match => `${match}`)
    .replace(/[._-]/g, '')
    .trim();
  
  let speechDomain = domain
    .replace(/[0-9]/g, match => `${match}`)
    .replace(/\./g, 'dot')
    .trim();
  
  return `${speechLocalPart} at ${speechDomain}`;
};

export const announce = (message) => {
  if (!speechSynthesis) return;
  
  speechSynthesis.cancel();
  stopListening();
  
  if (message.includes('field received')) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = selectedVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  } else {
    speak(message);
  }
};

const getAvailableVoices = () => {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
};