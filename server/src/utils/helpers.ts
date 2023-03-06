/* slugify 함수 생성 > 포스트를 설명하는 핵심단어를 만들어줌 */
/* slug를 URL에 사용함으로써 검색 엔진에서 더 빨리 페이지를 찾아주고 정확도도 높여줌 */
export const slugify = function(str) {
    str = str.replace(/^\s+|\s+$/g, ''); 
    str = str.toLowerCase();
    
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-');

    return str;
};

/* makeId 함수 생성 > unique한 Id를 만들어줌 */
export function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}