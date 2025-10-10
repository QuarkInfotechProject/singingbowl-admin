'use client';
import RootEmail from './RootEmail';
import { EmailResponseT } from '@/app/_types/email-Types/emailTypes';
import { useState, useEffect } from 'react';

const EmailView = () => {
  const [emailData, setEmailData] = useState<EmailResponseT | undefined>(
    undefined
  );
  useEffect(() => {
    const getEmails = async () => {
      try {
        const res = await fetch(`/api/email`, {
          method: 'GET',
        });
        const data = await res.json();
        setEmailData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getEmails();
  }, [EmailView])

  return <RootEmail emailData={emailData} />;
};
export default EmailView;
