

var req = new XMLHttpRequest();
req.open('GET', 'https://jsonplaceholder.typicode.com/users', true);
req.onreadystatechange = function (aEvt) {
  if (req.readyState == 4) {
     if(req.status == 200)
      dump(req.responseText);
     else
      dump("Error loading page\n");
  }
};
req.send(null); 

