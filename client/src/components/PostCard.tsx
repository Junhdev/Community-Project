import axios from 'axios'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { useAuthState } from '../context/auth'
import { Post } from '../types'

interface PostCardProps {
    post: Post
    communityMutate?: () => void
    mutate?: () => void
}

const PostCard = ({
    post: {
        identifier,
        slug,
        title,
        body,
        communityname,
        createdAt,
        likeScore,
        userLike,
        commentCount,
        url,
        username,  
        community
    },
    mutate,
    communityMutate
}: PostCardProps) => {
    const router = useRouter();
    // 메인페이지와의 분기처리 해주기
    const isInCommunityPage = router.pathname === "/c/[community]"

    const { authenticated } = useAuthState();

    const like = async (value: number) => {
        if (!authenticated) router.push("/login");

        if (value === userLike) value = 0;

        try {
            await axios.post("/votes", { identifier, slug, value });
            if (mutate) mutate();
            if (communityMutate) communityMutate();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            className='flex mb-4 bg-white rounded'
            id={identifier}
        >
            {/* 좋아요 싫어요 기능 부분 */}
            <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                {/* 좋아요 */}
                <div
                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => like(1)}
                >
                    {userLike === 1 ?
                        <FaArrowUp className="text-red-500" />
                        : <FaArrowUp />
                    }
                </div>
                <p className="text-xs font-bold">{likeScore}</p>
                {/* 싫어요 */}
                <div
                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                    onClick={() => like(-1)}
                >
                    {userLike === -1 ?
                        <FaArrowDown className="text-blue-500" />
                        : <FaArrowDown />
                    }
                </div>
            </div>
            {/* 메인 페이지 포스트 데이터 부분 */}
            <div className="w-full p-2">
                <div className='flex items-center'>
                    {!isInCommunityPage && (
                        <div className='flex items-center'>
                            <Link href={`/c/${communityname}`}>
                                <span>
                                    <Image
                                        src={community!.imageUrl}
                                        alt="community"
                                        className='rounded-full cursor-pointer'
                                        width={12}
                                        height={12}
                                    />
                                </span>
                            </Link>
                            <Link href={`/r/${communityname}`}>
                                <span className="ml-2 text-xs font-bold cursor-pointer hover:underline">
                                    /r/{communityname}
                                </span>
                            </Link>
                            <span className="mx-1 text-xs text-gray-400">•</span>
                        </div>
                    )}

                    <p className="text-xs text-gray-400">
                        Posted by
                        <Link href={`/u/${username}`}>
                            <span className="mx-1 hover:underline">/u/{username}</span>
                        </Link>
                        <Link href={url}>
                            <span className='mx-1 hover:underline'>
                                {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                            </span>
                        </Link>
                    </p>
                </div>

                <Link href={url}>
                    <span className="my-1 text-lg font-medium">{title}</span>
                </Link>
                {body && <p className="my-1 text-sm">{body}</p>}
                <div className="flex">
                    <Link href={url}>
                        <span>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span>{commentCount}</span>
                        </span>
                    </Link>

                </div>
            </div>
        </div>
    )
}

export default PostCard;