xUser = null;
yUser = null;
navigator.geolocation.getCurrentPosition( posicion=>{xUser=posicion.coords.latitude; yUser=posicion.coords.longitude;} , error=>{alert('Error: '+error.code+' '+error.message);} );

window.addEventListener('load', iniciar, false);
console.log(xUser);
console.log(yUser);

function iniciar(){ 

    idTerminalDistanciaMenor = 0;
    distanciaMenor = 0;
    ciudades = [];    
    city_num_i = null;
    btnLocation = document.getElementById('activate_location');

    if( xUser == null || yUser == null ){
        navigator.geolocation.getCurrentPosition( posicion=>{xUser=posicion.coords.latitude; yUser=posicion.coords.longitude;} , error=>{alert('Error: '+error.code+' '+error.message);} );
    }

    btnLocation.addEventListener('click' , ()=>{
        navigator.geolocation.getCurrentPosition( posicion=>{xUser=posicion.coords.latitude; yUser=posicion.coords.longitude;} , error=>{alert('Error: '+error.code+' '+error.message);} );
    });
    

    //AJAX REQUEST (SINCRONA (NECESARIA OBLIGATORIAMENTE) )
    req = new XMLHttpRequest();
    req.open('GET', 'https://api.hh.ru/metro?locale=EN', true);

    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {

            if(req.status == 200){
                if( ciudades.length == 0 ){
                    ciudades = req.responseText;
                }
                            
                console.log(ciudades);
                console.log(xUser);
                console.log(yUser);
                console.log('req: '+req);

            }else{
                console.log("Error loading page\n");
            }
        }
    };
    req.send(null);

    if( xUser == null || yUser == null ){
        btnLocation.style.display = 'block';
    }else{
        btnLocation.style.display = 'none';
        getCityId();
    }
}

function getCityId() {

    ciudades = JSON.parse(ciudades);
    //RECORRER LOS DATOS 
    for (let i = 0; i < ciudades.length; i++) {
                
        for (let j = 0; j < ciudades[i].lines.length; j++) {
        
            for (let k = 0; k < ciudades[i].lines[j].stations.length; k++) {

                idTerminal = ciudades[i].lines[j].stations[k].station_id; 
                xTerminal = ciudades[i].lines[j].stations[k].lat;
                yTerminal = ciudades[i].lines[j].stations[k].lng;
            
                IdTerminalDistanciaMenor(  xUser , yUser , xTerminal , yTerminal , idTerminal , i );
            
            }
        
        }

    }
    IDciudad = ciudades[city_num_i].id;
    console.log(xUser);
    console.log(yUser);
    console.log(distanciaMenor);
    console.log(IDciudad);

};



/** ALGORITMO BUSCAR LA TERMINAL DE MENOR DISTANCIA CON RESPECTO A LA UBICACION DEL USUARIO */
function IdTerminalDistanciaMenor( xUser , yUser , xTerminal , yTerminal , idTerminal , city_i ){
 
    deltaX =  Math.abs(xTerminal) - Math.abs(xUser);
    deltaY = Math.abs(yTerminal) - Math.abs(yUser);

    distancia = Math.sqrt( Math.pow( deltaX , 2 ) + Math.pow( deltaY , 2 ) ) ;
    console.log('distancia: '+distancia);

    if( distancia < distanciaMenor || distanciaMenor == 0  ){
        distanciaMenor = distancia;
        console.log('Distancia Menor: '+distanciaMenor);
        idTerminalDistanciaMenor = idTerminal;

        city_num_i = city_i;
    }


}














