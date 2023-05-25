import InputGroup from '@/src/components/InputGroup';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react'
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';

import * as yup from 'yup';



type MeetingCreateValue = {
  title: string
}

const [title, setTitle] = useState("");
const [date, setDate] = useState("");
const [location, setLocation] = useState("");
const [errors, setErrors] = useState<any>({});

interface Props {
    handleCloseButtonClick: () => void;
    tagList: Tag[];
    fetchTagList: () => Promise<void>;
    currentMeeting: Meeting | null;
  }
  
  const formatDate = (date: Date) => {
    const [y, m, d] = date
      .toLocaleDateString()
      .split('.')
      .map((str) => str.trim().padStart(2, '0'));
    return [y.padStart(4, '0'), m.padStart(2, '0'), d.padStart(2, '0')].join('-');
  };
  
  const isSameOrAfter = (time1: string, time2: string) => {
    return time1 >= time2;
  };
  

const MeetingCreate = ({ handleCloseButtonClick, tagList, fetchTagList, currentMeeting }: Props) => {
  const createMeetingSchema = yup.object().shape({
    title: yup.string().required('제목을 입력해 주세요.'),
  })
  let router = useRouter()
  let {
    query: { id },
  } = router

 
    const [tagId, setTagId] = useState<number | null>(currentMeeting ? currentMeeting.tagId : null);
    const [locationObject, setLocationObject] = useState<Location | null>(currentMeeting && currentMeeting?.location !== null && currentMeeting?.location !== '' ? { location: currentMeeting!.location, lng: currentMeeting!.lng, lat: currentMeeting!.lat } : null); // { location, lng, lat }
    
   
  
    const { currentDate, getMonth, getDate } = useCurrentDate();
  
   
   
  
    const schema = yup.object().shape({
      title: yup.string().required(),
      tagId: yup.number().required(),
      startedAt: yup.string().required(),
      endedAt: yup.string().when('startedAt', (startedAt) => {
        return yup.string().test('e > s', '종료 시각은 시작 시각과 같거나 그 이후여야 해요.', (endedAt) => {
          if (!endedAt) return false;
          return isSameOrAfter(endedAt, startedAt);
        });
      }),
      importance: yup.number().required(),
      isPublic: yup.bool(),
      location: yup.string().nullable(),
      lat: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .nullable(),
      lng: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .nullable(),
      content: yup.string(),
    });

    const {
      control,
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
    });
  
    const { replace } = useFieldArray({
      control,
      title: 'labels',
    });
  
    type ColumnTitle = '약속명' | '태그' | '시간' | '위치' | '메모';
  
    const Row = ({ title, content }: { title: ColumnTitle; content: JSX.Element }) => {
      return (
        <tr>
          <td>{title}</td>
          <td>{content}</td>
        </tr>
      );
    };

    
  /* 태그로 대신
  const [keyword, setKeyword] = useState<SearchKeywordValue>()
  const [category, setCategory] = useState()
  */

/*
  const handleCreateMeeting = (values: MeetingCreateValue) => {
    /* 지도 api 가져오기
    if (!keyword?.keyword) {
      openToast('지도에서 맛집을 선택해 주세요')
      const keywordInput = document.getElementById('keyword')
      keywordInput?.classList.add('input-error')
      return
    }
    
    if (!category) {
      openToast('카테고리를 선택해 주세요')
      return
    }
    mutate({ ...values, category, crew: id })
  }
  */

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    try {
        const res = await axios.post("/meetings", { title, date, location });
        
        router.push(`/${res.data.title}`);
    } catch (error: any) {
        console.log(error);
        setErrors(error.response.data);
    }
}

  /* react-query 사용 
  const { mutate, isLoading } = useMutationHandleError(
    createLunch,
    {
      onSuccess: (data: ApiResponseData<Lunch>) => {
        const { message, result } = data
        openToast(message || '오늘의 메뉴를 등록했습니다.')
        router.push(`/meeting/${result.meeting}`)
      },
    },
    '오늘의 메뉴를 등록할 수 없습니다.',
  )
    */
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  return (
    
        <S.ModalContainer>
      <S.CloseButton onClick={handleCloseButtonClick} />
      <S.Date>{`• ${getMonth() + 1}.${getDate()} •`}</S.Date>
      <S.MeetingForm onSubmit={currentMeeting ? handleSubmit(editMeeting) : handleSubmit(createMeeting)}>
        <S.FormTable>
          <tbody>
            <Row title="약속명" content={<S.InputBar defaultValue={currentMeeting ? currentMeeting.title : ''} {...register('title')} />} />
            <input type="number" {...register('tagIdx')} hidden={true} />
            <Row title="태그" content={<TagInput tagIdx={tagIdx} setTagIdx={setTagIdx} tagList={tagList} fetchTagList={fetchTagList} isTagInputFocused={isTagInputFocused} setIsTagInputFocused={setIsTagInputFocused} />} />
            <Row
              title="시간"
              content={
                <>
                  <S.InputTimeBar type="time" defaultValue={currentMeeting ? currentMeeting.startedAt : ''} {...register('startedAt')} />
                  {' ~ '}
                  <S.InputTimeBar type="time" defaultValue={currentMeeting ? currentMeeting.endedAt : ''} {...register('endedAt')} />
                </>
              }
            />
            
            
              <input {...register('lat')} hidden={true} />
              <input {...register('lng')} hidden={true} />
              <input {...register('location')} hidden={true} />
              <Row title="위치" content={<LocationSearchInput locationObject={locationObject} setLocationObject={setLocationObject} />} />
              <Row title="메모" content={<S.InputArea defaultValue={currentMeeting ? currentMeeting.content : ''} {...register('content')} />} />
            </tbody>
          </S.FormTable>
       
        <S.SubmitButton onClick={setValues}>{currentMeeting ? 'EDIT Meeting' : 'NEW Meeting!'}</S.SubmitButton>
      </S.MeetingForm>
      </S.ModalContainer>
  )}

  export default MeetingCreate;

