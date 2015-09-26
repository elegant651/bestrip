/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };  

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');    

    /// routing ///
    var initDrawer = function() {
        document.querySelector('#paperDrawerPanel').setAttribute('drawer-width', "240px");
        document.querySelector('#drawerWrap').removeAttribute('hidden');
        document.querySelector('#mainToolbar').className = 'nolanding';
        document.querySelector('#headerPanel').setAttribute('mode', 'waterfall-tall');   

        document.querySelector('.titleWrap').setAttribute('hidden', '');             
    };

    page('/', function () {
      app.route = 'home';
      document.querySelector('#paperDrawerPanel').setAttribute('drawer-width', "0px");      
      document.querySelector('#drawerWrap').setAttribute('hidden', '');
      document.querySelector('#mainToolbar').className = 'landing';
      document.querySelector('#headerPanel').setAttribute('mode', 'cover');      
      
      document.querySelector('.titleWrap').removeAttribute('hidden');             
    });

    page('/register', function () {
      initDrawer();      

      app.route = 'register';            
    });

    page('/search', function() {
      app.route = 'search';

      initDrawer();
    });

    page('/schedules', function() {
      app.route = 'schedules';

      initDrawer();
    });    

    page('/myschedule', function() {
      app.route = 'myschedule';

      initDrawer();
    });

    page('/contactinfo/:id', function (data) {
      app.route = 'contactinfo';
      app.params = data.params;

      initDrawer();
    });  

    // add #! before urls
    page({
      hashbang: true
    });    
    //////routing end ////

    // imports are loaded and elements have been registered
    var paperDrawerPanel = document.querySelector('#paperDrawerPanel');
    var registerSchedule = document.querySelector("#registerSchedule");
    var findingTravelers = document.querySelector("#findingTravelers");
    var listSchedule = document.querySelector('#listSchedule');
    var mySchedule = document.querySelector('#mySchedule');
    var btnLogin = document.querySelector('#btnLogin');
    var loginDlog = document.querySelector('#loginDlog');
    var paperDlog = document.querySelector('#paperDlog');


    document.querySelector('#btnFacebook').addEventListener('click', function() {
      loginDlog.toggle();
    });

    loginDlog.addEventListener('login-complete', function(e) { 
        if(btnLogin!=null){
          btnLogin.innerHTML = "LOG OUT";                        
        }

        page.redirect('/register');
    });
    loginDlog.addEventListener('logout-complete', function(e) {
        if(btnLogin!=null){
          btnLogin.innerHTML = "LOG IN";
        }

        location.href='/';
    });    
    
    if(btnLogin!=null){ 
      btnLogin.addEventListener('click', function() {
          loginDlog.toggle();
      });
    }

    findingTravelers.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;
    });
    
    registerSchedule.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;        
    });

    listSchedule.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;
    });

    mySchedule.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;        
    });

    paperDlog.addEventListener('click', function() {        
        console.log("redirect");        
        page.redirect('/register');        
    });
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
      
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {    
    var drawerPanel = document.querySelector('#paperDrawerPanel');    
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };


})(document);
