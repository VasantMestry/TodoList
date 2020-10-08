let todos = [];
let input = document.querySelector("input[type = 'text']");
const list = document.querySelector("#todoList");
const addBtn = document.querySelector(".addBtn");
let source;


function dragStarted(event) {
  source = event.target;
  console.log(event.target.outerHTML)
  event.dataTransfer.setData("text/html", event.target.innerHTML);
  event.dataTransfer.effectAllowed = "move";
}

function draggingOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}


function dropped(event) {
  event.preventDefault();
  event.stopPropagation();
  source.innerHTML = event.target.innerHTML;
  event.target.innerHTML = event.dataTransfer.getData("text/html");
}


const addTodo = (text) => {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todos.push(todo);
  list.insertAdjacentHTML(
    "afterbegin",
    `
		<div 
			class="list" 
			data-key="${todo.id}"
			id="${todo.id}"
			draggable="true"
			ondragstart="dragStarted(event)"
			ondragover="draggingOver(event)"
			ondrop="dropped(event)"
		>
			<button class="deleteTodo" data-key=${todo.id} onclick="${(e) =>
      deleteTodo(e)}">X</button>
			<span class="text">${todo.text}</span>
		</div>`
  );
};

addBtn.addEventListener("click", () => {
  const text = input.value.trim();

  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});

const completeTodo = (key) => {
  const index = todos.findIndex((item) => item.id === Number(key));
  todos[index].checked = !todos[index].checked;

  const item = document.querySelectorAll(`[data-key='${key}']`);

  if (todos[index].checked) {
    item[0].classList.add("done");
  } else {
    item[0].classList.remove("done");
  }
};

const deleteTodo = (key) => {
  todos = todos.filter((item) => item.id !== Number(key));
  const item = document.querySelector(`[data-key='${key}']`);
  item.remove();
  if (todos.length === 0) list.innerHTML = "";
};

list.addEventListener("click", (event) => {
  if (event.target.classList.contains("text")) {
    const todoKey = event.target.parentElement.dataset.key;
    completeTodo(todoKey);
  }

  if (event.target.classList.contains("deleteTodo")) {
    const todoKey = event.target.parentElement.dataset.key;
    deleteTodo(todoKey);
  }
});
