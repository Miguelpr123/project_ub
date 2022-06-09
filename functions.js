
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

                for (let i = 0; i <  vacancies.items.length; i++) {

                    vacanciesEmployersIds[i] = vacancies.items[i].employer.id;
                        
                }

                getEmployers(vacanciesEmployersIds);

            }else{
                console.log("Error loading page\n");
            }
        }
    };
    reqVacancies.send(null);
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


function recortarCadena(){
    
    /**
     * employerDescMoreLinkStatus = false;
    requirementMoreLinkStatus = false;
    responsabilityMoreLinkStatus = false;

     */

    requirement = document.querySelectorAll('.requirement');
    responsability =  document.querySelectorAll('.cadenaCorta');
    employerDesc =  document.querySelectorAll('.employerDesc');

    requirementMoreLink =  document.querySelectorAll('.requirementMoreLink');
    responsabilityMoreLink =  document.querySelectorAll('.responsabilityMoreLink');
    employerDescMoreLink =  document.querySelectorAll('.employerDescMoreLink');


    requirementCorto = [vacanciesEmployersIds.length];
    responsabilityCorto = [vacanciesEmployersIds.length];
    employerDescCorto = [vacanciesEmployersIds.length];

    for (let i = 0; i < vacanciesEmployersIds.length; i++) {

        //employers
        if(requirementMoreLinkStatus[i]==true){
            requirementCorto[i] = requirement[i].innerHTML;
            if (requirement[i].innerHTML.length > 250 ) {
                requirement[i].innerHTML = requirementCorto.innerHTML.substring(0,100) + '';
            }
            requirementMoreLinkStatus[i]==false;            
        }else{
            requirement[i].innerHTML = requirementCorto.innerHTML;
            requirementMoreLinkStatus[i]==true;
        }

        //responsability
        if (responsabilityMoreLinkStatus[i]==true) {
            responsabilityCorto[i] = responsability[i].innerHTML;
            if (responsability[i].innerHTML.length > 250 ) {
                responsability[i].innerHTML = responsabilityCorto.innerHTML.substring(0,100) + '';
            }
            responsabilityMoreLinkStatus[i]==false;            
        }else{
            responsability[i].innerHTML = responsabilityCorto.innerHTML;
            responsabilityMoreLinkStatus[i]==true;
        }
        
        //employer
        if(employerDescMoreLinkStatus[i]==true){
            employerDescCorto[i] = employerDesc[i].innerHTML;
            if (employerDesc[i].innerHTML.length > 250 ) {
                employerDesc[i].innerHTML = employerDescCorto.innerHTML.substring(0,100) + '';
            }
            employerDescMoreLinkStatus[i]==false;            
        }else{
            employerDesc[i].innerHTML = employerDescCorto.innerHTML;
            employerDescMoreLinkStatus[i]==true;
        }

        

    }
    
    alert(cadenaLarga);
}




