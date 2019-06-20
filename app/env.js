(function (window) {
    window.__env = window.__env || {};
    window.__env.apiUrl = 'http://localhost:1338';
    window.__env.enableDebug = false;
    angular.module('diMdrOverview').constant('__env', window.__env);
  }(this));

