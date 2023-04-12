import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router"
import useSWR from 'swr';
import { FormEvent, useState } from "react";
import { Post } from "@/src/types";
import dayjs from "dayjs";
import { useAuthState } from "@/src/context/auth";


const PostPage = () => {
    
    const router = useRouter();
    const { identifier, community, slug } = router.query;
    // fetcher함수는 _app.tsx에서 관리하기
    const { data: post, error} = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);
    const { authenticated, user } = useAuthState();
    const [newComment, setNewComment] = useState("");

    // 게시글에 대한 댓글 작성 핸들러
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // 댓글창이 공란일 때 return
        if (newComment.trim() === "") {
            return;
        }

        try {
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
                body: newComment
            });
            // 댓글창 공란으로 만들기
            setNewComment("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            <div className="w-full md:mr-3 md:w-8/12">
                <div className="bg-white rounded">
                    {post && (
                        <>
                            
                                <div className="mt-10 py-2 pr-2">
                                    <div className="flex items-center">
                                        <p className="text-xs test-gray-400">
                                            Posted by                <i className="fas fa-abacus"></i>      
                                            <Link href={`/u/${post.username}`}>
                                                <span className="mx-1 hover:underline">
                                                    /u/{post.username}
                                                </span>
                                            </Link>
                                            <Link href={post.url}>
                                                <span className="mx-1 hover:underline">
                                                    {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                                                </span>
                                            </Link>
                                        </p>
                                    </div>
                                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                                    <p className="my-3 text-sm">{post.body}</p>
                                    <div className="flex">
                                        <button>
                                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                                            <span className="font-bold">
                                                {post.commentCount} Comments
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            

                            {/* 댓글 작성 구간 */}
                            <div className="pr-6 mb-4">
                                { /* 로그인 된 유저만 댓글 작성 가능하게 하기 */ }
                                {authenticated ?
                                    (<div>
                                        <p className="mb-1 text-xs">
                                            <Link href={`/u/${user?.username}`}>
                                                <span className="font-semibold text-blue-500">
                                                    {user?.username}
                                                </span>
                                            </Link>
                                            {" "}으로 댓글 작성
                                        </p>
                                        <form onSubmit={handleSubmit}>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                                                onChange={e => setNewComment(e.target.value)}
                                                value={newComment}
                                            >
                                            </textarea>
                                            <div className="flex justify-end">
                                                <button
                                                    className="px-3 py-1 text-white bg-gray-400 rounded"
                                                    // 댓글이 공란일 때 버튼 누를 수 없게 하기
                                                    disabled={newComment.trim() === ""}
                                                >
                                                    댓글 작성
                                                </button>
                                            </div>
                                        </form>
                                    </div>)
                                    :
                                    // 비로그인 유저가 댓글 작성 시도할 때 
                                    (<div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                                        <p className="font-semibold text-gray-400">
                                            댓글 작성을 위해서 로그인 해주세요.
                                        </p>
                                        <div>
                                            <Link href={`/login`}>
                                                <span className="px-3 py-1 text-white bg-gray-400 rounded">
                                                    로그인
                                                </span>
                                            </Link>
                                        </div>
                                    </div>)
                                }
                            </div>
                                
                                    
                            
                            {/* 댓글 리스트 부분 */}
                            
                            
                            

                        </>
                    )}
                </div>
            </div>
        </div>
    )

    
}
    
export default PostPage;