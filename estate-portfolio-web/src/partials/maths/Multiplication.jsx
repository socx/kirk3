import React from 'react';

const Multiplication = ({
  answer,
  multiplier,
  number,
}) => {
  return (
    <div className="mx-auto flex  flex-col gap-y-4">
      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
        {number} x {multiplier} = {answer}
      </dd>
    </div>
  )
}

export default Multiplication
