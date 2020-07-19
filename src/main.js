const my_Button = document.getElementById('addButton');
const input_Box = document.getElementById('textInput');
const the_List = document.getElementById('tasksList');
my_Button.addEventListener('click', addTask);
function addTask() {
    const row_Create = document.createElement('li');
    const box_Value = input_Box.value;
    row_Create.textContent = box_Value;
    if (box_Value !== "") {
        the_List.appendChild(row_Create);
    }
}