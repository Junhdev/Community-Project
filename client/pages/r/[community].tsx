import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import Image from 'next/image';


const CommunityPage: React.FC = () => {

    // 커뮤니티별 페이지 데이터 가져오기
    const fetcher = async (url: string) => {
        try {
            const res = await axios.get(url);
            return res.data;
        } catch (error: any) {
            throw error.response.data
        }
    }
    const router = useRouter();
    console.log(router);

    // router에 query로 url정보가 담겨있으므로
    // router.query { community: 'test1' }
    const communityname = router.query.community;

    
    const { data: community, error } = useSWR(communityname ? `/communities/${communityname}` : null, fetcher);
    console.log('community', community);
    return (
        <>
            {community &&
                <>
                    <div>
                        
                        {/* 배너 이미지 */}
                        <div className="bg-gray-400">
                            {community.bannerUrl ? (
                                <div
                                    className='h-56'
                                    style={{
                                        backgroundImage: `url(${community.bannerUrl})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
    
                                >
                                </div>
                            ) : (
                                <div className='h-20 bg-gray-400'
                                ></div>
                            )}
                        </div>

                        {/* 커뮤니티 메타 데이터 */}
                        <div className='h-20 bg-white'>
                            <div className='relative flex max-w-5xl px-5 mx-auto'>
                                {/* 커뮤니티 배너 이미지 UI */}
                                <div className='absolute' style={{ top: -15 }}>
                                    {community.imageUrl && (
                                        <Image
                                            src={community.imageUrl}
                                            alt="커뮤니티 이미지"
                                            width={70}
                                            height={70}
                                            className="rounded-full"
                                            
                                        />
                                    )}
                                </div>
                                {/* 커뮤니티명 UI */}
                                <div className='pt-1 pl-24'>
                                    <div className='flex items-center'>
                                        <h1 className='text-3xl font-bold '>{community.title}</h1>
                                    </div>
                                    <p className='font-bold text-gray-400 text-small'>
                                        /r/{community.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
            }
        </>
    )
}
export default CommunityPage;