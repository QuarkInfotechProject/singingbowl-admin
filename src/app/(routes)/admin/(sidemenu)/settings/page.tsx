'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './loading';
import SettingsPage from './RootSettings';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton';

const Settings = () => {
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('api/settings');

      if (response.data && Array.isArray(response.data.data)) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="w-full h-full z-30 bg-gray-100">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage settings</CardDescription>
  
      </CardHeader>
      <CardContent>
   
   
      <div className="mx-auto text-md flex w-full flex-col justify-center space-y-4">
        <SettingsPage />
      </div>
  
    </CardContent>
    </Card>
  );
};

export default Settings;
