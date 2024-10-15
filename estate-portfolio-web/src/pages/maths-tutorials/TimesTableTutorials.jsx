import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";

import useEventListener from '../../hooks/useEventListener';

import AnsweredQuestions from '../../partials/maths/AnsweredQuestions';
import Header from '../../partials/Header';
import Multiplication from '../../partials/maths/Multiplication';
import Sidebar from '../../partials/Sidebar';
import TestResults from '../../partials/maths/TestResults';

import MeetupImage from '../../images/meetup-image.jpg';
import MeetupPhoto01 from '../../images/meetup-photo-01.jpg';
import MeetupPhoto02 from '../../images/meetup-photo-02.jpg';
import MeetupPhoto03 from '../../images/meetup-photo-03.jpg';
import MeetupThumb from '../../images/meetups-thumb-02.jpg';
import UserImage01 from '../../images/user-32-01.jpg';
import UserImage02 from '../../images/user-32-02.jpg';
import UserImage03 from '../../images/user-32-03.jpg';
import UserImage04 from '../../images/user-32-04.jpg';
import UserImage05 from '../../images/user-32-05.jpg';
import UserImage06 from '../../images/user-32-06.jpg';
import UserImage07 from '../../images/user-32-07.jpg';
import UserImage08 from '../../images/user-32-08.jpg';
import Avatar02 from '../../images/avatar-02.jpg';
import Avatar03 from '../../images/avatar-03.jpg';
import Avatar04 from '../../images/avatar-04.jpg';

import TimesTableEquations from './times-tables-equations';


