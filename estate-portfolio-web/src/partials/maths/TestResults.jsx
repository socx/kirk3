import React from 'react';

const TestResults = ({
  score,
}) => {
  
  const textColour = (score) => {
    if (score >= 70) return 'green';
    if (score >= 50) return 'amber';
    return 'red';
  }
  
  return (
    <div className="mx-auto flex  flex-col gap-y-2">
      <dd className="order-first text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
        You scored <span className={textColour(score)}>{score}%</span>
      </dd>
    </div>
  )
}

export default TestResults;
