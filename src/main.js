const my_Button = document.getElementById('addButton');
const input_Box = document.getElementById('textInput');
const the_List = document.getElementById('tasksList');
const priority_Choose = document.getElementById('prioritySelector');
const do_List = [];

my_Button.addEventListener('click', addTask);

function addTask() {
    const box_Value = input_Box.value;
    const priority_Num = priority_Choose.value;
    if (box_Value !== "" && priority_Num !== "--") {
        obj = {
            priority_Num: priority_Num,
            date: formatDate(new Date()),
            box_Value: box_Value
        };
        do_List.push(obj);
        print_line(obj);
        document.getElementById('counter').textContent = do_List.length;
        input_Box.value = "";
        priority_Choose.value = "--";
    };
};

function pad(num) { return ('00' + num).slice(-2) };

function formatDate(date) {
    dateStr = date.getUTCFullYear() + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + ' ' +
        pad(date.getUTCHours() + 3) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds());
    return dateStr;
};

function print_line(obj) {
    const div_Create1 = addChild(the_List, "todoContainer");
    addChild(div_Create1, "todoPriority", obj.priority_Num);
    addChild(div_Create1, "todoCreatedAt", obj.date);
    addChild(div_Create1, "todoText", obj.box_Value);
};

function addChild(parent, className, text) {
    let div_Create = document.createElement('div');
    parent.appendChild(div_Create);
    div_Create.className = className;
    div_Create.textContent = text;
    return div_Create;
};

const order_Button = document.getElementById('sortButton');
order_Button.addEventListener('click', orderList);

function orderList() {
    do_List.sort(function (a, b) {
        return +a.priority_Num - +b.priority_Num;
    });
    cleanUl(the_List);

    for ( let i = do_List.length - 1 ; i >= 0 ; i-- ) {
        print_line(do_List[i]);
    };
};

function cleanUl(the_List) {
    while (the_List.hasChildNodes()) {
        the_List.removeChild(the_List.firstChild);
    };
};
