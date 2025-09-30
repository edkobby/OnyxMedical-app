
"use client"

import { useEffect } from 'react';
import AOS from 'aos';

const AOSProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    AOS.init({
      duration: 750,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return <>{children}</>;
};

export default AOSProvider;
