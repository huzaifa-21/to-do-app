// Selectors 
let input = document.querySelector(".input");
let taskContainer = document.querySelector(".tasks");
let submit = document.querySelector(".submit");
let task = document.querySelector(".task");
let del = document.querySelector("button");
let count = document.querySelector(".count span");
let finish = document.querySelector(".finish span");

let Tasks = [];

if (localStorage.getItem("Tasks")) {
  Tasks = JSON.parse(localStorage.getItem("Tasks"));

}

getData();

input.focus();
// add task to list
submit.onclick = function (e) {
  if (input.value !== '') {
    addTask(input.value);
    addDAtaToPage(Tasks);
    addDataToStorage(Tasks);
  }
  input.value = '';
  input.focus();
  e.preventDefault();
};

taskContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    e.target.parentElement.parentElement.remove();
    deletTask(e.target.parentElement.parentElement.getAttribute("data-id"));
  }
  if (e.target.classList.contains("task")) {
    toggleStatus(e.target.getAttribute("data-id"));
    e.target.classList.toggle("done");
    finishCount(Tasks);

  }
  count.innerHTML = Tasks.length > 1 ? `${Tasks.length} Tasks` : `${Tasks.length} Task`;

});

function addTask(taskText) {
  let newTask = {
    id: Date.now(),
    title: taskText,
    status: false
  };
  Tasks.push(newTask);

}


function editData() {
  taskContainer.addEventListener("click", (e) => {
    if (e.target.className === 'edit') {
      e.preventDefault();
      e.target.parentElement.previousElementSibling.toggleAttribute('readonly');
      e.target.parentElement.previousElementSibling.focus();
      if (e.target.parentElement.previousElementSibling.hasAttribute('readonly')) {
        upadateTask(e.target.parentElement.parentElement.dataset.id);
        addDataToStorage(Tasks);
      }
    }
  });
}

let inputs = document.querySelectorAll(".task");

function upadateTask(e) {
  Tasks.forEach(task => {
    if (task.id === +e) {
      inputs.forEach((input) => {
        if (task.id === +input.getAttribute("data-id")) {
          Tasks.forEach(task => {
            if (task.id === +input.getAttribute("data-id")) {
              task.title = input[0].value;
              addDataToStorage(Tasks);
            }
          });
        }
      });
    }
  });
  addDataToStorage(Tasks);
}

editData();

function addDAtaToPage(tasks) {
  taskContainer.innerHTML = "";
  tasks.forEach((task) => {
    let div = document.createElement("form");
    let span = document.createElement("span");
    let input = document.createElement("input");
    input.type = 'text';
    input.className = 'text';
    input.value = task.title;
    input.dataset.value = task.title;
    input.setAttribute('readonly', 'true');
    let options = document.createElement("div");
    let editButton = document.createElement("input");
    editButton.type = 'submit';
    editButton.value = 'Edit';
    editButton.classList.add("edit");
    options.appendChild(editButton);
    options.appendChild(span);
    span.appendChild(document.createTextNode("Delete"));
    div.className = "task";
    if (task.status) {
      div.className = "task done";
    }
    div.dataset.id = task.id;
    span.className = "del";
    div.appendChild(input);
    div.appendChild(options);

    taskContainer.appendChild(div);
    count.innerHTML = Tasks.length > 1 ? `${Tasks.length} Tasks` : `${Tasks.length} Task`;

  });
}

function addDataToStorage(array) {
  localStorage.setItem("Tasks", JSON.stringify(array));
}

function getData() {
  let data = localStorage.getItem("Tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addDAtaToPage(tasks);
  }
}

function deletTask(taskId) {
  Tasks = Tasks.filter((task) => task.id != taskId);
  addDataToStorage(Tasks);
}

function toggleStatus(id) {
  Tasks.forEach((task) => {
    if (task.id == id) {
      task.status == false ? task.status = true : task.status = false;
    }
  });
  addDataToStorage(Tasks);
}

del.onclick = function () {
  if (JSON.parse(localStorage.getItem("Tasks")).length > 0) {
    popUp();
  }
};

checkChoice();

function popUp() {
  let overLay = document.createElement("div");
  overLay.className = 'over-lay';
  let box = document.createElement("div");
  box.className = 'box';
  box.innerHTML = `
      <p><span style="color:red;font-weight: bold;">Delete</span> All Tasks ?</p>
      <div class="choice">
        <span class="yes">Yes</span>
        <span class="no">No</span>
      </div>
      <div class="close">X</div>`;
  overLay.appendChild(box);
  document.body.appendChild(overLay);
  setTimeout(() => {
    box.style.cssText = 'width:266px;height:193px;';
  }, 20);
  setTimeout(() => {
    document.querySelector(".box p").style.opacity = '1';
    document.querySelector(".box .choice span").style.opacity = '1';
    document.querySelector(".box .choice .no").style.opacity = '1';
    document.querySelector(".box .close").style.opacity = '1';
  }, 230);
}

function checkChoice() {
  addEventListener("click", (e) => {
    if (e.target.className === 'close') {
      document.querySelector(".over-lay").remove();
    }
    if (e.target.className === 'yes') {
      taskContainer.innerHTML = '';
      localStorage.removeItem("Tasks");
      Tasks = [];
      addDataToStorage(Tasks);
      count.innerHTML = "Nothing";
      finish.innerHTML = "No Task";
      document.querySelector(".over-lay").remove();
      input.focus();
    }
    if (e.target.className === 'no') {
      document.querySelector(".over-lay").remove();
    }
  });
}

function finishCount(tasks) {
  tasks = tasks.filter(e => {
    if (e.status === true) {
      return e;
    }
  });
  let finishCount = tasks.length;
  localStorage.setItem("count", finishCount);
  finish.innerHTML = localStorage.getItem("count");
}

finish.innerHTML = localStorage.getItem("count")


