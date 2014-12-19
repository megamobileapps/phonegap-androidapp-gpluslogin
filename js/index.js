/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var googleapi = {
    authorize: function(options) {
        var deferred = $.Deferred();
        
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
        $(authWindow).on('loadstart', checkEvent);
        //$(authWindow).on('load', checkEvent);
        
        function checkEvent(e) {
          var url = e.originalEvent.url;
          var code = /\?code=([^&]+)/.exec(url);
          var error = /\?error=(.+)$/.exec(url);

          if (code || error) {
            authWindow.close();
          }

          console.log("code="+code +" error ="+error);
          //alert("code is "+ code);
            if (code) {
                //code = code.split("&");    
                console.log("code[1]="+code[1] );
              $.post('https://accounts.google.com/o/oauth2/token', {
                code: code[1],
                client_id: options.client_id,
                client_secret: options.client_secret,
                redirect_uri: options.redirect_uri,
                grant_type: 'authorization_code'
              }).done(function(data) {
                deferred.resolve(data);
              }).fail(function(response) {
                deferred.reject(response.responseJSON);
              });
            } else if (error) {
              deferred.reject({
                error: error[1]
              });
            }

        };
        return deferred.promise();
    }
};

// This function gets data of user.
function getDataProfile()
    {
        var term=null;
      //  alert("getting user data="+accessToken);
        $.ajax({
               url:'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+accessToken,
               type:'GET',
               data:term,
               dataType:'json',
               error:function(jqXHR,text_status,strError){
               },
               success:function(data)
               {
               var item;

               console.log(JSON.stringify(data));
// Save the userprofile data in your localStorage.
               localStorage.gmailLogin="true";
               localStorage.gmailID=data.id;
               localStorage.gmailEmail=data.email;
               localStorage.gmailFirstName=data.given_name;
               localStorage.gmailLastName=data.family_name;
               localStorage.gmailProfilePicture=data.picture;
               localStorage.gmailGender=data.gender;
               }
               });
        disconnectUser();
    }

// discounnect user
//  
function disconnectUser() {
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token='+accessToken;

  // Perform an asynchronous GET request.
  $.ajax({
    type: 'GET',
    url: revokeUrl,
    async: false,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(nullResponse) {
      // Do something now that user is disconnected
      // The response is always undefined.
      accessToken=null;
      console.log(JSON.stringify(nullResponse));
      console.log("-----signed out..!!----"+accessToken);
    },
    error: function(e) {
      // Handle the error
      // console.log(e);
      // You could point users to manually disconnect if unsuccessful
      // https://plus.google.com/apps
    }
  });
}
$(document).on('deviceready', function() {
  console.log("Device is ready ");
  var $loginButton = $('#login a');
  var $loginStatus = $('#login p');

  $loginButton.on('click', function() {
    googleapi.authorize({
      client_id: 'client_id_created_with_installtype_other_in_google_console',
      client_secret: 'YOUR CLIENT SECRET HERE',
      redirect_uri: 'http://localhost',
      scope: 'https://www.googleapis.com/auth/plus.login'
    }).done(function(data) {
        $loginStatus.html('Access Token: ' + data.access_token);
        accessToken=data.access_token;
        // alert(accessToken);
        // $loginStatus.html('Access Token: ' + data.access_token);
        console.log(data.access_token);
        console.log(JSON.stringify(data));
        getDataProfile();
    }).fail(function(data) {
      $loginStatus.html(data.error);
    });
  });
});

