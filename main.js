document.addEventListener("DOMContentLoaded", function() {
    function getAvailableGolfCourses() {
        return fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json", {
            mode: "no-cors"
        }).then(response => response.json());
    }

 {
        let courseOptionsHtml = '';
        courses.forEach(course => {
            courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
        });
        document.getElementById('course-select').innerHTML = courseOptionsHtml;
    }

    document.getElementById('course-select').addEventListener('change', function() {
        const courseId = this.value;

        function getGolfCourseDetails(golfCourseId) {
            return fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`, {
                mode: "no-cors"
            }).then(response => response.json());
        }

        getGolfCourseDetails(courseId).then(courseDetails => {
            populateTeeBoxSelect(courseDetails.teeBoxes);
            createScoreTable(courseDetails.holes);
        });
    });

    function populateTeeBoxSelect(teeBoxes) {
        let teeBoxSelectHtml = '';
        teeBoxes.forEach(function (teeBox, index) {
            teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.totalYards} yards</option>`;
        });
        document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
    }

    function createScoreTable(holes) {


