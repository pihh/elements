export const Compile = function(obj={}){
    const div = document.createElement('div');
    div.innerText = 'xxxx';
    document.body.appendChild(div);
    let observeAttributes = ["innerText"];
    let map = {
        innerText: obj.innerText ||"",
        innerHTML: obj.innerHTML ||"",
    }
    let p = new Proxy(div,{
        get(a,b,c,d){
            
            if(observeAttributes.indexOf(b)> -1){
                let arg = map[b];               
                a[b] = `teste x ${arg}`;
                return b+" called"
            }
            return a[b]
        },set(a,b,c,d,e){
            if(map.hasOwnProperty(b)){
                if(c !== map[b]){
                    map[b] = c;
                    a[b] = c;
                }
            }
            
            return true;
        },getPrototypeOf(a,b,c,d){
            console.log('Proto',{a,b,c,d})
        }
    })

    // console.log(p,div)
    return p
}

let scope = Compile()