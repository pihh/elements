/**
 * Ensure consistency on the function resolution
 * @param {*} success 
 * @param {*} message 
 * @param {*} data 
 * @returns 
 */
export const output = function(success=false,message="",data={}){
    return {success,message,data}
}