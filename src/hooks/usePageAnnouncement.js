import { useEffect, useRef } from 'react';
import { announce, initializeScreenReader, speak } from '@/services/textToSpeech';
import { stopSpeaking } from '@/services/textToSpeech';
import { SpeechRecognition } from '@/services/speechRecognition';

export const usePageAnnouncement = (pageTitle, availableActions = []) => {
  const hasAnnounced = useRef(false);
  const { stopListening } = SpeechRecognition();
  useEffect(() => {
    const initializeAndAnnounce = async () => {
      if (hasAnnounced.current) return;

      try {
        // Stop any ongoing speech and recognition
        stopSpeaking();
        stopListening();

        // Initialize screen reader
        const initialized = await initializeScreenReader();
        if (!initialized) {
          console.warn('Screen reader initialization failed');
          return;
        }

        let announcement = '';
        
        // Special handling for landing page
        if (pageTitle.toLowerCase() === 'homepage') {
          announcement = 'Welcome to Echo Bank. ';
          announcement += 'You can get started by creating a new account or signing in to your existing account. ';
          if (availableActions.length > 0) {
            announcement += 'Available commands: ';
            announcement += availableActions.join(', ');
          }
        } else {
          // For other pages
          announcement = `${pageTitle}. `;
          if (availableActions.length > 0) {
            announcement += 'You can: ';
            announcement += availableActions.join(', ');
          }
        }

        // Use speak instead of announce for homepage to ensure it works on first load
        if (pageTitle.toLowerCase() === 'homepage') {
          announce(announcement, true); // Set urgent to true for homepage
        } else {
          announce(announcement, false); // Set urgent to false for non-homepage announcements
        }

        // Mark that we've announced for this page
        hasAnnounced.current = true;
      } catch (error) {
        console.error('Error in page announcement:', error);
      }
    };

    initializeAndAnnounce();
  }, [pageTitle]); // Only depend on pageTitle, not availableActions

  // Reset the ref when the component unmounts
  useEffect(() => {
    return () => {
      hasAnnounced.current = false;
    };
  }, []);
};

// Helper function to extract readable text from DOM
const extractTextContent = (element) => {
  if (!element) return '';
  
  // Skip hidden elements
  if (element.getAttribute('aria-hidden') === 'true' || 
      element.style.display === 'none' || 
      element.style.visibility === 'hidden') {
    return '';
  }
  
  // Read alternative text for images
  if (element.tagName === 'IMG' && element.alt) {
    return `Image: ${element.alt}`;
  }
  
  // Read button content
  if (element.tagName === 'BUTTON') {
    return `Button: ${element.textContent}`;
  }
  
  // Get all text, including from child elements
  let content = '';
  
  // First check for ARIA attributes
  if (element.getAttribute('aria-label')) {
    content += element.getAttribute('aria-label') + ' ';
  } else {
    // Get direct text content
    if (element.childNodes) {
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          content += node.textContent.trim() + ' ';
        }
      }
    }
  }
  
  // Process children recursively
  for (const child of element.children) {
    content += extractTextContent(child) + ' ';
  }
  
  return content.trim();
}; 