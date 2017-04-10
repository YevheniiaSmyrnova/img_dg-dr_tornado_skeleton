var $ = window.jQuery;

$(window.document).ready(function() {
   var files = [];

   $('#uploadbtn').on('change', upload);
   $('#drop-files').on('drop', upload);

   $('#drop-files').on('dragover', function(e) {
       e.preventDefault();
       e.stopPropagation();
   });

   $('#drop-files').on('dragenter', function(e) {
       e.preventDefault();
       e.stopPropagation();
   });
    
    
    function validImage(filename) {
        
        var extension = filename.substr(filename.lastIndexOf('.') + 1);
        
        switch (extension) {
            case 'png':
            case 'jpg':
            case 'jpge':
            case 'PNG':
                return true;
                
            default:
                return false;
        }
    }
    
    
    
   function upload(event) {
      event.preventDefault();
      event.stopPropagation();


      var file = event.target.files !== undefined
         ? event.target.files[0]
         : event.originalEvent.dataTransfer.files[0];



       if (validImage(file.name)) {
           files[0] = file;
           var data = new FormData();
           
           $.each(files, function(key, value) {
               data.append(key, value);
           });

            // FileReader support
            if (FileReader && files && files.length) {
                var fr = new FileReader();
                fr.onload = function () {
                    document.getElementById('outImage').src = fr.result;
                }
                fr.readAsDataURL(file);
            }

            // Not supported
            else {
                // fallback -- perhaps submit the input to an iframe and temporarily store
                // them on the server until the user's session ends.
            }

          $.ajax({
             url: 'http://localhost:8000/upload  ',
             type: 'POST',
             data: data,
             cache: false,
             dataType: 'json',
             processData: false,
             contentType: false,
             success: function(data, status) {

                 var data = JSON.parse(data)
                 
                 var table = document.getElementById("table");
                 var rows = document.getElementById("table").length;
                     for  (var j=0;j<rows-1;j++){
                       document.getElementById("table").getElementById("tr").deleteRow(j);
                     }

                    table.innerHTML = "";
                     
                     for  (var i=0;i<data.results.length;i++){
                        
                        var row = table.insertRow(i);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        cell1.innerHTML = data.results[i].label;
                        cell2.innerHTML = data.results[i].confidence;
                     
                     }
                   
             },
             error: function (XHR, status, error) {
                console.log('Error: ', error);
             }
             
          });
           
       } else {
           window.alert('Invalid format');
       }
       
   } 
});
