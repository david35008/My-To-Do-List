const tasksList = document.getElementById('tasksList');
let toDoList = [];

// Load the document changes from the local storage
function getItemStored() {
    let reply = confirm("All your current tasks will be deleted.\nare you sure?");
    if (reply == true) {
        toDoList = JSON.parse(localStorage.getItem("mytasks"));
        refreshDisplay();
    };
};
// add button to load changes
const loadChanges = document.getElementById('loadChanges');
loadChanges.addEventListener('click', getItemStored);

// Add zero padding to 2 digits numbers
function pad(num) { return ('00' + num).slice(-2) };

// Change the date to SQL date format
function formatDate(date) {
    dateStr = date.getUTCFullYear() + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + ' ' +
        pad(date.getUTCHours() + 3) + ':' +
        pad(date.getUTCMinutes()) + ':' +
        pad(date.getUTCSeconds());
    return dateStr;
};

// Add task to the "do_List" array and add it to the dispaly
function addTask() {
    const taskDescription = textInput.value;
    const priority_Num = priorityChoose.value;
    if (taskDescription !== "" && priority_Num !== "--") {
        let obj = {
            priority_Num: priority_Num,
            date: formatDate(new Date()),
            taskDescription: taskDescription,
            checked: false
        };
        toDoList.push(obj);
        refreshDisplay();
        addDraggingOption();
        textInput.value = "";
        priorityChoose.value = "--";
    };
};
// Add input elements for adding tasks
const textInput = document.getElementById('textInput');
const priorityChoose = document.getElementById('prioritySelector');
const addButton = document.getElementById('addButton');
addButton.addEventListener('click', addTask);


// add funtion for node self-removal
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};


// Apply the line-through decoration for done tasks
function applyStyle(checkbox, containerDiv) {
    if (checkbox.checked == true) {
        containerDiv.style = "text-decoration: line-through;";
    }
    else {
        containerDiv.style = "";
    };
};

// Add line to display
function addTaskLine(taskObj) {
    const containerDiv = addChild(tasksList, "todoContainer");
    addChild(containerDiv, "todoPriority", taskObj.priority_Num);
    addChild(containerDiv, "todoCreatedAt", taskObj.date);
    addChild(containerDiv, "todoText", taskObj.taskDescription);

    const checkBox = document.createElement('input');
    checkBox.type = "checkbox";
    checkBox.className = "checkbox";
    checkBox.checked = taskObj.checked;
    containerDiv.appendChild(checkBox);
    applyStyle(checkBox, containerDiv);

    checkBox.onclick = () => {
        applyStyle(checkBox, containerDiv);
        copyToArray();
    };
    const delButton = document.createElement('button');
    delButton.className = "delButton";
    containerDiv.appendChild(delButton);
    delButton.onclick = () => {
        delButton.parentElement.remove();
        copyToArray();
        refreshDisplay();
    };
};


// Add div child
function addChild(parent, className, taskDescription) {
    let newDiv = document.createElement('div');
    parent.appendChild(newDiv);
    newDiv.className = className;
    newDiv.textContent = taskDescription;
    return newDiv;
};

// Add event to the "sort" button
const orderButton = document.getElementById('sortButton');
orderButton.addEventListener('click', orderList);

// Order the tasks list by priority
function orderList() {
    toDoList.sort(function (a, b) {
        return +b.priority_Num - +a.priority_Num;
    });
    refreshDisplay();
};

// Remove all child nodes of a list
function removeAllChildren(parent) {
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    };
};

// Clean the list on display and add the new list to display
function refreshDisplay() {
    removeAllChildren(tasksList);

    for (let i = 0; i < toDoList.length; i++) {
        addTaskLine(toDoList[i]);
    };
    document.getElementById('counter').textContent = toDoList.length;
    addDraggingOption();
};

// Copy the display to the toDoList array:
function copyToArray() {
    toDoList.splice(0, toDoList.length);
    listItemsElements = document.getElementById('tasksList').children;
    for (let i = 0; i < listItemsElements.length; i++) {
        const element = listItemsElements[i];

        let obj = {
            priority_Num: element.children[0].textContent,
            date: element.children[1].textContent,
            taskDescription: element.children[2].textContent,
            checked: element.children[3].checked
        };
        toDoList.push(obj);
    };
};

// Add option "Clear All" button
function cleartasks() {
    var reply = confirm("are you sure?");
    if (reply == true) {
        toDoList.splice(0, toDoList.length);
        refreshDisplay();
    };
};
const clearbutton = document.getElementById('clearButton');
clearbutton.addEventListener('click', cleartasks);

// Add option to save the tasks to the local storage
function svaechanges() {
    if (toDoList[0] == undefined) {
        localStorage.clear();
    } else { 
        localStorage.setItem("mytasks", JSON.stringify(toDoList));
    };
};
const svaeChanges = document.getElementById('svaeChanges');
svaeChanges.addEventListener('click', svaechanges);

// Drag and drop element in a list
function addDraggingOption() {
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

    // Check if "nodeA" is above "nodeB"
    const isAbove = function (nodeA, nodeB) {

        // Get the bounding rectangle of nodes
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();
        return (rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2);
    };

    // The current position of mouse relative to the dragging element
    let x = 0;
    let y = 0;

    // Handling the mouse click down event
    const mouseDownHandler = function (e) {
        if (e.target.className == "delButton" || e.target.className == "checkbox") {
            return;
        };
        draggingEle = e.currentTarget;

        // Calculate the mouse position
        const rect = draggingEle.getBoundingClientRect();
        x = e.pageX - rect.left;
        y = e.pageY - rect.top;

        // Attach the listeners to "document"
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    // Handling the mouse move event
    const mouseMoveHandler = function (e) {
        const draggingRect = draggingEle.getBoundingClientRect();
        if (!isDraggingStarted) {
            isDraggingStarted = true;

            // For the next element won't move up
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

        // Move the dragg element to the top
        if (prevEle && isAbove(draggingEle, prevEle)) {
            swap(placeholder, draggingEle);
            swap(placeholder, prevEle);
            return;
        };

        // move the dragg element to the bottom
        if (nextEle && isAbove(nextEle, draggingEle)) {
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
        };
    };
    // Handling the mouse click up event
    const mouseUpHandler = function () {
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
        copyToArray();
        refreshDisplay();
    };

    // Query all items
    [].slice.call(list.getElementsByClassName('todoContainer')).forEach(function (item) {
        item.addEventListener('mousedown', mouseDownHandler);
    });
};