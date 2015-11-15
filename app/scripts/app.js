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
    var initDrawer = function(title) {
        window.scrollTo(0, 0);
        document.querySelector('#paperDrawerPanel').setAttribute('drawer-width', "240px");
        document.querySelector('#drawerWrap').removeAttribute('hidden');
        document.querySelector('#mainToolbar').removeAttribute('hidden');
        document.querySelector('#mainToolbar').className = 'nolanding';
        document.querySelector('#headerPanel').setAttribute('mode', 'standard');   
        document.querySelector('#paperToggle').removeAttribute('hidden');
        if(document.querySelector('#imgLogo')!=null){
          document.querySelector('#imgLogo').setAttribute('hidden', '');
        }       
        document.querySelector('#titleMenu').removeAttribute('hidden');
        document.querySelector('#titleMenu').innerHTML = title;
        if(document.querySelector('.titleWrap')!=null){
          document.querySelector('.titleWrap').setAttribute('hidden', '');          
        }        
    };

    page('/', function () {
      app.route = 'home';

      if(!app.queryMatches){
        initDrawer();
        document.querySelector('#mainToolbar').setAttribute('hidden', '');

      } else {
        document.querySelector('#paperDrawerPanel').setAttribute('drawer-width', "0px");      
        document.querySelector('#drawerWrap').setAttribute('hidden', '');
        document.querySelector('#mainToolbar').className = 'landing';
        document.querySelector('#headerPanel').setAttribute('mode', 'cover');      
        if(document.querySelector('#imgLogo')!=null){
          document.querySelector('#imgLogo').removeAttribute('hidden');
        }
        document.querySelector('#titleMenu').setAttribute('hidden', '');
        
        if(document.querySelector('.titleWrap')!=null){
          document.querySelector('.titleWrap').removeAttribute('hidden');             
        }
      }      

    });

    page('/signup', function() {
        initDrawer('SIGN UP');
        document.querySelector('#paperToggle').setAttribute('hidden', '');

        app.route = 'signup';
    });

    page('/myprofile', function() {
        initDrawer('PROFILE');

        app.route = 'profile';
    });

    page('/register', function () {
      initDrawer('REGISTER');      

      app.route = 'register';            
    });

    page('/search', function() {
      app.route = 'search';

      initDrawer('SEARCHING');
    });

    page('/schedules', function() {
      app.route = 'schedules';

      initDrawer('NOTIFICATION');
    });    

    page('/myschedule', function() {
      app.route = 'myschedule';

      initDrawer('MY TRAVELERS');
    });

    page('/contactinfo/:id', function (data) {
      app.route = 'contactinfo';
      app.params = data.params;

      initDrawer('CONTACT INFO');
    });  

    page('/logout', function() {
      app.route = 'logout';

      initDrawer('LOG OUT');
    });

    // add #! before urls
    page({
      hashbang: true
    });    
    //////routing end ////

    // imports are loaded and elements have been registered
    var paperDrawerPanel = document.querySelector('#paperDrawerPanel');
    var signup = document.querySelector('#signup');
    var registerSchedule = document.querySelector("#registerSchedule");
    var findingTravelers = document.querySelector("#findingTravelers");
    var listSchedule = document.querySelector('#listSchedule');
    var mySchedule = document.querySelector('#mySchedule');    
    // var btnLogin = document.querySelector('#btnLogin');
    // var loginDlog = document.querySelector('#loginDlog');
    var logoutDlog = document.querySelector('#logoutDlog');
    var paperDlog = document.querySelector('#paperDlog');
    // var btnFacebook = document.querySelector('#btnFacebook');

    // if(btnFacebook!=null){
    //   btnFacebook.addEventListener('click', function() {
        
    //     loginDlog.toggle();
    //   });    
    // }

    // loginDlog.addEventListener('move-signup', function(e) {
    //   page.redirect('/signup');
    // });

    // loginDlog.addEventListener('login-complete', function(e) { 
    //     if(btnLogin!=null){
    //       btnLogin.innerHTML = "LOG OUT";                        
    //     }

    //     page.redirect('/register');
    // });
    // loginDlog.addEventListener('logout-complete', function(e) {
    //     if(btnLogin!=null){
    //       btnLogin.innerHTML = "LOG IN";
    //     }

    //     location.href='/';
    // });    

    logoutDlog.addEventListener('logout-complete', function(e) {
        location.href='/';
    });
    
    // if(btnLogin!=null){ 
    //   btnLogin.addEventListener('click', function() {
    //       loginDlog.toggle();
    //   });
    // }  

    signup.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;
        var url = e.detail.url;
        paperDlog.addEventListener('click', function() {                  
            page.redirect(url);        
        });
    });

    findingTravelers.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;
    });
    
    registerSchedule.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;                
        paperDlog.addEventListener('click', function() {                  
            page.redirect('/register');        
        });
    });

    listSchedule.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;
    });

    // listSchedule.addEventListener('show-newflag', function(e) {
    //   document.querySelector('.menu_rt').querySelector('.newAlarm').removeAttribute('hidden');
    // }); 

    // listSchedule.addEventListener('hide-newflag', function(e) {
    //   document.querySelector('.menu_rt').querySelector('.newAlarm').setAttribute('hidden', '');
    // });

    mySchedule.addEventListener('show-dialog', function(e) {
        paperDlog.toggle();
        paperDlog.querySelector("#content").innerHTML = e.detail.content;        
        var url = e.detail.url;
        paperDlog.addEventListener('click', function() {                  
            page.redirect(url);        
        });
    });

    // mySchedule.addEventListener('show-newflag', function(e) {
    //   document.querySelector('.menu_mt').querySelector('.newAlarm').removeAttribute('hidden');
    // }); 

    // mySchedule.addEventListener('hide-newflag', function(e) {
    //   document.querySelector('.menu_mt').querySelector('.newAlarm').setAttribute('hidden', '');
    // });     

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

  app._computeStyle = function(isLargeScreen){
    console.log("a:"+app.route);
     // return isLargeScreen? ''
  };


})(document);
