document.addEventListener("DOMContentLoaded", function() {
    let courseDetails = null;
    let selectedTeeBoxIndex = 0;

    function getAvailableGolfCourses() {
        return fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem fetching the courses:', error);
            });
    }

    function populateCourseSelect(courses) {
        let courseOptionsHtml = '<option value="">Select a course</option>';
        courses.forEach(course => {
            courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
        });
        document.getElementById('course-select').innerHTML = courseOptionsHtml;
    }


    document.getElementById('course-select').addEventListener('change', function() {
        const courseId = this.value;

        if (courseId) {
            getGolfCourseDetails(courseId).then(details => {
                courseDetails = details; 
                if (courseDetails) {
                    populateTeeBoxSelect(courseDetails.teeBoxes);
                    document.getElementById('tee-box-select').disabled = false; 
                    createScoreTable(courseDetails.holes, selectedTeeBoxIndex);
                }
            });
        } else {
            document.getElementById('tee-box-select').disabled = true; 
        }
    });

    function getGolfCourseDetails(golfCourseId) {
        return fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem fetching the course details:', error);
            });
    }

    function populateTeeBoxSelect(teeBoxes) {
        let teeBoxSelectHtml = '<option value="">Select a tee box</option>';
        teeBoxes.forEach(function (teeBox, index) {
            teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.totalYards} yards</option>`;
        });
        document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;

        document.getElementById('tee-box-select').addEventListener('change', function() {
            selectedTeeBoxIndex = this.value;
            if (courseDetails && selectedTeeBoxIndex !== "") {
                createScoreTable(courseDetails.holes, selectedTeeBoxIndex);
            }
        });
    }

    function createScoreTable(holes, teeBoxIndex) {
        let frontNineHtml = '';
        let backNineHtml = '';

        holes.forEach((hole, index) => {
            let rowHtml = `<tr>
                <td>${hole.hole}</td>
                <td>${hole.teeBoxes[teeBoxIndex].par}</td>
                <td>${hole.teeBoxes[teeBoxIndex].yards}</td>
                <td><input type="number" class="form-control score-input" id="score-${index}" /></td>
            </tr>`;

            if (index < 9) {
                frontNineHtml += rowHtml;
            } else {
                backNineHtml += rowHtml;
            }
        });

        document.querySelector("#front-nine tbody").innerHTML = frontNineHtml;
        document.querySelector("#back-nine tbody").innerHTML = backNineHtml;
    }

    getAvailableGolfCourses().then(courses => {
        if (courses) {
            populateCourseSelect(courses);
        }
    });

    function showCompletionToast(playerName) {
        toastr.success(`${playerName}, you have completed the game!`);
    }
});
