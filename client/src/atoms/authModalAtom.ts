import { atom } from 'recoil';

export interface CategoryItem {
    
}

const defaultCategoryItem: CategoryItem = { //초기값 생성
    category1: {checked: false},
    category2: {checked: false},
    category3: {checked: false},
};

export const recoilCategoryItem = atom({ //???
    key: "recoilCategoryItem ",
    default: defaultCategoryItem, //초기값 설정
});