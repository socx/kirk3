import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import useAuth from '../hooks/useAuth';

import PrivateLayout from '../components/PrivateLayout';
import WelcomeBanner from '../components/WelcomeBanner';

const Welcome = () => {
  let timeOfDay = 'morning';
  let iconOfDay = '🌤️';
  if (dayjs().hour() >= 12 && dayjs().hour() <= 16) {
    timeOfDay = 'afternoon';
    iconOfDay = '☀️';
  } else if (dayjs().hour() > 16 && dayjs().hour() < 24) {
    timeOfDay = 'evening';
    iconOfDay = '🌙';
  }

  const { getToken, } = useAuth();
  const navigate = useNavigate();
  
  const [user, setUser] = useState('');

  useEffect(() => {
    const token = getToken()
    if (token) {
      setUser(token);
    } else {
      navigate('/login');
    }
  }, []);
  
  return (
    <PrivateLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <WelcomeBanner user={user} />
      </div>
    </PrivateLayout>
  );
}

export default Welcome;
