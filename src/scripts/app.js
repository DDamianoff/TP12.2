// noinspection JSUnresolvedVariable
const host = "http://localhost:3000";
const tableBody = document.getElementById("table-data-tbody");
const select = document.getElementById("course-selector");

async function DownloadCourses() {
    try{
        let courses = (await axios.get(`${host}/courses`)).data;

        let completeCourses = [];

        for (let course of courses) {
            let teacherPetition = `${host}/teachers/${course.teacherId}`;
            let statePetition = `${host}/states/${course.stateId}`;
            let teacher = (await axios.get(teacherPetition)).data;
            let state = (await axios.get(statePetition)).data;

            let completeCourse = {
                id: 1,
                name: course.name,
                state: {
                    id: state.id,
                    details: state.details
                },
                teacher: {
                    first_name: teacher.first_name,
                    last_name: teacher.last_name,
                    id: teacher.id
                }
            };
            completeCourses.push(completeCourse);
        }
        return completeCourses;
    } catch (err) {
        console.log(err);
        return null
    }
}

function loadCoursesIntoTable(courses){
    for (let course of courses) {
        if (course.state.id > 1){
            // pasándole 0 manda lo ultimo al primero.
            let tr = tableBody.insertRow();
            let td = [
                /* 0: nombre del curso */
                tr.insertCell(0),
                /* 1: estado */
                tr.insertCell(1),
                /* 2: profesor */
                tr.insertCell(2),
                /* 3: operación */
                tr.insertCell(3)
            ]
            let removeButton = document.createElement("input");

            tr.setAttribute('id',`courseInTable${course.id}`)

            td[0].appendChild(document.createTextNode(`${course.name}`));
            td[1].appendChild(document.createTextNode(`${course.state.details}`));
            td[2].appendChild(document.createTextNode(`${course.teacher.first_name} ${course.teacher.last_name}`));

            removeButton.setAttribute("value", "remover");
            removeButton.setAttribute("type", "button");
            removeButton.setAttribute("onclick", `removeCourse("${course.id}")`);

            td[3].appendChild(removeButton);
        }
    }
}

// noinspection JSUnusedGlobalSymbols
async function removeCourse(courseId){
    if (window.confirm("¿esta seguro que desea remover este curso?")){
        document.getElementById(`courseInTable${courseId}`).remove();
        try {
            await axios.patch(`${host}/courses/${Number(courseId)}`, {stateId: 1});
            window.location.reload();
        }catch (err) {
            console.log(err);
        }
    }
}


async function loadNewCourseSelectOption(courses) {
    for (let course of courses) {
        if (course.state.id === 1){
            let option = document.createElement("option");
            option.appendChild(document.createTextNode(`${course.name}`));

            option.setAttribute("id", `courseAddOption${course.id}`);
            option.setAttribute("value", `${course.id}`);

            select.appendChild(option);
        }
    }
}

async function AddCourse() {
    if (select.value === "value-default"){
        return;
    }
    try {
        let currentCourse = Number(select.value);
        await axios.patch(`${host}/courses/${currentCourse}`, {stateId:4});
        window.location.reload();
    } catch (e){
        console.log(e);
    }
}

async function main() {
    let courses = await DownloadCourses();
    if (courses == null) {
        window.alert("falló la carga de materias. El servidor no responde");
        close();
        return;
    }
    // cargará la tabla solo si hay cursos.
    if (courses){
        loadCoursesIntoTable(courses);
    }
    else {
        window.alert("no estás cursando ninguna materia");
    }
    await loadNewCourseSelectOption(courses);

    await document.getElementById('btnAddCourse').addEventListener('click',AddCourse);
}


window.onload = main