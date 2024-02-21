export const randomStringNumber = function(len = 2){ 
    let r = (Math.random() + 1).toString(36).substring(2);
    return r

}

export function randomString(length=4) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' ; //0123456789
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result.toLowerCase();
}