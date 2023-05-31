import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import { Post } from '@/src/types';
import { GetServerSideProps } from 'next';


const PostCreate = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    // 커뮤니티명 가져오기
    const router = useRouter();
    const { community: communityname } = router.query;
    const submitPost = async (e: FormEvent) => {
        e.preventDefault();
        // 포스트 제목이 공란이거나 communityname이 없다면 return
        if (title.trim() === "" || !communityname) return;

        try {
            // posts route에 요청
            const { data: post } = await axios.post<Post>("/posts", {
                title: title.trim(),
                body,
                community: communityname
            })

            // 생성한 경로로 이동
            router.push(`/${communityname}/${post.identifier}/${post.slug}`)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='flex flex-col justify-center pt-16'>
            <div className='w-10/12 mx-auto md:w-96'>
                <div className='p-4 bg-white rounded'>
                    <h1 className='mb-3 text-lg'>포스트 생성하기</h1>
                    <form onSubmit={submitPost}>
                        <div className='relative mb-2'>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="제목"
                                maxLength={20}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div
                                style={{ top: 10, right: 10 }}
                                className="absolute mb-2 text-sm text-gray-400 select-none"
                            >
                                {title.trim().length}/20
                            </div>
                        </div>
                        <textarea
                            rows={4}
                            placeholder="설명"
                            className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <div className='flex justify-end'>
                            <button
                                className='px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded'
                            >
                                생성하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostCreate;

// 권한 없는 유저는 login페이지로 이동시킴
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const cookie = req.headers.cookie;
        if (!cookie) throw new Error("쿠키가 없습니다.")

        // 쿠키가 있을 때 api 요청 보내기
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`,
            { headers: { cookie } })
        return { props: {} }
    } catch (error) {
        res.writeHead(307, { Location: "/login" }).end()
        
        return { props: {} }
    }
}