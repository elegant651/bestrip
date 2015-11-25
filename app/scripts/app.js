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
    

  var app = document.querySelector('#app');


  var webComponentsSupported = (
      'registerElement' in document &&
      'import' in document.createElement('link') &&
      'content' in document.createElement('template'));

  if(!webComponentsSupported) {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'bower_components/webcomponentsjs/webcomponents-lite.min.js';
    script.onload = finishLazyLoadingImports;
    document.head.appendChild(script);
  } else {
    finishLazyLoadingImports();
    var loadContainer = document.getElementById('splash');
    loadContainer.parentNode.removeChild(loadContainer);
  }

  function finishLazyLoadingImports() {
    // Use native Shadow DOM if it's available in the browser.
    window.Polymer = window.Polymer || {dom: 'shadow'};

    var onImportLoaded = function() {
      var loadContainer = document.getElementById('splash');
      loadContainer.addEventListener('transitionend', function(e){
        loadContainer.parentNode.removeChild(loadContainer); // IE 10 doesn't support el.remove()
        console.log("loaded");                          
      });      

      document.body.classList.remove('loading');
    };

    // crbug.com/504944 - readyState never goes to complete until Chrome 46.
    // crbug.com/505279 - Resource Timing API is not available until Chrome 46.
    var link = document.querySelector('#bundle');
    if (link.import && link.import.readyState === 'complete') {
      onImportLoaded();
    } else {
      link.addEventListener('load', onImportLoaded);
    }
  }

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');        

    //import page
    var importPage = function(url) {
      return new Promise(function(resolve, reject) {
        Polymer.Base.importHref(url, function(e) {
          resolve(e.target.import);
        }, reject);
      });
    };

    var getAuthData = function() {
      if(!app.user){
        var ref = new Firebase("https://flamingo365.firebaseio.com");
        var authData = ref.getAuth();
        if(authData) {
          app.userid = authData.uid;
        } else {
          page.redirect('/');
        }                      
      } else {
        app.userid = app.user.uid;            
      }      
      return app.userid;
    };

    /// routing ///
    var initDrawer = function(title) {        
        var drawerPanel = document.querySelector('#paperDrawerPanel');            
        drawerPanel.setAttribute('drawer-width', "240px");
        document.querySelector('#drawerWrap').removeAttribute('hidden');
        document.querySelector('#mainToolbar').removeAttribute('hidden');
        document.querySelector('#mainToolbar').className = 'nolanding';        
        document.querySelector('#paperToggle').removeAttribute('hidden');
        
        document.querySelector('#titleMenu').removeAttribute('hidden');
        document.querySelector('#titleMenu').innerHTML = title;
        if(document.querySelector('.titleWrap')!=null){
          document.querySelector('.titleWrap').setAttribute('hidden', '');          
        }        
        
        drawerPanel.closeDrawer();            
    };

    page('/', function () {                
      app.route = 'home';
      
      initDrawer();
      document.querySelector('#paperDrawerPanel').setAttribute('drawer-width', "0px"); 
      document.querySelector('#drawerWrap').setAttribute('hidden', '');
      document.querySelector('#mainToolbar').setAttribute('hidden', '');              
    });

    page('/signup', function() {                

        initDrawer('SIGN UP');
        document.querySelector('#paperToggle').setAttribute('hidden', '');

        app.route = 'signup';
    });

    page('/profile', function() {            
        Polymer.Base.importHref("../elements/main/my-profile.html", function() {                    
            var userid = getAuthData();            
            document.querySelector("#tempBindP").userid = userid;
            document.querySelector("#tempBindP").publicid = null;
        });

        initDrawer('PROFILE');

        app.route = 'profile';
    });

    page('/profile/:id', function(data) {
        var userid = data.params.id;               

        Polymer.Base.importHref("../elements/main/my-profile.html", function() {  
            document.querySelector("#tempBindP").userid = null;                              
            document.querySelector("#tempBindP").publicid = userid;            
        });
        initDrawer('PROFILE');

        app.route = 'profile';        
    });

    page('/register', function () {            
      Polymer.Base.importHref("../elements/main/register-schedule.html", function() {                    
          var userid = getAuthData();            
          document.querySelector("#tempBindR").userid = userid;
      });
      initDrawer('REGISTER');      

      app.route = 'register';            
    });

    page('/search', function() {
      Polymer.Base.importHref("../elements/main/finding-travelers.html", function() {                    
          var userid = getAuthData();            
          document.querySelector("#tempBindS").userid = userid;
      });      
      app.route = 'search';

      initDrawer('SEARCHING');
    });

    page('/schedules', function() {      
      Polymer.Base.importHref("../elements/main/list-schedule.html", function() {                    
          var userid = getAuthData();            
          document.querySelector("#tempBindSC").userid = userid;
      });      
      app.route = 'schedules';

      initDrawer('NOTIFICATION');
    });    

    page('/myschedule', function() {      
      Polymer.Base.importHref("../elements/main/my-schedule.html", function() {                    
          var userid = getAuthData();            
          document.querySelector("#tempBindM").userid = userid;
      });      
      app.route = 'myschedule';

      initDrawer('MY TRAVELERS');
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
    var icClose = document.querySelector('#icClose');
    var paperDrawerPanel = document.querySelector('#paperDrawerPanel');
    var signup = document.querySelector('#signup');
    var registerSchedule = document.querySelector("#registerSchedule");
    var findingTravelers = document.querySelector("#findingTravelers");
    var listSchedule = document.querySelector('#listSchedule');
    var mySchedule = document.querySelector('#mySchedule');        
    var logoutDlog = document.querySelector('#logoutDlog');
    var paperDlog = document.querySelector('#paperDlog');

    icClose.addEventListener('click', function(){
        var drawerPanel = document.querySelector('#paperDrawerPanel');            
        drawerPanel.closeDrawer();
    });


    logoutDlog.addEventListener('logout-complete', function(e) {
        location.href='/';
    });    

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
        var url = e.detail.url;
        paperDlog.addEventListener('click', function() {                  
            page.redirect('/search');        
        });
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
        paperDlog.addEventListener('click', function() {                  
            page.redirect('/schedules');        
        });
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
            page.redirect('/myschedule');        
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
    console.log("se:"+app.route);   
    var drawerPanel = document.querySelector('#paperDrawerPanel');            
    drawerPanel.closeDrawer();            
  };

  app._computeStyle = function(isLargeScreen){
    console.log("a:"+app.route);
     // return isLargeScreen? ''
  };


})(document);
