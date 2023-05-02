import { atom, selector } from 'recoil';
import { Friend } from '../types';

export const friendState = atom<Friend[]>({
    key: 'friendsList',
    default: [],
});

export const myInfo = atom<Friend | null>({
    key: 'myProfile',
    default: null,
});
