import axios from 'axios';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { useAuthState } from '@/src/context/auth';
import SideBar from '@/src/components/SideBar';
import { Post } from '@/src/types';
import PostCard from '@/src/components/PostCard';
import { User } from '@/src/types';

const CommunityPage: React.FC = () => {
    const [myCommunity, setMyCommunity] = useState(false);
    const { authenticated, user } = useAuthState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<any>({});
    
    




    // 커뮤니티별 페이지 데이터 가져오기
    
    const router = useRouter();
    console.log(router);

    // router에 query로 url정보가 담겨있으므로
    // router.query { community: 'test1' }
    const communityname = router.query.community;

    // communities.ts의 getCommunity 핸들러에 요청
    // mutate설정하고 <PostCard />에 props로 내려주기
    const { data: community, error, mutate } = useSWR(communityname ? `/communities/${communityname}` : null);
    console.log('community', community);

    useEffect(() => {
        if (!community || !user) return;
        // 로그인 되어있고 해당 유저가 해당 커뮤니티를 만든 유저인지 판별 >> 맞다면 true 반환
        setMyCommunity(authenticated && user.username === community.username);
    }, [community]);

    // 백엔드에 이미지 업로드 요청 보내기
    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null) return;

        const file = event.target.files[0];
        console.log('file', file); 

        const formData = new FormData();
        formData.append("file", file);
        // type error를 !로 제거(fileInputRef.current가 not null인 것이 확실하기 때문)
        formData.append("type", fileInputRef.current!.name);

        try {
            await axios.post(`/communities/${community.name}/upload`, formData, {
                headers: { "Context-Type": "multipart/form-data" }
            });
        } catch (error) {
            console.log(error);
        }
    }

    
    // 이미지 업로드 DOM 선택
    const openFileInput = (type: string) => {
        if(!myCommunity) return;
        const fileInput = fileInputRef.current;
        if(fileInput) {
            fileInput.name = type;
            fileInput.click();
        } 
    }

    let renderPosts;
    // 커뮤니티가 존재하지 않을때
    if (!community) {
        renderPosts = <p className="text-lg text-center">로딩중...</p>
    } 
    // 커뮤니티는 존재하지만 포스트가 존재하지 않을때
    // 백엔드에서 posts배열을 community instance에 담아서 프론트에 전달 후 사용
    // data: community로 작명해서 community instance 받아오기
    else if (community.posts.length === 0) {
        renderPosts = <p className="text-lg text-center">아직 작성된 포스트가 없습니다.</p>
    } 
    // 커뮤니티와 포스트가 모두 존재할때
    else {
        renderPosts = community.posts.map((post: Post) => (
            <PostCard key={post.identifier} post={post} communityMutate={mutate} />
        ))
    }

    const inviteHandler = async (event: FormEvent) => {
        
        try {
            event.preventDefault();
            // 서로 다른 ORIGIN에서 cookie에 token 저장을 위해 프론트에서 {withCredentials: true} 설정 필요
            const res = await axios.post("/invite", {   communityname }, { withCredentials: true })
            console.log(res);
            // 로그인이 성공하면 context에 user정보 저장
            
            

            router.push(`/users/${community.username}`)
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data || {})
        }
    }

    const 초대할유저찾기모달 = async (event: any) => {
        
        try {
            event.preventDefault();
            // 서로 다른 ORIGIN에서 cookie에 token 저장을 위해 프론트에서 {withCredentials: true} 설정 필요
            const res = await axios.post("/invite", {   communityname }, { withCredentials: true })
            console.log(res);
            // 로그인이 성공하면 context에 user정보 저장
            
            

            router.push(`/users/${community.username}`)
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data || {})
        }
    }

    return (
        <>
            {community &&
                <>
                    <div>
                        <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage} />
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
                                    onClick={() => openFileInput("banner")}
                                >
                                </div>
                            ) : (
                                <div className='h-20 bg-gray-400'
                                onClick={() => openFileInput("banner")}
                                ></div>
                            )}
                        </div>

                        {/* 커뮤니티 메타 데이터 */}
                        <div className='h-20 bg-white'>
                            <div className='relative flex max-w-5xl px-5 mx-auto'>
                                {/* 커뮤니티 아이콘 이미지 UI */}
                                <div className='absolute' style={{ top: -15 }}>
                                    {community.imageUrl && (
                                        <Image
                                            src={community.imageUrl}
                                            alt="커뮤니티 이미지"
                                            width={70}
                                            height={70}
                                            className="rounded-full"
                                            onClick={() => openFileInput("image")}
                                        />
                                    )}
                                </div>
                                {/* 커뮤니티명 UI */}
                                <div className='pt-1 pl-24'>
                                    <div className='flex items-center'>
                                        <h1 className='text-3xl font-bold '>{community.title}</h1>
                                    </div>
                                    <p className='font-bold text-gray-400 text-small'>
                                        {community.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 포스트와 사이드바 */}
                    <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
                        <div className="w-full md:mr-3 md:w-8/12">{renderPosts}</div>
                        <SideBar community={community} />
                    </div>

                    {/* 커뮤니티 초대하기*/}
                    <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
                    
                        <div className="w-full md:mr-3 md:w-8/12">
                            <form onSubmit={inviteHandler}>
                                
                            
                            <button className='w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded'
                            onClick={초대할유저찾기모달}>
                                {/* 모달창 만들기 - 유저 검색 후 클릭 후 초대하기 버튼 생성 */}
                            커뮤니티 초대하기
                            </button>
                            </form>
                        </div>
                        
                    </div>
                </>
            }
        </>
    )
}
export default CommunityPage;