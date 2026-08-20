import React from 'react';
import { RECOMMENDATIONS } from '../data/recommendations';

function RecommendationsList(props) {
  const { dosha } = props;
  const recommendation = RECOMMENDATIONS[dosha];

  if (!recommendation) {
    return <p>Invalid dosha</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>{recommendation.title}</h2>
      <p style={{ fontSize: '16px', color: '#666' }}>
        {recommendation.description}
      </p>

      {/* FOODS TO EAT */}
      <div style={{ marginTop: '30px' }}>
        <h3>✓ Recommended Foods For You:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {recommendation.foods.map((food, index) => (
            <div
              key={index}
              style={{
                padding: '15px',
                backgroundColor: '#e8f5e9',
                borderRadius: '4px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '24px' }}>{food.emoji}</div>
              <div style={{ fontSize: '14px', marginTop: '5px' }}>{food.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOODS TO AVOID */}
      <div style={{ marginTop: '30px' }}>
        <h3>❌ Avoid These Foods:</h3>
        <div>
          {recommendation.avoid.map((food, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: '#ffebee',
                borderRadius: '4px',
                borderLeft: '4px solid #e53935'
              }}
            >
              <strong>{food.name}</strong> - {food.reason}
            </div>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <div style={{ marginTop: '30px' }}>
        <h3>Benefits You'll Notice:</h3>
        <ul>
          {recommendation.benefits.map((benefit, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>
              ✓ {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Try eating these foods for 2 weeks. You'll notice the difference!
        </p>
      </div>

      {/* BUTTON TO GO BACK */}
      <button
        onClick={() => props.onReset && props.onReset()}
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Take Quiz Again
      </button>
    </div>
  );
}

export default RecommendationsList;