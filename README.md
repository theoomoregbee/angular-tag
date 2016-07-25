# angular-tag
 
Tags input directive for AngularJS. Check out the ReadMe on  [angular-tag website](https://github.com/theo4u/angular-tag) for more information.

![angular-tag](https://www.googledrive.com/host/0B9WhZZgFzvoBLVhEd3hBRm5qb1k)

## Requirements

- [Angular.js 1.3+](http://angularjs.org) 
- [ngAnimate](https://docs.angularjs.org/api/ngAnimate) (optional for typehead animation)

## Installation
### Add library
This module is available as bower package, install it with this command:

```bash
bower install angular-tag
```

and it's available too as npm package, install it with this command:

```bash
npm install angular-tag
```

or you may download the [latest release](https://github.com/theo4u/angular-tag/releases)

### Include library
```html
<link href="/angular-tag/angular-tag.min.css" rel="stylesheet" />
<script src="angular/angular.js"></script>
<script type="text/javascript" src="/angular-tag/angular-tag.min.js"></script>
```
### Add dependency

```javascript
var app = angular.module('myModule', ['angular-tag']);
```
  
## Example
 `/example.html`
```html
  <!DOCTYPE html >
  <html lang="en" ng-app="example">
  <head>
      <meta charset="UTF-8">
      <title>Tag Test</title>
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/angular-animate/angular-animate.js"></script>
  <script src="dist/angular-tag.min.js"></script>
  <link rel="stylesheet" href="dist/angular-tag.min.css">
  </link>
  
     <script>
         angular.module('example',['ngAnimate','angular-tag'])
  
           .controller('MainCtrl',function ($scope) {
      $scope.data=[{texti:'Jss1',added:'test'},{texti:'Jss2',add:'test3'},{texti:'Jss3',value:'owk'}];
      $scope.selected=[];
  
      $scope.$on('tagAdded', function (event, data) {
      console.log(data); // 'Some data'
      });
  
      $scope.$on('tagRemoved', function (event, data) {
      console.log(data); // 'Some data'
      console.log(event);
      console.log($scope.selected)
      });
   
      })
     </script>
  </head>
  <body ng-controller="MainCtrl" >
  <p>Tag Me</p>
  <p>Data: {{data}}</p>
  <p>Selected: {{selected}}</p>
  
  <tag-me type="input" data="data" selected="selected" display-field="texti" typehead="true" theme="material"  allow-outside-data-set="true" same-input="false">test</tag-me>
  
  <p ng-init="selectedi=[{text:'Test'},{text:'three'}]">Selected: {{selectedi}}</p>
  <tag-me type="input" data="data" selected="selectedi" placeholder="your own placeholder"  typehead="false" allow-outside-data-set="true" same-input="false">test</tag-me>
  
  </body>
  </html>
```
 
## Options
The tag works separately with the options based on the value
### theme 
    it comes with two themes which can take the value of `default` or `material`. if used optionally it takes
     the default of `default`
### type
    for the now the type is just for `input`
### data
    if set , is where what `angular-tag` use in our data set to check if the entered item match any of the 
    fields/items in it or in filtering **typehead**
### selected
    return the selected item(s)/tags here, which can be used for other processing
### sameInput
    to allow same input , that is a selected item can appear more than once in our tagging system, 
    takes either `true` or `false`
### allowOutsideDataSet 
    if the allowed input should be outside the data set specified in `data` , takes either `true` or `false`
### typehead
    used in turning type head to assist users when typing or not , takes either `true` or `false`, if animation is wanted 
    simply inject ngAnimate to your app module to see the type head in action
### displayField
    field to display to the user in the data set to the tag view , i.e which field to show to the user 
    when typing or when adding tag, default if not specified uses the `text` object field parameter like in {text:'text'}
### placeholder
    assist users so they can use their place holders , if not placed it would use the default placeholder which is 
    `Enter Text with , separated`
### delimeter
    delimiter to separate the text entered, checks if the user hit on the delimiter activate the tag, default it uses `,` 
    and always uses `Enter Key` along side

## Events
 The directive emits two events which is when a tag is added and when a tag is removed
```bash
        tagAdded //emitted with the added item to the parent scope
        tagRemoved //emitted with the removed item to the parent Scope
```
Used in the example html above
 
## Demo
 
 You can see the directive in action in the [demo page](http://theo4u.github.io/angular-tag/).
 
## Contributing
 
### Setting up your environment

Here's what you need to do before start working on the code:

1. Install Node.js (0.10.22 or higher)
2. Install `grunt-cli` globally

        npm install -g grunt-cli karma-cli
3. Clone your repository

        git clone https://github.com/<your_github_username>/angular-tag

4. Go to the angular-tag directory

        cd angular-tag

5. Add the main angular-tag repo as an upstream remote

        git remote add upstream https://github.com/theo4u/angular-tag

6. Install the development dependencies

        npm install
        bower install 

### Building from the source code

You can build angular-tag with a single command:

    grunt build
 
That performs all tasks needed to produce the final JavaScript and CSS files. After the build completes, a folder named `dist` will be generated containing the following files:

    angular-tag.js
    angular-tag.css
    angular-tag.min.js
    angular-tag.min.css

### Running It on local server
 You can run it using the task below, which would run and watch any changes to our .js and .css and anything inside the **template** folder

    grunt serve
The task above would run and listen for any js and run the `grunt build-js` or `grunt build-css` or `grunt template-build` for css and template respectively

## License
 
 See the [LICENSE](https://github.com/theo4u/angular-tag/blob/master/LICENSE) file.
 