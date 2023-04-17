import Head from 'next/head'
import Image from 'next/image'
import useSWR from 'swr';
import axios from 'axios';
import { Community } from '@/src/types';
import Link from 'next/link';
import { useAuthState } from '@/src/context/auth';

const Home = () => {

  const { authenticated } = useAuthState();
  const fetcher = async (url: string) => {
    return await axios.get(url).then(res => res.data)
  }
  const address = `/communities/community/topCommunities`;
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
            {topCommunities?.map((community) => (
              <div
                key={community.name}
                className="flex items-center px-4 py-2 text-xs border-b"
              >
                <Link href={`/c/${community.name}`}>
                  
                    <Image
                      src={community.imageUrl}
                      className="rounded-full cursor-pointer"
                      alt="Community"
                      width={24}
                      height={24}
                    />
                  
                </Link>
                <Link href={`/c/${community.name}`}>
                  
                    {community.name}
                  
                </Link>
                <p className='ml-auto font-md'>{community.postCount}</p>
              </div>
            ))}


          </div>
          {authenticated &&
            <div className='w-full py-6 text-center'>
              <Link href="/communities/select">
                
                  커뮤니티 만들기
                
              </Link>
            </div>
          }
        </div>
              </div>
              </div>
              
            
  )
}

export default Home;

