alert('v2.6.1');

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
                                        alert('Tiempo expirado');
                                        reject(true);
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

function getLocalizacion(){
        
    usuarioCoords.then( res =>{
        xUser = res[0];
        yUser = res[1];
        
        rowContainerEmployers.remove(spinner);
        CityID = getCityId();
        getVacancies(CityID);
    }, rej=>{
        if(rej){
            rowContainerEmployers.remove(spinner);

        btnBuscarLocation = document.createElement('button');
        btnBuscarLocation.type='button';
        btnBuscarLocation.className='btn btn-info btn-lg';
        btnBuscarLocation.innerHTML = 'Reintentar';
        btnBuscarLocation.addEventListener('click' , ()=>{
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
                                                reject(true);
                                            }
                                        } , 10000);
                                    }
                                } , 3000);
                            }
                        } , 3000);
                    }
                } , 3000);
        
            });

            rowContainerEmployers.appendChild(spinner);
            rowContainerEmployers.remove(btnBuscarLocation);
        });
        rowContainerEmployers.appendChild(btnBuscarLocation);
        getLocalizacion();
        }
        
        
    });
    
}


function inicioNeo(){ 

    idTerminalDistanciaMenor = 0;
    distanciaMenor = 0;    
    city_num_i = null;
    rowContainerEmployers = document.getElementById('containerEmployers');
    rowContainerEmployerBig = document.getElementById('rowContainerEmployerBig');

    spanFail = document.createElement('span');
    spanFail.className = 'sr-only';
    spanFail.innerHTML = 'Loading...';

    spinner = document.createElement('div');
    spinner.id = 'spinnerLoad';
    spinner.className = 'spinner-border text-primary';
    spinner.setAttribute('role' , 'status' );
    spinner.appendChild(spanFail);

    rowContainerEmployers.appendChild(spinner);
    
    alert(rowContainerEmployers);

    getLocalizacion();
    
}


function getEmployers(vacanciesEmployersIds){

    reqEmployers = [vacanciesEmployersIds.length];
    divEmployer = null;

    for (let i = 0; i < vacanciesEmployersIds.length; i++) {
    
        //AJAX EMPLOYERS REQUEST 
        reqEmployers[i] = new XMLHttpRequest();
        reqEmployers[i].open('GET', 'https://api.hh.ru/employers/'+vacanciesEmployersIds[i]+'?locale=EN' , true);
        reqEmployers[i].onreadystatechange = function (aEvt) {
            if (reqEmployers[i].readyState == 4) {
                if(reqEmployers[i].status == 200){                        
                    employers[i] = reqEmployers[i].responseText;

                    employers[i] =  JSON.parse( employers[i] );
                    
                    //INTO HTML                    
                    divHijo = document.createElement('div');
                    divHijo.className = 'col-12 badge-pill m-2 p-3 shadow-sm bg-dark text-light d-flex ';
                    divHijo.setAttribute('data-aos' , 'fade-up' );
                    divHijo.setAttribute('data-aos-delay' , '200' );
                    divHijo.addEventListener('click' , ()=>{
                        if(divEmployer!=null){
                            rowContainerEmployerBig.remove(divEmployer);
                        }
                        //employer big
                        divEmployer = document.createElement('div');
                        divEmployer.innerHTML = `                    
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
                                    <div>ef</div>
                                </div>
                            </div>

                        `;
                        rowContainerEmployerBig.appendChild(divEmployer);
                    } );
                    divHijo.innerHTML = 'efe';
                    rowContainerEmployers.appendChild(divHijo);

                    
                }else{
                    console.log("Error loading page\n");
                }
            }
        };
        reqEmployers[i].send(null);

    }

}


window.addEventListener('load', inicioNeo );









