import React, { useState } from 'react';

function DoshaQuiz(props) {
  const [scores, setScores] = useState({ pitta: 0, vata: 0, kapha: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "What's your body type?",
      options: [
        { text: "Slim/Athletic/Muscular", dosha: "pitta" },
        { text: "Thin/Light frame", dosha: "vata" },
        { text: "Heavy/Sturdy/Stocky", dosha: "kapha" }
      ]
    },
    {
      question: "How's your digestion?",
      options: [
        { text: "Strong/Fast (get hungry quickly)", dosha: "pitta" },
        { text: "Variable/Irregular (unpredictable)", dosha: "vata" },
        { text: "Slow/Heavy (take time to digest)", dosha: "kapha" }
      ]
    },
    {
      question: "Do you get angry/frustrated easily?",
      options: [
        { text: "Yes, I'm quick to get angry", dosha: "pitta" },
        { text: "Not really, I get anxious instead", dosha: "vata" },
        { text: "No, I'm very calm and patient", dosha: "kapha" }
      ]
    },
    {
      question: "What's your energy level like?",
      options: [
        { text: "High, intense, sharp energy", dosha: "pitta" },
        { text: "Changeable, sometimes up, sometimes down", dosha: "vata" },
        { text: "Steady and consistent (but slow)", dosha: "kapha" }
      ]
    },
    {
      question: "How's your sleep?",
      options: [
        { text: "Light, need less sleep (6 hours or less)", dosha: "pitta" },
        { text: "Restless, need more sleep (9+ hours)", dosha: "vata" },
        { text: "Deep, heavy, hard to wake up", dosha: "kapha" }
      ]
    }
  ];

  const handleAnswer = (dosha) => {
    setScores({ ...scores, [dosha]: scores[dosha] + 1 });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    // Find which dosha has highest score
    const highest = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Your Result</h2>
        <h3 style={{ fontSize: '32px', color: '#007bff' }}>
          {highest.toUpperCase()}
        </h3>
        <p>You are a {highest} type!</p>
        
        <div style={{ marginTop: '20px' }}>
          <h4>Your Scores:</h4>
          <p>Pitta: {scores.pitta}/5</p>
          <p>Vata: {scores.vata}/5</p>
          <p>Kapha: {scores.kapha}/5</p>
        </div>

        <button
          onClick={() => props.onDoshaSelected(highest)}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          See Recommendations
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Dosha Assessment Quiz</h2>
      <p>Question {currentQuestion + 1} of {questions.length}</p>
      
      <h3 style={{ marginBottom: '20px' }}>{question.question}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.dosha)}
            style={{
              padding: '15px',
              textAlign: 'left',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {option.text}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Progress: {currentQuestion + 1}/{questions.length}
      </div>
    </div>
  );
}

export default DoshaQuiz;