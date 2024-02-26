export const filterNonEmpty = function(arr = []){
    return arr.map((el) => el.trim())
      .filter((el) => el.length > 0)
}