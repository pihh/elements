export const compileRules = {
    whileLoop:{
        maxLoops: 100,
        monitor(maxLoops=100) {
            let loops = 0;
            maxLoops = maxLoops || this.maxLoops;
            maxLoops = Math.abs(maxLoops+1)
            return ()=>{
                loops++
                if(loops > maxLoops){
                    console.log(loops)
                    throw new Error("Too many loops");
                }
            };
        }
    }
}