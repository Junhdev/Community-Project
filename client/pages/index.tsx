import Head from 'next/head'
import Image from 'next/image'
import useSWR from 'swr';
import axios from 'axios';
import { Community } from '@/src/types';
import Link from 'next/link';

const Home = () => {
  const fetcher = async (url: string) => {
    return await axios.get(url).then(res => res.data)
  }
  const address = `/subs/sub/topCommunity`;
  const { data: topCommunities } = useSWR<Community[]>(address, fetcher)

  return (
    <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
      {/* 포스트 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'>
        

      </div>

      {/* 사이드바 */}
      <div className='hidden w-4/12 ml-3 md:block'>
        <div className='bg-white border rounded'>
          <div className='p-4 border-b'>
            <p className='text-lg font-semibold text-center'>상위 커뮤니티</p>
          </div>

          {/* 커뮤니티 리스트 */}
          <div>
           
          <Link href="/communities/create">
                
              </Link>
                
              </div>
              </div>
              </div>
              </div>
            
  )
}

export default Home;

