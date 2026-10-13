import React from 'react';
import { router } from 'expo-router';

export default function Index() {
  React.useEffect(() => {
    router.replace('/auth/role-select');
  }, []);

  return null;
}