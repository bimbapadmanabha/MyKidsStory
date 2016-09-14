/**  
* @description customFileReader
* customFileReader is a custom directive implementation that is going to perform 
* file read and parse the file contents and search for any palindrome occurences and return 
* the array of palindrome strings and its count
*
* @scope
* @param {String} custom-id is the Id of the file input widget
* @param {Object} output is the output array containing the palindrome occurances and its count. Format of Array is [{name:"<palindrome string", count:<count of the # of occurences}]
**/
angular.module("codeAssignment").directive("customFileReader", [function() {
    return {
        scope: {
            customId: '@',
            output:'='
        },
        restrict: 'E',
        templateUrl: './scripts/directives/fileReaderDirective.tpl.html',
        link: function($scope, $element, $attrs) {
            /* The file reader is used to read the file */
            $element.bind('change', function(evt){
               var f = evt.target.files[0];
                if (f) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        $scope.output = $scope.parseFile(contents);
                        $scope.$apply();
                    }
                    r.readAsText(f);
                } else {
                    alert("Failed to load file");
                }
                
            });
            
            
            
            /* The parseFile methof parses the file and identifies 
            *  any palindrome after spliting based on space and special characters.
            *  For any occurance of the palindrome string, it checks if the entry is 
            *  already available in the array. If yes, it increments the counter. If its a new palindrome, it adds a new entry in the format *  {name:"<palindrome string", count:<count of the # of occurences}
            *  The array is sorted based on count and for all teh occurances where the count is same, it is sorted lexographically.
            */
            $scope.parseFile= function(contents) {
                var palindromeArray = []; 
                var newSplitArray = contents.split(/[\s\W]+/);
                for (var i = 0; i < newSplitArray.length; i++) {
                    console.log(newSplitArray[i]);
                    // check if each of the word is a palindrome
                    var originalWord = newSplitArray[i];
                    var reverseWord = originalWord.split('').reverse().join('');
                    console.log("reverseword is " + reverseWord);
                    if(originalWord === "")
                        continue;
                    if (originalWord.toLowerCase() === reverseWord.toLowerCase()) {
                        console.log("This is a palidrome word" + originalWord);
                        var countUpdated = false;;
                        var reqPalindrome = palindromeArray.filter(function(palindromeObj, index, palindromeArray) {
                            if (palindromeObj.name == originalWord.toLowerCase()) {
                                countUpdated = true;
                                palindromeArray[index].count++;
                            }
                            return palindromeObj.name == originalWord.toLowerCase()
                        });

                        if (countUpdated === true) {
                            reqPalindrome.count++;
                            palindromeArray
                        } else {
                            var newPalObject = {
                                name: originalWord.toLowerCase(),
                                count: 1
                            };
                            palindromeArray.push(newPalObject);

                        }
                    }
                }

                /* now the array is formed. Next task is to sort them based on count
                *and if count is same, we need to sort it alphabetically */

                palindromeArray.sort(function(a, b) {
                    console.log("a.toString() is" + a.count.toString());
                    // check if the count is same
                    if (b.count - a.count === 0) {
                        return ((a.name > b.name) - (b.name > a.name));
                    } else {
                        return b.count - a.count;
                    }
                });
                console.log("palindromeArray.length is" + palindromeArray.length);
                for (var i = 0; i < palindromeArray.length; i++) {
                    console.log(palindromeArray[i].name + " > " + palindromeArray[i].count);
                }
                
                return palindromeArray;
            };
            
            $scope.resetFile = function(){
                var inputFile = document.getElementById($scope.customId);
                inputFile.value= null;
                $scope.output = [];
                $scope.$apply();
            }

        }
    }
}]);
