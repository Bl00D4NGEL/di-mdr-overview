(function (window) {
    window.__env = window.__env || {};
    window.__env.apiUrl = 'http://mdr.d-peters.com:2048';
    window.__env.enableDebug = false;
    angular.module('diMdrOverview').constant('__env', window.__env);
  }(this));

