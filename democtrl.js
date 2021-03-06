// Demo controller

angular.module('trixDemo', ['angularTrix'])
    .filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]).controller('trixDemoCtrl', function($scope, $window, $http, $timeout) {
    
    $scope.trix = '<div>Lorem ipsum dolor sit amet,<strong>consectetur</strong>adipiscing elit<del>Praesent lacus diam</del>, fermentum et venenatis quis, suscipit sed nisi. In pharetra sem eget orci posuere pretium.<em>Integer</em>non eros<strong><em>scelerisque</em></strong>, consequat lacus id, rutrum felis. Nulla elementum felis urna, at placerat arcu ultricies in.</div><ul><li>Proin elementum sollicitudin sodales.</li><li>Nam id erat nec nibh dictum cursus.</li></ul><blockquote>In et urna eros. Fusce molestie, orci vel laoreet tempus, sem justo blandit magna, at volutpat velit lacus id turpis.<br>Quisque malesuada sem at interdum congue. Aenean dapibus fermentum orci eu euismod.</blockquote><div></div>';
    
    var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur', 'trixFileAccept', 'trixAttachmentAdd', 'trixAttachmentRemove'];
    
    for (var i = 0; i < events.length; i++) {
        $scope[events[i]] = function(e) {
//            console.info('Event type:', e.type);
            $scope.savedata();
        }
    };

    var createStorageKey, host, uploadAttachment;

    $scope.trixAttachmentAdd = function(e) {
        var attachment;
        attachment = e.attachment;
        if (attachment.file) {
            return uploadAttachment(attachment);
        }
    }

    host = "https://d13txem1unpe48.cloudfront.net/";

    uploadAttachment = function(attachment) {
        var file, form, key, xhr;
        file = attachment.file;
        key = createStorageKey(file);
        form = new FormData;
        form.append("key", key);
        form.append("Content-Type", file.type);
        form.append("file", file);
        xhr = new XMLHttpRequest;
        xhr.open("POST", host, true);
        xhr.upload.onprogress = function(event) {
            var progress;
            progress = event.loaded / event.total * 100;
            return attachment.setUploadProgress(progress);
        };
        xhr.onload = function() {
            var href, url;
            if (xhr.status === 204) {
                url = href = host + key;
                return attachment.setAttributes({
                    url: url,
                    href: href
                });
            }
        };
        return xhr.send(form);
    };

    createStorageKey = function(file) {
        var date, day, time;
        date = new Date();
        day = date.toISOString().slice(0, 10);
        time = date.getTime();
        return "tmp/" + day + "/" + time + "-" + file.name;
    };
    
    $scope.savedata = function() {
        $http({
              url: "localhost:3000/senddata",
              method: "POST",
              data: {"txt_data" : $scope.trix}
          }).success(function(data, status, headers, config) {
//            console.log(data);
            alert("Data Saved");
              
          }).error(function(data, status, headers, config) {
        });
    };

});
