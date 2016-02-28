[![Build Status](https://travis-ci.org/sanchitgera/node-uwaterloo-api.png)](https://travis-ci.org/sanchitgera/node-uwaterloo-api)

## Installation 
```
npm install uwaterloo-api
```

## Usage 
First, obtain a key from http://api.uwaterloo.ca to use the API

```js
//Require the module 
var uwaterlooApi = require('uwaterloo-api'); 

//Instantiate the client 
var uwclient = new uwaterlooApi({
  API_KEY : 'YOUR_KEY_HERE'
});

//Use the API 
uwclient.get('/foodservices/menu', function(err, res) {
  console.log(res); 
}); 

uwclient.get('/events/holidays', function(err, res) {
  console.log(res); 
}); 
```

A list of all available endpoints can be found [here](https://github.com/uWaterloo/api-documentation).

## Passing parameters
In order to pass query parameters, you can either put them directly in the path provided 
```js
uwclient.get('/courses/CS/247/schedule', {}, function(err, res){
  console.log(res);
});
```

Or, if you prefer, add them as dynamic parameters 
```js
uwclient.get('/courses/{course_sbuject}/{course_number}/schedule', {
   course_subject : 'CS', 
    course_number : 247
  }, function(err, res) {
    console.log(res);
});
```

Any additional parameters provided are automatically added to the `QueryString`. 

## Testing 
Running the tests requires an API_KEY as mentioned above. Once a key is obtained, set the following variable : 
```sh
# In ~/.bash_profile
export uwApiToken=SOME_TOKEN
```
and run
```
npm install
npm test 
```

## Contributing 
1. Fork the repo
2. Create a feature branch 
3. Add test cases if necessary 
3. Push your changes and create a PR 

## License 
MIT 
