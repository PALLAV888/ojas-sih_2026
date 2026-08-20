import React, { useState } from 'react';
import DoshaQuiz from './components/DoshaQuiz';
import RecommendationsList from './components/RecommendationsList';
import './App.css';

function App() {
  const [selectedDosha, setSelectedDosha] = useState(null);
  const [showQuiz, setShowQuiz] = useState(true);

  const handleDoshaSelected = (dosha) => {
    setSelectedDosha(dosha);
    setShowQuiz(false);
  };

  const handleReset = () => {
    setSelectedDosha(null);
    setShowQuiz(true);
  };

  return (
    <div className="App">
      <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
        <h1>🌿 OJAS</h1>
        <p>Know Your Dosha. Eat Right. Feel Better.</p>
      </div>

      {showQuiz ? (
        <DoshaQuiz onDoshaSelected={handleDoshaSelected} />
      ) : (
        <RecommendationsList 
          dosha={selectedDosha} 
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;