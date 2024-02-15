let singleClassLists = [...new Set([...document.querySelectorAll('*')].filter(el => ['svg','path','g','circle','defs','stop','start','linearGradient'].indexOf(el.nodeName) == -1).map(el => el.className.split(' ').sort().join(' ')).filter(el => el.length > 0))]
let map = {}
for(let i = 0; i < singleClassLists.length; i++){
  let s = singleClassLists[i]
  for (let k = i+1; k < singleClassLists-length; k++){
    let t = singleClassLists[k]
      console.log(s.indexOf(t))
    if(s.indexOf(t) > -1 || t.indexOf(s)>-1){
        if(!map.hasOwnProperty(s)){
            map[s] = []
        }
        if(!map.hasOwnProperty(t)){
            map[t] = []
        }
        map[s].push(t)
        map[t].push(s)
    }
  }
}
