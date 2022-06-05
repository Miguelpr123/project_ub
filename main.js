

var req = new XMLHttpRequest();
req.open('GET', 'https://api.hh.ru/metro?locale=EN', true);
req.onreadystatechange = function (aEvt) {
  if (req.readyState == 4) {
     if(req.status == 200)
      console.log(req.responseText);
     else
      console.log("Error loading page\n");
  }
};
req.send(null); 

