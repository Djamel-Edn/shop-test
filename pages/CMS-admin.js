import { useEffect } from 'react';
import { useRouter } from 'next/router';

const VotreRoute = () => {
  const router = useRouter();

  useEffect(() => {
      router.replace('../../admin/pages/index ');
  }, []);

  return 
};

export default VotreRoute;
