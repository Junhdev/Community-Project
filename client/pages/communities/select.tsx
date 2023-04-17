import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useRecoilState } from "recoil";
import { recoilCategoryItem } from "@/src/atoms/categoryAtom";


const SelectCategory = () => {
    const [recoilCategory, setRecoilCategory] = useRecoilState(recoilCategoryItem);
   
    const categoryList = [
        {
          name: "카테고리1",

        },
        {
            name: "카테고리2",
         
        },
        {
            name: "카테고리3",
         
        }
      ]

    const [errors, setErrors] = useState<any>({});
    let router = useRouter();
    
    /* TypeError: Cannot read properties of undefined (reading 'toLowerCase') 때문에 axios로 데이터 전달은 해주면 안된다(createCommunity 핸들러에서 name관련 로직 진행안되면 error 발생시키므로! (여기서는 name데이터를 전달할 수 없다)) */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        // 제출 성공시 try내부 코드 실행
        try {
            router.push('/communities/create');
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data);
        }
    }
    
    return ( //카테고리 UI 생성
    <>
    {categoryList.map((a,i)=>(
                <div key={i}>
                    <form onSubmit={handleSubmit}>
                    <button onClick={()=>{setRecoilCategory([a.name])}}>카테고리명: {a.name}</button>
                    </form>
                </div>
            ))}

    </>
    )
}

export default SelectCategory;