import { friendState, myInfo, visitState } from "@/src/atoms/friendAtom";
import Modal, { Dimmed } from "@/src/common/Modal";
import { DRAWER_Z_INDEX, Drawer } from "@/src/components/Drawer/Drawer.style";
import FriendSearchForm, { FRIEND_SEARCH_MODAL_ZINDEX } from "@/src/components/Friends/FriendSearchForm";
import { getMyProfile, postFriendRequest } from "@/src/components/Friends/FriendsAPI";
import FriendsBar from "@/src/components/Friends/FriendsBar";
import TopBar from "@/src/components/TopBar/TopBar";
import { FriendShip, User }  from "@/src/types";
import { FRIEND_REQUEST_ACTION, MODAL_CENTER_LEFT, MODAL_CENTER_TOP, MODAL_CENTER_TRANSFORM } from "@/src/utils";
import axios, { AxiosStatic } from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";


interface ReceivedFriendRequestProps {
  id: number;
  userID: string;
  username: string;
  profileImg: string;
  handleFriendRequests: Function;
  
}

const FriendPage = () => {
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFriendSearchFormOpen, setIsFriendSearchFormOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
    const [myProfile, setMyProfile] = useRecoilState<User | null>(myInfo);
    const [friendsList, setFriendsList] = useRecoilState(friendState);
    const [currentVisit, setCurrentVisit] = useRecoilState(visitState);
    const [friendRequests, setFriendRequests] = useState<User[] | null>(null);
   
    useEffect(() => {
        
      getMyProfile().then((userData: User) => {
      setMyProfile(userData);
      setCurrentVisit((prev) => ({ isMe: true, userID: userData.userID }));
      });
      getFriendRequests();
      getFriendsList();
  }, []);

    const getFriendRequests = async () => {
      
          const res = await axios.get("/friendship/request");
          setFriendRequests(res.data);
      
      }
  
    const getFriendsList = async () => {
     
            const res = await axios.get("/friendship");
            setFriendsList(res.data);
       
    };
 


  
    const sendFriendRequest = async () => {
        if (!selectedFriend) return;
        postFriendRequest(selectedFriend).then(() => {
            resetFriendSearchForm();
        });
        
    };

   

    const handleFriendRequests = (action: AxiosStatic) => {
      return async function (id: number){
      try {
          const res = await action(`/friendship/accept/${id}`);
          alert(res.data.message);
      } catch (error) {
          console.log(error);
      }
    }
      
    };
  

    const resetFriendSearchForm = () => {
        setIsFriendSearchFormOpen(false);
        setSelectedFriend(null);
    };

  

    return (
        <>
          <div>
            { /* +버튼 누르면 친구 찾기 state true로 바꿔주기 */ }
            <TopBar handleMenuClick={() => setIsDrawerOpen(true)} />
            <FriendsBar handlePlusButtonClick={() => setIsFriendSearchFormOpen(true)} />
            {/* isDrawerOpen && <Dimmed zIndex={DRAWER_Z_INDEX - 1} onClick={() => setIsDrawerOpen(false)} /> */}
            {/*<Drawer isOpen={isDrawerOpen} />*/} 
        
             { /* 만약 친구 찾기 state가 true라면 모달로 친구검색폼 컴포넌트 보여주기 */}
            {isFriendSearchFormOpen && (
              <Modal
                
                component={<FriendSearchForm selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} handleRequestButtonClick={() => sendFriendRequest()} />}
                top={MODAL_CENTER_TOP}
                left={MODAL_CENTER_LEFT}
                transform={MODAL_CENTER_TRANSFORM}
                zIndex={FRIEND_SEARCH_MODAL_ZINDEX}
                handleDimmedClick={() => resetFriendSearchForm()}
              />
            )}
           
 
    <div>
      <div>나에게 온 친구 요청</div>
      <div>
        {friendRequests && friendRequests.map(({ id, userID, username, profileImg }) => <ReceivedFriendRequest key={userID} id={id} userID={userID} username={username} profileImg={profileImg} handleFriendRequests={handleFriendRequests} />)}
      </div>
      
    </div>
 



          </div>
        </>
      );
};
    
    
    
export default FriendPage;

const ReceivedFriendRequest = ({ id, userID, username, profileImg, handleFriendRequests }: ReceivedFriendRequestProps) => {
  
  const acceptFriendRequest = handleFriendRequests(FRIEND_REQUEST_ACTION.ACCEPT);
  const rejectFriendRequest = handleFriendRequests(FRIEND_REQUEST_ACTION.REJECT);
  return (
    <div>
      <img src={'/' + profileImg} />
      <span>
        <span>{username}</span>
        <span>@{userID}</span>
      </span>
      <div>
        <button onClick={() => acceptFriendRequest(id)}>수락하기</button>
        <button onClick={() => rejectFriendRequest(id)}>거부하기</button>
      </div>
    </div>
  );
};


