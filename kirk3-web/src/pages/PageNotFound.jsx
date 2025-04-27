import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import PrivateLayout from '../components/PrivateLayout';

import NotFoundImage from '../images/404-illustration.svg';
import NotFoundImageDark from '../images/404-illustration-dark.svg';

function PageNotFound() {

  return (
    <PrivateLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="max-w-2xl m-auto mt-16">
          <div className="text-center px-4">
            <div className="inline-flex mb-8">
              <img className="dark:hidden" src={NotFoundImage} width="176" height="176" alt="404 illustration" />
              <img className="hidden dark:block" src={NotFoundImageDark} width="176" height="176" alt="404 illustration dark" />
            </div>
            <div className="mb-6">Hmm...this page doesn’t exist. Try searching for something else!</div>
            <Link to="/dashboard" className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
              Back To Dashboard
            </Link>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}

export default PageNotFound;


