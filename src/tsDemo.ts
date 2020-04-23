let a:string;
let b:number;

interface interfaceA{
    name:string,
    age:number
}
function fnA(name:string):void{
console.log(name);

}
class Nan implements interfaceA{
    name:'cao'
    age:2
    getName(){
        console.log('getName');
        
        return this.name;
    }
}

export {
    fnA,
    Nan
}