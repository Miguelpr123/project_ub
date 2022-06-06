alert('v2.2.6');


usuarioCoords = new Promise( (resolve , reject)=>{

    xUser=null;
    yUser=null;

    navigator.geolocation.getCurrentPosition( posicion=>{xUser=posicion.coords.latitude; yUser=posicion.coords.longitude;} , error=>{alert('Error: '+error.code+' '+error.message);} );

    setTimeout( ()=>{
        if( xUser != null && yUser != null ){
            resolve([xUser , yUser]);
        }else{
            setTimeout( ()=>{
                if( xUser != null && yUser != null ){
                    resolve([xUser , yUser]);
                }else{
                    setTimeout( ()=>{
                        if( xUser != null && yUser != null ){
                            resolve([xUser , yUser]);
                        }else{
                            setTimeout( ()=>{
                                if( xUser != null && yUser != null ){
                                    resolve([xUser , yUser]);
                                }else{
                                    alert('TIEMPO EXEDIDO');
                                }
                            } , 10000);
                        }
                    } , 3000);
                }
            } , 3000);
        }
    } , 3000);

});

//AJAX REQUEST -------------------------------------------------------------
//AJAX CITY REQUEST 
reqCiudades = new XMLHttpRequest();
reqCiudades.open('GET', 'https://api.hh.ru/metro?locale=EN', true);
reqCiudades.onreadystatechange = function (aEvt) {
    if (reqCiudades.readyState == 4) {
        if(reqCiudades.status == 200){            
            ciudades = reqCiudades.responseText;
            alert('ciudades request: '+ciudades);
        }else{
            console.log("Error loading page\n");
        }
    }
};
reqCiudades.send(null);

//AJAX VACANCY REQUEST 
reqVacancies = new XMLHttpRequest();
reqVacancies.open('GET', 'https:api.hh.ru/vacancies?locale=EN', true);
reqVacancies.onreadystatechange = function (aEvt) {
    if (reqVacancies.readyState == 4) {
        if(reqVacancies.status == 200){                        
            vacancies = reqVacancies.responseText;
            alert('vacancies request: '+vacancies);
        }else{
            console.log("Error loading page\n");
        }
    }
};
reqVacancies.send(null);
//----------------------------------------------------------------------------


function iniciar(){ 

    idTerminalDistanciaMenor = 0;
    distanciaMenor = 0;    
    city_num_i = null;
    ciudades = [];
    vacancies = [];
    btnLocation = document.getElementById('activate_location');

    btnLocation.addEventListener('click' , ()=>{
        navigator.geolocation.getCurrentPosition( posicion=>{xUser=posicion.coords.latitude; yUser=posicion.coords.longitude;} , error=>{alert('Error: '+error.code+' '+error.message);} );
        setTimeout( ()=>{
            console.log('xUser dentro del TimeOut: '+xUser);
            console.log('yUser dentro del TimeOut: '+yUser);
            if(xUser!=null && yUser!=null ){
                IDCity = getCityId();
                console.log('IDCity: '+IDCity);
            }
        } , 8000);
    });
    
    usuarioCoords.then( res =>{
        xUser = res[0];
        yUser = res[1];
        
        CityID = getCityId();
        getVacancies(CityID);
    });
    
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
    alert('IDciudad: '+IDciudad);
    return IDciudad;

};

function getVacancies(CityID){
    vac_i = [];
    idVacancy = [];
    vacancies = JSON.parse(vacancies);

    //Tengo q ver bien como recojo la request de las vacancies para poder recorrerlas
    for (let i = 0; i < vacancies.length; i++) {
        if (vacancies[i].area.id == cityId ) {
            vac_i[vac_i.length] = i;
            idVacancy[idVacancy.length] = vacancies[i].id;
        }
    }
    /** vacancie[ vac_i[0] ].name */

    alert('vacancies: '+vacancies);
    alert('vacancies[0].name: '+vacancies[0].name);
    alert('vacancies[ vac_i[0] ].name: '+vacancies[ vac_i[0] ].name);

}

/** ALGORITMO BUSCAR LA TERMINAL DE MENOR DISTANCIA CON RESPECTO A LA UBICACION DEL USUARIO */
function IdTerminalDistanciaMenor( xUser , yUser , xTerminal , yTerminal , idTerminal , city_i ){
 
    deltaX =  Math.abs(xTerminal) - Math.abs(xUser);
    deltaY = Math.abs(yTerminal) - Math.abs(yUser);

    distancia = Math.sqrt( Math.pow( deltaX , 2 ) + Math.pow( deltaY , 2 ) ) ;

    if( distancia < distanciaMenor || distanciaMenor == 0  ){
        distanciaMenor = distancia;
        idTerminalDistanciaMenor = idTerminal;

        city_num_i = city_i;
    }


}

window.addEventListener('load', iniciar, false);









