async function f(){
    let promise=new Promise(function(resolve,reject){
        setTimeout(()=>resolve("완료!"),3000);
    });

    let result = await promise;

    console.log(result);
    let promise2=new Promise(function(resolve,reject){
        setTimeout(()=>resolve("완료!"),3000);
    });

    let result2 = await promise2;
    console.log(result2);

    let promise3=new Promise(function(resolve,reject){
        setTimeout(()=>resolve("완료!"),3000);
    });

    let result3 = await promise3;
    console.log(result3);
};

f();