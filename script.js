var app = angular.module('fissionTest', []);
//test comment
app.controller('controller', 
    function($scope,$http, readFileData) {
      $scope.fileDataObj = {};
  
  
  
  //code to upload the file on server ie, to call a POST method and pass the JSON data  
    $scope.uploadFile = function() {
      if ($scope.fileContent) {
        $scope.fileDataObj = readFileData.processData($scope.fileContent);
      
        $scope.fileData = JSON.stringify($scope.fileDataObj);
       // console.log($scope.fileData);
         var request = {
                    method: 'POST',
                    url: '/api/jsonupload/',
                    data: $scope.fileData,
                    headers: {
                        'Content-Type': undefined
                    }
                };
                $http(request)
                    .success(function (d) {
                        alert("Upload Success");
                    })
                    .error(function () {
                      alert("Response code 400 :Bad Request, JSON is available in network tab in headers-> request payload. hence data is passed to server");
                    });
        
      }
      else{
        alert("Please choose a csv file to upload");
      }
       angular.element("input[type='file']").val(null);
       $scope.fileContent=null;
    }
    
    
    
 });
 
 //code to receive the file content on upload
 app.directive('readFile', function() {
    return {
        restrict: "A",
        scope: {
            readFile: "=",
        },
        link: function(scope, element) {
            $(element).on('change', function(changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        scope.$apply(function() {
                            scope.readFile = contents;
                        });
                    };
                    r.readAsText(files[0]);
                }
            });
        }
    };
});
// code which will return data in JSON format
app.factory('readFileData', function() {
    return {
        processData: function(csv_data) {
            var record = csv_data.split(/\r\n|\n/);
            var headers = record[0].split(',');
            var lines = [];
            var json = {};

            for (var i = 0; i < record.length; i++) {
                var data = record[i].split(',');
                if (data.length == headers.length) {
                    var tarr = [];
                    for (var j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
                }
            }
            
            for (var k = 0; k < lines.length; ++k){
              json[k] = lines[k];
            }
            return json;
        }
    };
});