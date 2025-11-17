export default class SomeMath{
    constructor(a,b){
        this.a = a;
        this.b = b;
    }

    async toSum(){
        return this.a + this.b;
    }
}