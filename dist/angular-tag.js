/**
 * Created on 7/16/2016.
 * Theophilus Omoregbee <theo4u@ymail.com>
 */

/**
 * Tag input allows input from client and this input objects must contain the
 * 'text' field or use the data-field='field_in_ur_array_or_object' to specify which field you want us to use
 * i.e data set =[ {text:'View', value:'value1'[,..:...]}, {text:'View', value:'value2'[,..:...]}, ....]
 * where the text is used in displaying the content to users and checking if the text matches any data set
 * field to add to our selected tag as return array of objects
 *
 *
 * it generates a default view for the entered input when the allow outside data set is used , if it exist on our
 * data set use the object in the data set and add it to our selected data set
 * else if  not in our data set then use the $scope.default_input={text:input}
 *
 *
 *
 * Ability to style it , but comes with two styled themes
 *          1. Material
 *          2. Default
 *
 * The directive emits 2 events
 *          1. tagAdded is emitted with the added item to the parent scope
 *          2. tagRemoved is emitted with the removed item to the parent Scope
 *
 *  Type Head features
 *         1. normal type head which is based on the data set , as user types it opens the type head for assistance
 *             it is triggered by default, users can decide to off it , by turning it to false
 */

(function () {

      /**
     * This method takes in a variable to determine if the variable was initialized or null then use the default specified
     * @param variable
     * @param default_value
     * @returns {*}
     */
    var data_init=function (variable,default_value) {

        if(variable == undefined || variable == null)
            return default_value;
        else
            return variable;
    };

    /**
     * Our Controller for the tags-input
     * @param $scope
     * @param $filter
     */
    var controllerFunction=function ($scope,$filter) {
        $scope.hasError=false;//when there is error while entrying record
        $scope.delimiter=",";
        $scope.data = data_init($scope.data,[]);
        $scope.selected=data_init($scope.selected,[]);
        $scope.allowOutsideDataSet=data_init($scope.allowOutsideDataSet,false);
        $scope.sameInput=data_init($scope.sameInput,false);
        $scope.default_input={};//default view when a new object is added i.e when
        $scope.theme=data_init($scope.theme,'default');
        $scope.typehead=data_init($scope.typehead,true);//used in displaying type head or not
        $scope.displayField=data_init($scope.displayField,'text');//used in displaying which field inside the data set we need
        $scope.placeholder=data_init($scope.placeholder,'Enter Text with , separated');//this is helps for custom placeholder

        $scope.active_index=-1;//this hold the active selected tag index

        /**
         * This method checks if an item(input) exist inside an array
         * @param array
         * @param input
         * @returns {*}
         */
        $scope.check_data=function (array,input) {
            return $filter('filter')(array, function(value, index) {return value[$scope.displayField] === input;})[0];
        };


        /**
         * on key up call this function to help process our tag input
         */
        $scope.on_input_keyup=function (event) {
            var input='';
            if($scope.input != undefined)
                input=$scope.input.replace($scope.delimiter,'');

            //if user just type and uses our defined delimiter do this function
            if ($scope.input != undefined && $scope.input.indexOf($scope.delimiter) > -1) {
                if(input!="")
                    $scope.processor(input);
                return;
            }

            //if user types and presses enter key (keyCode 13 ASCII)
            if(event.keyCode == 13 && input != "" ) {
                   $scope.processor(input);
                return;
            }

           // console.info(event);
         //let's check if the user pressed the backspace button so we know when to enter the tag after the input i.e activate the tag as active
            if(event.keyCode == 8 && input==""){
                //make the last add tag as active
               console.info("backspace activated");
                $scope.moveToTag(event,$scope.selected.length-1);//-1 means move the tag to the last tag
            }

            //keyCOde==46 for delete

        };

        /**
         * this method updates our tag view with the input parameter, and emit a message to the parent that an object is gotten
         * @param input
         */
        $scope.update=function (input) {
            //input.generated_count=$scope.selected.length;
            $scope.selected.push(angular.copy(input));
            $scope.input="";
            $scope.hasError=false;
            $scope.$emit('tagAdded',input);
        };


        /**
         * This method check if data check is defined , if it is defined , so we know if the entered item is in our data_set or not
         * @param data_check
         * @param input
         * @returns {*}
         */
        $scope.return_value=function (data_check,input) {
            if(data_check == undefined){
                $scope.default_input[""+$scope.displayField]=input;
                return $scope.default_input;
            }else
               return data_check;//means is on our data set , so pick the item from there
        };

        /**
         * This method moves the cursor to the tag in a particular index  of our event which holds the parent and set it to be active
         * @param index
         */
        $scope.moveToTag = function (event,index) {
            var i=0;
            var lis=angular.element(event.target.parentNode.parentNode).find('li');
            var size=lis.length;
            for(var i=0; i<size-1;i++){
                if(i==index) {
                    //check if it contains active before then toggle
                    if($scope.active_index != index) {
                        $scope.active_index = index;
                        angular.element(lis[i]).addClass('active');
                    }else{
                        $scope.active_index = -1;
                        angular.element(lis[i]).removeClass('active');
                    }
                }else
                    angular.element(lis[i]).removeClass('active');
            }
        };
        
        /**
         * when the user type in the field it should call this function for checking
         *
         * which would check if the following instructions
         *  1. allowOutsideDataSet
         *  2. sameInput
         *  3. hasError
         */
        $scope.processor=function (input) {

                //lets check if it is inside our main data
                var data_set_check = $scope.check_data($scope.data,input);

                //lets check if it is inside our selected data set
                var selected_set_check = $scope.check_data($scope.selected,input);

                //scenarios: when allowed outside data set and same input should be allowed
                if($scope.allowOutsideDataSet && $scope.sameInput)
                {
                    $scope.update($scope.return_value(data_set_check,input));
                    return;
                }


                //scenarios: when allowed outside data set and same input is not set
                if($scope.allowOutsideDataSet && !$scope.sameInput)
                {

                    //then check for match in our selected data set
                    if(selected_set_check == undefined)
                        $scope.update($scope.return_value(data_set_check,input));
                    else
                        $scope.hasError=true;

                    return;
                }

                //scenarios: when allowed outside data set is not set and not allowing same input
                if(!$scope.allowOutsideDataSet && !$scope.sameInput)
                {
                    //then check for match in our selected data set and our main data set
                    if(data_set_check != undefined && selected_set_check == undefined)
                        $scope.update(data_set_check);
                    else
                        $scope.hasError=true;

                    return;
                }

                //scenarios: when allowed outside data set is not set and allowing same input
                if(!$scope.allowOutsideDataSet && $scope.sameInput)
                {
                    //then check for match in our selected data set and our main data set
                    if(data_set_check != undefined)
                        $scope.update(data_set_check);
                    else
                        $scope.hasError=true;

                    return;
                }

                $scope.hasError=true;
                console.error("Error, Existing before in our output , or not among data set");
            };

        /**
         * This method removes the item from our selected tags, and it broadcast an event that an element has been removed to its parent
         * @param item
         */
        $scope.remove=function (item) {
          $scope.selected=$filter('filter')($scope.selected, function(value, index) {return value !== item;});
            $scope.$emit('tagRemoved',item);
        };

    };




    var directive = function () { 
        return {
            restrict: 'E',
            scope: {
                type: '@',
                theme:'@',//help to get theme to use in manipulating tag vie
                data: '=',//if set , is where we use in our data set to check if the entered item match any of the fields/items in it
                selected:'=',//return the selected item(s)/tags here
                sameInput:'=',//to allow same input , that is a selected item can appear more than once in our tagging system
                allowOutsideDataSet:'=',//if the allowed input should be outside the data set specified
                typehead:'=',//used in turning type head to assist users when typing or not
                displayField:'@',//field to display to the user in the data set to the tag view
                placeholder:'@'//assist users so they can use their place holders , if not placed it wud use the default
            },
            templateUrl: function(elem, attr){
                return 'angular-tag/templates/'+attr.type+'.html';
            },
            controller: controllerFunction, //Embed a custom controller in the directive
            link: function ($scope, element, attrs) {
            } //DOM manipulation
        };
    };

    /**
     * This directive helps to manipulate the text input to make it focusable
     * @returns {{restrict: string, link: link}}
     */
    var directive_focus=function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focusMe, function(value) {
                    if(value === true)
                        element[0].focus();
                });
            } //DOM manipulation
        };
    };

   /* //make ngAnimate to be optional
    var module=angular.module('angular-tag',['angular-tag/templates']);
    try{
        module=angular.module('angular-tag',['ngAnimate','angular-tag/templates'])
    }catch(e){
        console.error(e);
    }*/
   var module=angular.module('angular-tag',['ngAnimate','angular-tag/templates']);
    module.directive('tagMe', directive)
        .directive('focusMe',directive_focus) ;
}());
angular.module('angular-tag/templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('angular-tag/templates/input.html','<div id="main-tag">\r\n<div class="tag-container">\r\n <ul ng-class="[\'tag\',{focus:isFocus},theme ]" ng-click="isFocus=true">\r\n    <li ng-repeat="select in selected" ng-click="moveToTag($event,$index)">\r\n      {{select[displayField]}}  <a href="javascript:void(0)" ng-click="remove(select)">&times;</a>\r\n    </li>\r\n<li>\r\n    <input ng-class="{error:hasError}" ng-model="input" ng-keyup="on_input_keyup($event)" ng-focus="isFocus=true" ng-blur="isFocus=false" focus-me="isFocus"\r\n         type="input" placeholder="{{placeholder}}"  >\r\n</li>\r\n </ul>\r\n</div>\r\n\r\n<ul class="tag-typehead" ng-show="input.length && typehead && results.length " >\r\n    <li class="animate-repeat" ng-repeat="item in data | filter:input as results">\r\n       <a href="javascript:void(0)" ng-click="processor(item[displayField])">{{item[displayField]}}</a>\r\n    </li>\r\n    <!--<li class="animate-repeat" ng-if="results.length == 0">\r\n        <strong>No results found...</strong>\r\n    </li>-->\r\n</ul>\r\n</div>');}]);