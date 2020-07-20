const my_Button = document.getElementById('addButton');
const input_Box = document.getElementById('textInput');
const the_List = document.getElementById('tasksList');
const priority_Choose = document.getElementById('prioritySelector');
const do_List = [];

// add event to the "add" button:
my_Button.addEventListener('click', addTask);

// add task to the do_List array and add it to the dispaly:
function addTask() {
    const box_Value = input_Box.value;
    const priority_Num = priority_Choose.value;
    if (box_Value !== "" && priority_Num !== "--") {
        let obj = {
            priority_Num: priority_Num,
            date: formatDate(new Date()),
            box_Value: box_Value
        };
        do_List.push(obj);
        print_tasks();
        dragElement();
        input_Box.value = "";
        priority_Choose.value = "--";
    };
};

// add zero padding to 2 digits numbers:
function pad(num) { return ('00' + num).slice(-2) };

// change the date to SQL date format:
function formatDate(date) {
    dateStr = date.getUTCFullYear() + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + ' ' +
        pad(date.getUTCHours() + 3) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds());
    return dateStr;
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

// add line to display:
function print_line(obj) {
    const div_Create1 = addChild(the_List, "todoContainer");
    addChild(div_Create1, "todoPriority", obj.priority_Num);
    addChild(div_Create1, "todoCreatedAt", obj.date);
    addChild(div_Create1, "todoText", obj.box_Value);
    const newLocal = document.createElement('button');
    newLocal.className = "delButton";
    newLocal.textContent = "delete"
    div_Create1.appendChild(newLocal);
    newLocal.onclick=()=>{
        newLocal.parentElement.remove();
        copy_toarray();
        print_tasks();
        dragElement();
    };
    
};

// add div child:
function addChild(parent, className, text) {
    let div_Create = document.createElement('div');
    parent.appendChild(div_Create);
    div_Create.className = className;
    div_Create.textContent = text;
    return div_Create;
};

// add event to the "sort" button:
const order_Button = document.getElementById('sortButton');
order_Button.addEventListener('click', orderList);

// order the tasks list by priority:
function orderList() {
    do_List.sort(function (a, b) {
        return +b.priority_Num - +a.priority_Num;
    });
    print_tasks();
    dragElement();
    
};

// clean the list on display and add the new list to display.
function print_tasks() {
    cleanUl(the_List);

    for (let i = 0; i < do_List.length; i++) {
        print_line(do_List[i]);
    };
    document.getElementById('counter').textContent = do_List.length;
};

// remove all child nodes of a list:
function cleanUl(the_List) {
    while (the_List.hasChildNodes()) {
        the_List.removeChild(the_List.firstChild);
    };
};

function copy_toarray() {
    do_List.splice(0, do_List.length)
    listItemsElements = document.getElementById('tasksList').children;
    for (let i = 0; i < listItemsElements.length; i++) {
        const element = listItemsElements[i];

        let obj = {
            priority_Num: element.children[0].textContent,
            date: element.children[1].textContent,
            box_Value: element.children[2].textContent
        };
        do_List.push(obj);

    };

};
// Drag and drop element in a list:
function dragElement() {
    const list = document.getElementById('tasksList');
    let draggingEle;
    let placeholder;
    let isDraggingStarted = false;

    // Swap two nodes
    const swap = function (nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
        nodeB.parentNode.insertBefore(nodeA, nodeB);
        parentA.insertBefore(nodeB, siblingA);
    };

    // Check if `nodeA` is above `nodeB`
    const isAbove = function (nodeA, nodeB) {
        // Get the bounding rectangle of nodes
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();
        return (rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2);
    };

    // The current position of mouse relative to the dragging element
    let x = 0;
    let y = 0;

    const mouseDownHandler = function (e) {
        if (e.target.className=="delButton") {
            e.preventDefault();
            return;
        }
        draggingEle = e.currentTarget;
        // draggingEle = draggingEle1.parentNode;

        // Calculate the mouse position
        const rect = draggingEle.getBoundingClientRect();
        x = e.pageX - rect.left;
        y = e.pageY - rect.top;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        const draggingRect = draggingEle.getBoundingClientRect();
        if (!isDraggingStarted) {
            isDraggingStarted = true;

            // for the next element won't move up
            placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
            placeholder.style.height = `${draggingRect.height}px`;
        };

        // Set position for dragging element
        draggingEle.style.position = 'absolute';
        draggingEle.style.top = `${e.pageY - y}px`;
        draggingEle.style.left = `${e.pageX - x}px`;
        const prevEle = draggingEle.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;

        // move the dragg element to the top
        if (prevEle && isAbove(draggingEle, prevEle)) {
            swap(placeholder, draggingEle);
            swap(placeholder, prevEle);
            return;
        }

        // move the dragg element to the bottom
        if (nextEle && isAbove(nextEle, draggingEle)) {
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
        }
    };

    const mouseUpHandler = function () {
        // if ( placeholder.parentNode !== null ){}
        placeholder && placeholder.parentNode.removeChild(placeholder);
        draggingEle.style.removeProperty('top');
        draggingEle.style.removeProperty('left');
        draggingEle.style.removeProperty('position');
        x = null;
        y = null;
        draggingEle = null;
        isDraggingStarted = false;
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        copy_toarray();
        print_tasks();
        dragElement();
    };

    // Query all items
    [].slice.call(list.getElementsByClassName('todoContainer')).forEach(function (item) {
        item.addEventListener('mousedown', mouseDownHandler);
    });
};