import type { AppProps } from 'next/app'
import Layout from 'src/components/Layout/Layout'
import 'styles/globals.css';
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
    
  )
}
