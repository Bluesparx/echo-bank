import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpeechRecognition } from '@/services/speechRecognition';
import { speak, announce, initializeScreenReader } from '@/services/textToSpeech';
import { AuthenticatedContext } from '@/context/AuthenticatedContext';
import { auth } from '@/config/Firebase';
import { signOut } from 'firebase/auth';

const getNavigationCommands = (isAuthenticated) => {
  const baseCommands = [
    {
      phrases: ['go to home', 'navigate to home', 'open home', 'go to homepage'],
      action: '/'
    }
  ];

  if (!isAuthenticated) {
    return [
      ...baseCommands,
      {
        phrases: ['go to login', 'navigate to login', 'open login', 'go to login page'],
        action: '/login'
      },
      {
        phrases: ['go to signup', 'navigate to signup', 'open signup', 'go to signup page'],
        action: '/signup'
      }
    ];
  }

  return [
    ...baseCommands,
    {
      phrases: ['go to dashboard', 'navigate to dashboard', 'open dashboard', 'go to dash'],
      action: '/dashboard'
    },
    {
      phrases: ['go to accounts', 'navigate to accounts', 'open accounts', 'open view accounts'],
      action: '/dashboard/viewAccounts'
    },
    {
      phrases: ['go to transactions', 'navigate to transactions', 'open transactions', 'open view transactions'],
      action: '/dashboard/transactions'
    },
    {
      phrases: ['go to profile', 'navigate to profile', 'open profile', 'open view profile'],
      action: '/dashboard/profile'
    },
    {
      phrases: ['go to settings', 'navigate to settings', 'open settings', 'open view settings'],
      action: '/dashboard/settings'
    },
    {
      phrases: ['log out', 'sign out', 'logout'],
      action: 'logout'
    }
  ];
};

function VoiceNavigation() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthenticatedContext);
  const { startListening, stopListening, isListening, error: speechError } = SpeechRecognition();

  useEffect(() => {
    const screenReaderInitialized = initializeScreenReader();
    
    if (!screenReaderInitialized) {
      announce('Voice features are not supported in your browser');
      return;
    }

    const commands = getNavigationCommands(isAuthenticated);
    const availableCommands = commands.map(cmd => cmd.phrases[0]).join(', ');
    announce(`Voice navigation is available. Click the microphone button or press Ctrl+Shift+V to start. Available commands: ${availableCommands}`);
  }, [isAuthenticated]);

  const handleVoiceCommand = (transcript) => {
    const commands = getNavigationCommands(isAuthenticated);
    const command = commands.find(cmd => 
      cmd.phrases.some(phrase => transcript.toLowerCase().includes(phrase.toLowerCase()))
    );
    
    if (command) {
      if (command.action === 'logout') {
        handleLogout();
      } else {
        announce(`Navigating to ${command.action}`);
        navigate(command.action);
      }
    } else {
      announce('Command not recognized. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      announce('Successfully logged out');
      navigate('/');
    } catch (error) {
      announce('Error logging out. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const startNavigation = () => {
    if (isListening) {
      stopListening();
      announce('Voice navigation stopped');
    } else {
      const commands = getNavigationCommands(isAuthenticated);
      const availableCommands = commands.map(cmd => cmd.phrases[0]).join(', ');
      announce(`Voice navigation started. Available commands: ${availableCommands}`);
      startListening(
        'navigation',
        handleVoiceCommand,
        (error) => {
          announce('Voice recognition error. Please try again.');
        }
      );
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        startNavigation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isListening]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={startNavigation}
        className={`p-4 rounded-full shadow-lg ${
          isListening ? 'bg-red-500' : 'bg-blue-500'
        } text-white hover:opacity-90 transition-opacity duration-200`}
        aria-label={isListening ? 'Stop voice navigation' : 'Start voice navigation'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      {speechError && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
          {speechError}
        </div>
      )}
    </div>
  );
}

export default VoiceNavigation;