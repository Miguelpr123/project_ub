alert('v2.4.2');

ciudades = [];
vacancies = [];
employers = [];
xUser = null;
yUser = null;


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
            ciudades = JSON.parse(ciudades);
        }else{
            console.log("Error loading page\n");
        }
    }
};
reqCiudades.send(null);


//----------------------------------------------------------------------------


function inicioNeo(){ 

    idTerminalDistanciaMenor = 0;
    distanciaMenor = 0;    
    city_num_i = null;
    
    usuarioCoords.then( res =>{
        xUser = res[0];
        yUser = res[1];
        
        CityID = getCityId();
        getVacancies(CityID);
    });
    
}

function getCityId() {

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
    

    //AJAX VACANCY REQUEST 
    reqVacancies = new XMLHttpRequest();
    reqVacancies.open('GET', 'https://api.hh.ru/vacancies?locale=EN&area='+ CityID , true);
    reqVacancies.onreadystatechange = function (aEvt) {
        if (reqVacancies.readyState == 4) {
            if(reqVacancies.status == 200){                        
                vacancies = reqVacancies.responseText;

                vacancies = JSON.parse(vacancies);

                vacanciesEmployersIds = [vacancies.items.length];

                alert('vacancies.items.length: '+vacancies.items.length);

                for (let i = 0; i <  vacancies.items.length; i++) {

                    vacanciesEmployersIds[i] = vacancies.items[i].employer.id;
                        
                }

                alert('vacanciesEmployersIds: '+vacanciesEmployersIds);

                getEmployers(vacanciesEmployersIds);

            }else{
                console.log("Error loading page\n");
            }
        }
    };
    reqVacancies.send(null);
    
    

}


function getEmployers(vacanciesEmployersIds){

    reqEmployers = [vacanciesEmployersIds.length];

    for (let i = 0; i < vacanciesEmployersIds.length; i++) {
        
        //AJAX EMPLOYERS REQUEST 
        reqEmployers[i] = new XMLHttpRequest();
        reqEmployers[i].open('GET', 'https://api.hh.ru/employers/'+vacanciesEmployersIds[i]+'?locale=EN' , true);
        reqEmployers[i].onreadystatechange = function (aEvt) {
            if (reqEmployers[i].readyState == 4) {
                if(reqEmployers[i].status == 200){                        
                    employers[i] = reqEmployers[i].responseText;
                    alert('employers request: '+employers[i]);
                }else{
                    console.log("Error loading page\n");
                }
            }
        };
        reqEmployers[i].send(null);

    }

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

window.addEventListener('load', inicioNeo );









