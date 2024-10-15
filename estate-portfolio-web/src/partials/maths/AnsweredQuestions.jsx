import React from 'react';

const AnsweredQuestions = ({
  equations,
}) => {

  const answerColour = (equation) => equation.answer == equation.solution ? 'green' : 'red';
  return (
    // <div className="mx-auto flex  flex-col gap-y-2">
    //   {equations.map((equation) => (
    //     <dt  key={equation.id} className="text-base leading-7 text-gray-600">
    //       {equation.number} x {equation.multiplier} = <span className={answerColour(equation)}>{equation.answer} </span>
    //     </dt>
    //   ))}
    //   <dd className="order-first text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
    //     Answered
    //   </dd>
    // </div>
    <div className="bg-white dark:bg-gray-800 p-5 shadow-sm rounded-xl lg:w-72 xl:w-80">
      <div className="flex justify-between space-x-1 mb-5">
        <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold">Answers</div>
        <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">
          Score
        </a>
      </div>
      <ul className="space-y-3">
        {equations.map((equation) => (
          <li  key={equation.id}>
            <div className="flex items-center justify-between">
              <div className="grow flex items-center">
                <div className="relative mr-3">
                  <img className="w-8 h-8 rounded-full" src={UserImage02} width="32" height="32" alt="User 02" />
                </div>
                <div className="truncate">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100"> {equation.number} x {equation.multiplier} = <span className={answerColour(equation)}>{equation.answer} </span></span>
                </div>
              </div>
              <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                Invite
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ul className="mt-3">
        {equations.map(({id, answer, multiplier, number, solution}) => (
          <li key={id} className="flex items-center border-t border-gray-100 dark:border-gray-700/60 py-2">
            {answer == solution ? (
              <svg className="w-3 h-3 shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 mr-2" viewBox="0 0 12 12">
                <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
              </svg>
            )}
           
            <div className="text-sm text-gray-400 dark:text-gray-500 line-through">
              {number} x {multiplier} = <span className="black">{answer} </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AnsweredQuestions;
