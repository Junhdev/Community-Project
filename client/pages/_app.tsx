import type { AppProps } from 'next/app'
import Layout from 'src/components/Layout/Layout'
import 'styles/globals.css';
import Axios from 'axios';
import { AuthProvider } from '@/src/context/auth';
import axios from 'axios';
import { SWRConfig } from 'swr';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';



export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true;
  
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data
    }
  }

  return (
    <>
    <RecoilRoot>
    { /* fontawesome 적용 */ }
    <Head>
      <script defer src="https://use.fontawesome.com/releases/v6.1.1/js/all.js" integrity="sha384-xBXmu0dk1bEoiwd71wOonQLyH+VpgR1XcDH3rtxrLww5ajNTuMvBdL5SOiFZnNdp" crossOrigin="anonymous"></script>
    </Head>
    <SWRConfig
      value={{
        fetcher
      }}
    >
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
    </SWRConfig>
    </RecoilRoot>
    </>
  )
}

