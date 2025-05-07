import React, { useEffect, useState} from 'react';
import { version } from '../../package.json';

import LogoImage from '../images/logo.png';

const PublicHeader = () => {
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    setAppVersion(version);
  }, [])

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <img className="" src={LogoImage} width="45px" height="45px" alt="Logo" />
        <span>App Ver: {appVersion}</span>
      </div>
    </div>
  )
};

export default PublicHeader;
