'use strict';

// Register `officerTools` component, along with its associated controller and template
angular.module('officerTools').component('officerTools', {
	templateUrl: 'officer-tools/officer-tools.template.html',
	controller: ['$http', '$scope', '$sce', 'Member',
		function OfficerToolsController($http, $scope, $sce, Member) {
            let self = this;
            $scope.roles = [];
            let mem = Member;
            let roleMap = mem.getRoleMap();
            for (let role in roleMap) {
                if (role === 'FC' || role === 'HG') {
                    continue;
                }
                $scope.roles.push(
                    {
                        name: role,
                        title: roleMap[role],
                        checked: true
                    }
                );
            }

            $scope.tagTypes = [
                {
                    name: "post",
                    title: "Post(s)",
                },
                {
                    name: "pm",
                    title: "Private Messages (PMs)",
                }
            ];

            $scope.selectedTagType = 'post';

			$http.get(__env.apiUrl + '/get/divisionNames', {cache: true}).then(function(response) {
                $scope.divisions = response.data;
            });

            $scope.getTagList = function() {
                let formParams = {
                    divisions: [],
                    roles: [],
                    tagType: ''
                };
                if ($scope.selectedDivisions !== undefined) {
                    formParams.divisions = $scope.selectedDivisions;
                }
                if ($scope.selectedTagType !== undefined) {
                    formParams.tagType = $scope.selectedTagType;
                }
                $scope.roles.map(x => {
                    if (x.checked) {
                        formParams.roles.push(x.name);
                    }
                });
                $http.post(__env.apiUrl + '/get/tagList', formParams).then(function(response) {
                    console.log(response);
                    $scope.rawHtml = $sce.trustAsHtml(response.data);
                });
                console.log(formParams);
            }
        }
    ]
});