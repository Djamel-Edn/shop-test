import '@/styles/globals.css'
import Layout from '@/components/Layout';
import {Roboto} from 'next/font/google' 
import { CartContextProvider } from './../components/CartContext';
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
export default function App({ Component, pageProps }) {
  return (
  <div className={roboto.className}>
        <CartContextProvider>
      <Layout>
    <Component {...pageProps} />
      </Layout>
        </CartContextProvider>
  </div>
  )
}
