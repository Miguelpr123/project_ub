alert('v2.5.5');

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
                    
                    alert('employers[i]: '+employers[i]);

                    employers[i] =  JSON.parse( employers[i] );
                    
                    alert('employers[i] despues del Jason.parse: '+employers[i]);
                    /*
                    //INTO HTML                    
                    divHijo = document.createElement('div');
                    divHijo.className = 'col-12 badge-pill m-2 p-3 shadow-sm bg-dark text-light d-flex ';
                    //aos="fade-up" data-aos-delay="200"
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
                    divHijo.innerHTML = `
                        <div>
                            <svg class="svg-icon" viewBox="0 0 20 20" style="width: 30px; height:30px;" >
                                <path fill="#17a2b8" d="M8.749,9.934c0,0.247-0.202,0.449-0.449,0.449H4.257c-0.247,0-0.449-0.202-0.449-0.449S4.01,9.484,4.257,9.484H8.3C8.547,9.484,8.749,9.687,8.749,9.934 M7.402,12.627H4.257c-0.247,0-0.449,0.202-0.449,0.449s0.202,0.449,0.449,0.449h3.145c0.247,0,0.449-0.202,0.449-0.449S7.648,12.627,7.402,12.627 M8.3,6.339H4.257c-0.247,0-0.449,0.202-0.449,0.449c0,0.247,0.202,0.449,0.449,0.449H8.3c0.247,0,0.449-0.202,0.449-0.449C8.749,6.541,8.547,6.339,8.3,6.339 M18.631,4.543v10.78c0,0.248-0.202,0.45-0.449,0.45H2.011c-0.247,0-0.449-0.202-0.449-0.45V4.543c0-0.247,0.202-0.449,0.449-0.449h16.17C18.429,4.094,18.631,4.296,18.631,4.543 M17.732,4.993H2.46v9.882h15.272V4.993z M16.371,13.078c0,0.247-0.202,0.449-0.449,0.449H9.646c-0.247,0-0.449-0.202-0.449-0.449c0-1.479,0.883-2.747,2.162-3.299c-0.434-0.418-0.714-1.008-0.714-1.642c0-1.197,0.997-2.246,2.133-2.246s2.134,1.049,2.134,2.246c0,0.634-0.28,1.224-0.714,1.642C15.475,10.331,16.371,11.6,16.371,13.078M11.542,8.137c0,0.622,0.539,1.348,1.235,1.348s1.235-0.726,1.235-1.348c0-0.622-0.539-1.348-1.235-1.348S11.542,7.515,11.542,8.137 M15.435,12.629c-0.214-1.273-1.323-2.246-2.657-2.246s-2.431,0.973-2.644,2.246H15.435z"></path>
                            </svg>
                        </div>
                        <div class="mx-2" > ${vacancies.items[i].name}</div>
                        <div class="mx-2" >${vacancies.items[i].department}</div>
                    `;
                    rowContainerEmployers.appendChild(divHijo);

                    */
                }else{
                    console.log("Error loading page\n");
                }
            }
        };
        reqEmployers[i].send(null);

    }

}


window.addEventListener('load', inicioNeo );









