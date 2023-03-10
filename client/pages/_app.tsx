import type { AppProps } from 'next/app'
import Layout from 'src/components/Layout/Layout'
import 'styles/globals.css';
import { RecoilRoot } from 'recoil';
import Axios from 'axios';

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api"
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
    
  )
}
