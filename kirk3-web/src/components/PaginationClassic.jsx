import React from 'react';
import SkeletonLoader from './SkeletonLoader';


const PaginationClassic = ({ totalItems, itemsPerPage, currentPage, handlePreviousButtonClick, handleNextButtonClick, isLoading=false, itemName='record' }) => {
  const firstItemNumber = ((currentPage - 1) * itemsPerPage) + 1;
  const lastItemNumber = currentPage * itemsPerPage < totalItems ? currentPage * itemsPerPage : totalItems;
  const isLastPage = currentPage === Math.ceil(totalItems/itemsPerPage);

  const previousButtonClassname = currentPage === 1 
    ? "btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600"
    : "btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-indigo-500"

  const nextButtonClassname = isLastPage
    ? "btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600"
    : "btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-indigo-500"

  const onPreviousButtonClick = () => {
    if (handlePreviousButtonClick) handlePreviousButtonClick()
  }

  const onNextButtonClick = () => {
    if (handleNextButtonClick) handleNextButtonClick()
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav className="mb-4 sm:mb-0 sm:order-1" role="navigation" aria-label="Navigation">
        {isLoading ? (
          <SkeletonLoader type='rect' count= {2} height={40} width={100} />
        ) : (
          
            <ul className="flex justify-center">
              <li className="ml-3 first:ml-0">
                <span onClick={onPreviousButtonClick} className={previousButtonClassname}>&lt;- Previous</span>
              </li>
              <li className="ml-3 first:ml-0">
                <a onClick={onNextButtonClick} className={nextButtonClassname} href="#0">Next -&gt;</a>
              </li>
            </ul>
        )}
      </nav>
      {isLoading ? (
        <SkeletonLoader type='line' height={10} width={150} />
      ) : (
        <div className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
          {totalItems > 0 ? (
              <div>Showing <span className="font-medium text-slate-600 dark:text-slate-300">{firstItemNumber}</span> to <span className="font-medium text-slate-600 dark:text-slate-300">{lastItemNumber}</span> of <span className="font-medium text-slate-600 dark:text-slate-300">{totalItems}</span> {itemName}.</div>
            ) : (
              <div><span className="font-medium text-slate-600 dark:text-slate-300">No {itemName}</span></div>
            )

          }
          
        </div>
      )}
    </div>
  );
}

export default PaginationClassic;
