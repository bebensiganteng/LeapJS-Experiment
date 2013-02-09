require.config
  baseUrl: '/'
  paths:
    three: 'scripts/vendor/three'
    app: 'scripts'
  map:
    '*':
      'scripts/vendor/tweenjs': 'scripts/vendor/tweenjs-0.3.0.min'

requirejs ['app/app']
