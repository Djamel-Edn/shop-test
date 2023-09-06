import React from 'react';
import Header from './Header';
import Footer from './footer';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();
  
  const Title = router.asPath.substring(1,16)

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{Title}</title>
        <link rel="shortcut icon" href="" type="image/x-icon" />
      </Head>
      <Header />
      <div className=''>{children}</div>
      <Footer />
    </div>
  );
}
