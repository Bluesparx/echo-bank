import "./App.css";
import { useContext, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthenticatedContext } from "@/context/AuthenticatedContext";
import CustomRoutes from "@/Routes";
import ScreenLoader from "@/components/ScreenLoader";
import Header from "@/components/Header";
import VoiceNavigation from "./components/VoiceNavigation";
import { initializeScreenReader } from "@/services/textToSpeech";

function App() {
  const { isAuthenticated, isLoader } = useContext(AuthenticatedContext);

  useEffect(() => {
    // Initialize text-to-speech service
    initializeScreenReader().then(success => {
      if (!success) {
        console.warn('Text-to-speech initialization failed');
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {isLoader ? (
        <ScreenLoader />
      ) : (
        <CustomRoutes />
      )}
      <VoiceNavigation />
      <ToastContainer />
    </div>
  );
}

export default App;
