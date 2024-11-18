import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../components/PrivateLayout';

function Dashboard() {


  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="max-w-2xl m-auto mt-16">
          <div className="text-center px-4">
            <div className="inline-flex mb-8">
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
