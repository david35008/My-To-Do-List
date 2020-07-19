const my_Button = document.getElementById('addButton');
const input_Box = document.getElementById('textInput');
const the_List = document.getElementById('tasksList');
const priority_Choose = document.getElementById('prioritySelector');
my_Button.addEventListener('click', addTask);
function addTask() {
    const box_Value = input_Box.value;
    const priority_Num = priority_Choose.value;
    if (box_Value !== "" && priority_Num !== "--") {
        const row_Create = document.createElement('li');
        the_List.appendChild(row_Create);
        const div_Create1 = document.createElement('div');
        div_Create1.className = "todoContainer";
        row_Create.appendChild(div_Create1);
        const div_Create2 = document.createElement('div');
        div_Create2.className = "todoPriority";
        div_Create2.textContent = priority_Num;
        div_Create1.appendChild(div_Create2);
        const div_Create3 = document.createElement('div');
        div_Create3.className = "todoCreatedAt";
        const pad = function (num) { return ('00' + num).slice(-2) };
        let date = new Date();
        date = date.getUTCFullYear() + '-' +
            pad(date.getUTCMonth() + 1) + '-' +
            pad(date.getUTCDate()) + ' ' +
            pad(date.getUTCHours() + 3) + ':' +
            pad(date.getUTCMinutes()) + ':' +
            pad(date.getUTCSeconds());
        div_Create3.textContent = date;
        div_Create1.appendChild(div_Create3);
        const div_Create4 = document.createElement('div');
        div_Create4.className = "todoText ";
        div_Create4.textContent = box_Value;
        div_Create1.appendChild(div_Create4);
        input_Box.value = "";
        priority_Choose.value = "--";
    };

};