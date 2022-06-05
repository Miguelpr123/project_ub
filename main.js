
const request = new XMLHttpRequest();

request.addEventListener('readystatechange' , e=>{
    //leer docs about XMLHttpRequest.readyState
    if(e.target.readyState === 4 ){
        const datos = JSON.parse(e.target.responseText);
        console.log(datos);
    }
});

request.open('GET' , 'http://jsonplaceholder.typicode.com/users' );
request.send();

console.log(request);