{/*
      <WhiteRoundedCard>
        <div classtitle="text-xl font-bold">약속 만들기</div>
        <Stepper>
          <Stepper.Step>
            <div>
              <p classtitle="mb-4 mt-1 text-sm">
                친구들과 만들고 싶은 약속을 생성하세요
              </p>
              {/*<WrappedStepperContextSearchKeywordMap setKeyword={setKeyword} /> }
            </div>
          </Stepper.Step>
          <Stepper.Step>
            <div>
             
              {/*<p classtitle="mb-2 font-bold">{keyword?.keyword}</p> }
              <form
                onSubmit={handleSubmit}
                options={{
                  resolver: yupResolver(createMeetingSchema),
                  mode: 'onBlur',
                }}>
              
                <InputGroup
                  
                  placeholder="약속명"
                  value={title}
                  setValue={settitle}
                  error={errors.title}
              
                />
                <InputGroup
                  
                  placeholder="약속 날짜 및 시간"
                  value={date}
                  setValue={setDate}
                  error={errors.date}
              
                />
                <InputGroup
                  
                  placeholder="약속 위치"
                  value={location}
                  setValue={setLocation}
                  error={errors.location}
              
                />

                {/*<SearchCategory setCategory={setCategory} category={category} />}
                <button
                    classtitle="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded"
                >
                    약속 정하기
                </button>
              </form>
            </div>
          </Stepper.Step>
          <Stepper.Button
            atctionType="prev"
            text="다시 선택하기"
            color="blue"
            classtitle="mt-4"
          />
          {/*}
          {!!keyword?.isSetted && (
            <Stepper.Button
              atctionType="next"
              text="다음"
              color="blue"
              classtitle="ml-2 mt-4"
            />
          )}
          }
        </Stepper>
      </WhiteRoundedCard>
    </div>
  )
}*/}



export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const cookie = req.headers.cookie;
        // 쿠키가 없다면 에러를 보내기
        if (!cookie) throw new Error("Missing auth token cookie");

        // 쿠키가 있다면 그 쿠키를 이용해서 백엔드에서 인증 처리하기 
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`,
            { headers: { cookie } })
        return { props: {} }

    } catch (error) {
        // 백엔드에서 요청에서 던져준 쿠키를 이용해 인증 처리할 때 에러가 나면 /login 페이지로 이동
        // 307 - temporary redirect
        res.writeHead(307, { Location: "/login" }).end()

        return { props: {} };
    }
}










{/*
const CommunityCreate = ({children}: any) => {
    const [recoilCategory, setRecoilCategory] = useRecoilState(recoilCategoryItem);

    
    
    // select.tsx에서 전달해야함
    const [category, setCategory] = useState("");
    const [title, settitle] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<any>({});
    let router = useRouter();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        
        try {
            const res = await axios.post("/communities", { recoilCategory, title, title, description });
            console.log(recoilCategory);
            router.push(`/${res.data.title}`);
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data);
        }
    }
    
    return (
    
        <div classtitle="flex flex-col justify-center pt-16">
            <div classtitle="w-10/12 p-4 mx-auto bg-white rounded md:w-96">
                <h1 classtitle="mb-2 text-lg font-medium">
                    커뮤니티 만들기
                </h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div classtitle="my-6">
                        <p classtitle="font-medium">Category</p>
                        <div>{recoilCategory}</div>
                        { /* select컴포넌트에서 클릭한 카테고리 렌더링  }
                        
                    </div>
                    <div classtitle="my-6">
                        <p classtitle="font-medium">title</p>
                        <p classtitle="mb-2 text-xs text-gray-400">
                            커뮤니티 이름은 변경할 수 없습니다.
                        </p>
                        { /* select컴포넌트에서 클릭한 카테고리 렌더링  }
                        <InputGroup
                            placeholder="이름"
                            value={title}
                            setValue={settitle}
                            error={errors.title}
                        />
                    </div>
                    <div classtitle="my-6">
                        <p classtitle="font-medium">Title</p>
                        <p classtitle="mb-2 text-xs text-gray-400">
                            주제를 나타냅니다. 언제든지 변경할 수 있습니다.
                        </p>
                        <InputGroup
                            placeholder="제목"
                            value={title}
                            setValue={setTitle}
                            error={errors.title}
                        />
                    </div>
                    <div classtitle="my-6">
                        <p classtitle="font-medium">Description</p>
                        <p classtitle="mb-2 text-xs text-gray-400">
                            해당 커뮤니티에 대한 설명입니다.
                        </p>
                        <InputGroup
                            placeholder="설명"
                            value={description}
                            setValue={setDescription}
                            error={errors.description}
                        />
                    </div>
                    <div classtitle="flex justify-end">
                        <button
                            classtitle="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded"
                        >
                            커뮤니티 만들기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CommunityCreate;
*/}

function yupResolver(schema: any)
{
    throw new Error('Function not implemented.');
}

