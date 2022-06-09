alert('v2.9.4');

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
    spinner = document.getElementById('spinner');

    getLocalizacion();
    
}


function getEmployers(vacanciesEmployersIds){

    reqEmployers = [vacanciesEmployersIds.length];
    divEmployer = null;
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
                    divHijo[i].className = 'col-12 col-md-5  m-2 p-3  d-flex ';
                    divHijo[i].setAttribute('data-aos' , 'fade-up' );
                    divHijo[i].setAttribute('data-aos-delay' , '200' );
                    
                    if(vacancies.items[i].employer.logo_urls.original!=null){ imagen = vacancies.items[i].employer.logo_urls.original} else{ imagen='' }
                    if(vacancies.items[i].name!=null) {nombre = vacancies.items[i].name} else{ nombre=''} 
                    if(vacancies.items[i].salary.from!=null){ Sfrom = vacancies.items[i].salary.from} else{ Sfrom='-' }
                    if(vacancies.items[i].salary.to!=null){ Sto = vacancies.items[i].salary.to} else{ Sto='-' }
                    if(vacancies.items[i].salary.currency!=null){ Scurrency = vacancies.items[i].salary.currency} else{ Scurrency='' }
                    if(vacancies.items[i].snippet.requirement!=null){ requirement = vacancies.items[i].snippet.requirement} else{ requirement='' }
                    if(vacancies.items[i].snippet.responsability!=null){ responsability = vacancies.items[i].snippet.responsability} else{ responsability='' }
                    
                    divHijo[i].innerHTML = `
                    
                            <div class="container-fluid  rounded shadow-lg bg-dark text-light" >
                                <div class="row" >
                                    <div class="col-12 " >
                                    
                                        <div class="container-fluid " >
                                            <div class="row p-3" >

                                                <div class="col-12 col-md-4 center" >
                                                    <img src="${imagen}" class="rounded" style="max-width:100%;" alt='No Image' >
                                                </div>
                                                <div class="col-12 col-md-5 " >
                                                    <div class="mx-2" >${nombre} </div>
                                                </div>
                                                <div class="col-12 col-md-3 d-flex flex-column" >                                        
                                                    <div class="mx-2" >From: ${Sfrom} to ${Sto}  </div>
                                                    <span class="mx-2 text-muted" >${Scurrency}</span>
                                                </div>
                                                <div class="col-12 " >
                                                    <div class="d-flex flex-column" >
                                                        <h6>Requeriments: </h6>
                                                        <p class="requirement" >${requirement} </p>
                                                    </div>
                                                    <div class="d-flex flex-column" >
                                                        <h6>Responsabilities: </h6>
                                                        <p class="responsability" >${responsability} </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>
                        
                    `;
                    
                    if(employers[i].type!=null) {employerType = employers[i].type} else{ employerType=''} 
                    if(employers[i].description !=null) {employerDesc = employers[i].description } else{ employerDesc=''} 
                    if(employers[i].trusted !=null) {employedTrusted = employers[i].trusted  } else{ employedTrusted=''} 
                    if(employedTrusted) {employedTrusted = 'Yes'  } else{ employedTrusted='No'}
                
                    divHijo[i].setAttribute( 'onclick' , `
                        if(divEmployer==null){ 
                            divEmployer = document.createElement("div"); 
                        } 
                        divEmployer.innerHTML = \`                 
                            <div class="col-12 col-md-4 rounded m-0 p-3" >
                                <img src="${imagen}" class="w-100 m-0 rounded" alt="">
                            </div>
                            <div class="col-12 col-md-8 p-3">
                                <div class="d-flex flex-column" >
                                    <h4>${ employers[i].name }</h4>
                                    <div class="text-muted" ><em>${ employerType }</em></div>
                                </div>
                            </div>
                            <div class="col-12 p-3">
                                <p class=" text-justify employerDesc" >${ employerDesc } </p>
                            </div>
                            <div class="col-12 my-2 p-3" >
                                <div class="d-flex justify-content-between" >
                                    <div class="badge-pill badge-info " >Trusted: ${ employedTrusted }</div>
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
    
        if(i==vacanciesEmployersIds.length-1){
            spinner.style.display = 'none';
        }
        
    }
    

}


window.addEventListener('load', inicioNeo );