const TimesTableTutorials = () => {
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [endOfTest, setEndOfTest] = useState(false);
  const [currentEquation, setCurrentEquation] = useState(null);
  const [equations, setEquations] = useState([]);

  useEffect(() => {
    const table = id ?
      TimesTableEquations.find((t) => t.table == id) :
      TimesTableEquations.find((t) => t.table == 2);
    setEquations(table.equations)
    setCurrentEquation(table.equations[0]);
    setEndOfTest(false);
    setAnsweredQuestions([]);
  },[id]);

  const getNextEquation = (nextIndex) => {
    return nextIndex < equations.length ? equations[nextIndex] : null;
  }

  function handler({ key }) {
    if (endOfTest) {
      return;
    }

    if (String(key) === 'Enter') {
      setAnsweredQuestions([...answeredQuestions, currentEquation]);
      const nextEquation = getNextEquation(currentEquation.id);
      if (nextEquation) {
        setCurrentEquation(nextEquation);
      } else {
        setEndOfTest(true);
      }
      return;
    }

    if (String(key) === 'Backspace') {
      setCurrentEquation({...currentEquation, answer: `${currentEquation.answer.substring(0, currentEquation.answer.length - 1)}`});
      return;
    }

    if (!isNaN(String(key))) {
      setCurrentEquation({...currentEquation, answer: `${currentEquation.answer}${String(key)}`});
    }
  }
  
  useEventListener('keydown', handler);

  const scoreTest = () => {
    let sum = 0;
    for (let i = 0; i < answeredQuestions.length; i++) {
      sum += answeredQuestions[i].solution == answeredQuestions[i].answer ? 1 : 0;
    }
    return (parseFloat(sum/answeredQuestions.length) * 100).toFixed();
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} variant="v2" />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} variant="v3" />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Page content */}
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
              {/* Content */}
              <div>
                {/* <div className="mb-6">
                  <Link className="btn-sm px-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" to="/community/meetups">
                    <svg className="fill-current text-gray-400 dark:text-gray-500 mr-2" width="7" height="12" viewBox="0 0 7 12">
                      <path d="M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z" />
                    </svg>
                    <span>Back To Meetups</span>
                  </Link>
                </div> */}
                {/* <div className="text-sm font-semibold text-violet-500 uppercase mb-2">Mon 27 Dec, 2024 - 9:00 PM -&gt; 10:00 PM</div> */}
                <header className="mb-4">
                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">Times Table ({id})</h1>
                </header>

                {/* Meta */}
                <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 mb-6">
                  {/* Author */}
                  <div className="flex items-center sm:mr-4">
                    <a className="block mr-2 shrink-0" href="#0">
                      <img className="rounded-full" src={UserImage07} width="32" height="32" alt="User 04" />
                    </a>
                    <div className="text-sm whitespace-nowrap">
                      Hosted by{' '}
                      <a className="font-semibold text-gray-800 dark:text-gray-100" href="#0">
                        Monica Fishkin
                      </a>
                    </div>
                  </div>

                  {/* Right side */}
                  {/* <div className="flex flex-wrap items-center sm:justify-end space-x-2"> */}
                    {/* Tags */}
                    {/* <div className="text-xs inline-flex items-center font-medium border border-gray-200 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 rounded-full text-center px-2.5 py-1">
                      <svg className="w-4 h-3 fill-gray-400 dark:fill-gray-500 mr-2" viewBox="0 0 16 12">
                        <path d="m16 2-4 2.4V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.6l4 2.4V2ZM2 10V2h8v8H2Z" />
                      </svg>
                      <span>Online Event</span>
                    </div>
                    <div className="text-xs inline-flex font-medium uppercase bg-green-500/20 text-green-700 rounded-full text-center px-2.5 py-1">
                      Free
                    </div> */}
                  {/* </div> */}
                </div>

                {/* Image */}
                {/* <figure className="mb-6">
                  <img className="w-full rounded-sm" src={MeetupImage} width="640" height="360" alt="Meetup" />
                </figure> */}

                {/* Post content */}
                <div>
                  <Multiplication {...currentEquation} /> 
                  <h2 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-bold mb-2">Meetup Details</h2>
                  <p className="mb-6">In the world of AI, behavioural predictions are leading the charge to better machine learning.</p>
                  <p className="mb-6">
                    There is so much happening in the AI space. Advances in the economic sectors have seen automated business practices rapidly
                    increasing economic value. While the realm of the human sciences has used the power afforded by computational capabilities to
                    solve many human based dilemmas. Even the art scene has adopted carefully selected ML applications to usher in the technological
                    movement.
                  </p>
                  <p className="mb-6">
                    Join us every second Wednesday as we host an open discussion about the amazing things happening in the world of AI and machine
                    learning. Feel free to share your experiences, ask questions, ponder the possibilities, or just listen as we explore new topics
                    and revisit old ones.
                  </p>
                </div>

                <hr className="my-6 border-t border-gray-100 dark:border-gray-700/60" />

              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Answers block */}
                <div className="bg-white dark:bg-gray-800 p-5 shadow-sm rounded-xl lg:w-72 xl:w-80">
                  <div className="flex justify-between space-x-1 mb-5">
                    <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold">Answers</div>
                    <a className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">
                      Score
                    </a>
                  </div>
                  <ul className="space-y-3">
                    <li>
                      <div className="flex items-center justify-between">
                        <div className="grow flex items-center">
                          <div className="relative mr-3">
                            <img className="w-8 h-8 rounded-full" src={UserImage02} width="32" height="32" alt="User 02" />
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Haruki Masuno</span>
                          </div>
                        </div>
                        <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                          Invite
                        </button>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center justify-between">
                        <div className="grow flex items-center">
                          <div className="relative mr-3">
                            <img className="w-8 h-8 rounded-full" src={UserImage04} width="32" height="32" alt="User 04" />
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Joe Huang</span>
                          </div>
                        </div>
                        <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                          Invite
                        </button>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center justify-between">
                        <div className="grow flex items-center">
                          <div className="relative mr-3">
                            <img className="w-8 h-8 rounded-full" src={UserImage06} width="32" height="32" alt="User 06" />
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Carolyn McNeail</span>
                          </div>
                        </div>
                        <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                          Invite
                        </button>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center justify-between">
                        <div className="grow flex items-center">
                          <div className="relative mr-3">
                            <img className="w-8 h-8 rounded-full" src={UserImage08} width="32" height="32" alt="User 08" />
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Lisa Sitwala</span>
                          </div>
                        </div>
                        <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                          Invite
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TimesTableTutorials;

{/* <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <dl className="grid grid-cols-1 gap-x-16 gap-y-16 text-center lg:grid-cols-2">
                {endOfTest ? (
                    <TestResults score={scoreTest()} />
                  ) : (
                    <Multiplication {...currentEquation} /> 
                  )}
                <AnsweredQuestions equations={answeredQuestions} />
              </dl>
            </div>
          </div> */}