Initial setup
1. Create Google app in Google console 
   1.1. Add client by going to Credentials of type "install" and choosing "others".  If you choose android/ios then you will not get client secret which is very essential for this.  I lost 1 day just to figure out this.
2. Create phonegap based app

#################
#basics to start creatign phonegap project
##############
phonegap create my-app
cd my-app
cordova platform add android
phonegap run android

######################
# Additional step for addign plugin for appbrowser
#####################
android update project --subprojects --path "platforms/android" --target  "Google Inc.:Google APIs:21" --library "CordovaLib"

cordova add plugin org.apache.cordova.inappbrowser

cd platforms/android/

ant clean

cd ../..

phonegap build android

3. Copy the contents of this project in www foldre of your phonegap app.
4. Modify in index.js file for information which you setup in Google App in Google Console
   4.1 client_id
   4.2 client_secret

5. Run app by using following command
phonegap run android
6. in emulator for android
  6.1 click on login button

#####################################################################################3
