import { useEffect } from 'react';
import { useRouter } from 'next/router';

const VotreRoute = () => {
  const router = useRouter();

  useEffect(() => {
      router.replace('https://shop-test-admin.vercel.app');
  }, []);

  return 
};

export default VotreRoute;
