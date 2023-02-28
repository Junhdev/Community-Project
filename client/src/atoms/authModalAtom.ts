import { atom } from 'recoil';

export interface AuthModalState {
    open: boolean;
    view: "login" | "signup" | "resetPassword";
}

const defaultModalState: AuthModalState = { //초기값 생성
    open: false,
    view: "login",
};

export const authModalState = atom<AuthModalState>({ //???
    key: "authModalState",
    default: defaultModalState, //초기값 설정
});