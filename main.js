alert('v2.7.2');

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
                                        setTimeout( ()=>{
                                            if( xUser != null && yUser != null ){
                                                resolve([xUser , yUser]);
                                            }else{
                                                setTimeout( ()=>{
                                                    if( xUser != null && yUser != null ){
                                                        resolve([xUser , yUser]);
                                                    }else{
                                                        alert('Tiempo expirado para encontrar la ubicacion');
                                                        reject(true);
                                                    }
                                                } , 3000);
                                            }
                                        } , 3000);
                                    }
                                } , 3000);
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

function getLocalizacion(){
    
    usuarioCoords.then( res =>{
        xUser = res[0];
        yUser = res[1];
        
        CityID = getCityId();
        getVacancies(CityID);
    
    } , rej=>{
        console.log('ubicacion no cargada');
    });
    
}


function inicioNeo(){ 

    idTerminalDistanciaMenor = 0;
    distanciaMenor = 0;    
    city_num_i = null;
    rowContainerEmployers = document.getElementById('containerEmployers');
    rowContainerEmployerBig = document.getElementById('rowContainerEmployerBig');

    getLocalizacion();
    
}


function getEmployers(vacanciesEmployersIds){

    reqEmployers = [vacanciesEmployersIds.length];
    divEmployer = null;
    contColor = 0;
    bgColor = "bg-dark";
    divHijo = [vacanciesEmployersIds.length];

    for (let i = 0; i < vacanciesEmployersIds.length; i++) {

        
    
        //AJAX EMPLOYERS REQUEST 
        reqEmployers[i] = new XMLHttpRequest();
        reqEmployers[i].open('GET', 'https://api.hh.ru/employers/'+vacanciesEmployersIds[i]+'?locale=EN' , true);
        reqEmployers[i].onreadystatechange = function (aEvt) {
            if (reqEmployers[i].readyState == 4) {
                if(reqEmployers[i].status == 200){                        
                    employers[i] = reqEmployers[i].responseText;

                    employers[i] =  JSON.parse( employers[i] );                    
                    
                    divHijo[i] = document.createElement('div');
                    if(contColor%2==0){
                        bgColor = "bg-dark";
                    }else{
                        bgColor = "bg-white";
                    }
                    divHijo[i].className = 'col-12 badge-pill m-2 p-3 shadow-sm '+ bgColor +' text-light d-flex ';
                    divHijo[i].setAttribute('data-aos' , 'fade-up' );
                    divHijo[i].setAttribute('data-aos-delay' , '200' );
                    divHijo[i].innerHTML = `
                        <div class="col-12 col-md-4" >
                            <img src=${vacancies.items[i].employer.logo_urls.240} class="rounded" style="max-width:100%;" >
                        </div>
                        <div class="col-12 col-md-5 " >
                            <div class="mx-2" >Name: ${vacancies.items[i].name} </div>
                        </div>
                        <div class="col-12 col-md-3 d-flex flex-column" >
                            <div class="mx-2" >From: ${vacancies.items[i].salary.from} to ${vacancies.items[i].salary.to}  </div>
                            <span class="mx-2 text-muted" >${vacancies.items[i].salary.currency}</span>
                        </div>
                        
                    `;
                    divHijo[i].setAttribute( 'onclick' , `
                        if(divEmployer==null){ 
                            divEmployer = document.createElement("div"); 
                        } 
                        divEmployer.innerHTML = \`                 
                            <div class="col-12 col-md-4 rounded m-0 p-0" >
                                <img src="${employers[i].site_url}" class="w-100 m-0 rounded" style="transform:translate(-15px , -15px ) ;" alt="">
                            </div>
                            <div class="col-12 col-md-8 py-2">
                                <div class="d-flex flex-column" >
                                    <h4>${ employers[i].name }</h4>
                                    <div class="text-muted" ><em>${ employers[i].type }</em></div>
                                </div>
                            </div>
                            <div class="col-12">
                                <p class=" text-justify " >${ employers[i].description }</p>
                            </div>
                            <div class="col-12 my-2" >
                                <div class="d-flex justify-content-between" >
                                    <div class="badge-pill badge-info " >Trusted: ${ employers[i].name }</div>
                                </div>
                            </div>
                        \`; 
                        rowContainerEmployerBig.appendChild(divEmployer); 
                    `);
                    rowContainerEmployers.appendChild(divHijo[i]);
                    
                }else{
                    console.log("Error loading page\n");
                }
            }
        };
        reqEmployers[i].send(null);
        //FIN AJAX EMPLOYERS REQUEST 

    }
    

}


window.addEventListener('load', inicioNeo );









