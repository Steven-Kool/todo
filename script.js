const input = document.getElementById('input');
const btn = document.querySelector('.add-button');
const listHolder = document.getElementById('list-holder');

let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
todoList.sort((a, b) => a.finished - b.finished);

const savingTodo = () => {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

const time = (id = false, time = false) => {
  const d = new Date();
  const month = d.getMonth() + 1;
  if(id) {
    return d.getTime();
  } else if(time) {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')} | ${month.toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
  }
}

const implement = () => {
  listHolder.innerHTML = "";
  if(todoList && todoList.length !== 0) {
    todoList.forEach(todo => {
      listHolder.insertAdjacentHTML('beforeend', 
        `<div class="list ${todo.finished ? "list-finished" : "list-unfinished"}">
          <div class="display-holder" id=${todo.id}>
            <input type="checkbox" onclick="finish(this.id, this)" id="${todo.id}" ${todo.finished ? "checked" : ""} />
  
            <div class="display">
              ${todo.edit ? 
                `<div class="edit-input-holder">
                  <input type="text" class="edit-input" onkeypress="editTodo(event, this.id, this)" id="${todo.id}" value="${todo.text}" autofocus />
                </div>` : 
                `<div class="text-holder">
                  <p class="text inner ${todo.finished ? "finished" : ""}">${todo.text}</p>
                </div>`
              }
  
              <div class="time-holder">
                <p class="time inner ${todo.finished ? "finished" : ""}">${todo.edited_time ? `${todo.created_time} . edited : ${todo.edited_time}` : `${todo.created_time}`}</p>
              </div>
            </div>
          </div>
          
          <div class="btns-holder">
            <svg xmlns="http://www.w3.org/2000/svg" onclick="toEditTodo(this.id)" class="${todo.edit ? "none" : "todo-btn"}" id="${todo.id}" viewBox="0 -960 960 960"><path d="M186.67-186.67H235L680-631l-48.33-48.33-445 444.33v48.33ZM120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm652.67-606-46-46 46 46Zm-117 71-24-24.33L680-631l-24.33-24Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" onclick="deleteTodo(this.id)" class="todo-btn" id="${todo.id}" viewBox="0 -960 960 960"><path d="M267.33-120q-27.5 0-47.08-19.58-19.58-19.59-19.58-47.09V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-328 469.33h66.66v-386h-66.66v386Zm164 0h66.66v-386h-66.66v386ZM267.33-740v553.33V-740Z"/></svg>
          </div>
        </div>`
      );
    });
  } else {
    listHolder.innerHTML = "<div class='no-todo'>No Todo List</div>";
  }
}

document.addEventListener('DOMContentLoaded', implement);

const addTodo = () => {
  const todo = input.value.trim().replace(/\s+/g, ' ');
  if(todo) {
    const createdTime = time(false, true);

    todoList.push({id: time(true, false), text: todo, created_time: createdTime, finished: false, edit: false});

    savingTodo();
    implement();
  } else {
    alert("Please enter valid Todo!!!");
  }
}

const common = () => {
  savingTodo();
  implement();
}

const finish = (id, input) => {
  const todo = todoList.find(todo => todo.id === Number(id));
  todo.finished = input.checked;
  todo.edit = false;
  common();
}

const toEditTodo = (id) => {
  const todo = todoList.find(todo => todo.id === Number(id));
  todo.edit = true;
  common();
  const todos = todoList.filter(todo => todo.edit === true);
  if(todos.length > 1) {
    const notClicked = todos.find(todo => todo.id !== Number(id));
    notClicked.edit = false;
    common();
  }
}

const editTodo = (e, id, input) => {
  if(e.key === "Enter") {
    const todo = todoList.find(todo => todo.id === Number(id));
    const text = input.value.trim().replace(/\s+/g, ' ');
    const edited_time = "edited_time";
    if(text) {
      todo.text = text;
      todo.edit = false;
      todo[edited_time] = time(false, true);
      common();
    } else {
      alert("Please enter valid Todo!!!");
    }
  }
}

const deleteTodo = (id) => {
  todoList = todoList.filter(todo => todo.id !== Number(id));
  common();
}

btn.addEventListener('click', addTodo);

console.log(todoList);

const prefEntries = performance.getEntriesByType('navigation');
if(prefEntries[0].type === 'reload') {
  const todos = todoList.filter(todo => todo.edit === true);
  if(todos) {
    todos.forEach(todo => todo.edit = false);
    savingTodo();
  }
}