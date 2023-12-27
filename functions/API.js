const tasks = async () => {
  try {
    const response = await fetch(
      "https://658a8a68ba789a9622374750.mockapi.io/tasks",
      {
        method: "GET",
        headers: { "content-type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Cannot fetch the data");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error.message);
    throw error; // rethrow the error to handle it at a higher level if needed
  }
};

const renderTodoItem = (id, description, dueDate, isCompleted) => {
  const newTodoItem = document.createElement("li");
  const reformattedDate = reformatDate(dueDate);
  const itemClass = isCompleted
    ? "todo_list--item_finished"
    : "todo_list--item";

  newTodoItem.classList.add(itemClass);
  newTodoItem.setAttribute("data-id", id);

  newTodoItem.innerHTML = `
    <div class="col-lg-2 col-md-2 col-sm-2">${id}</div>
    <div class="col-lg-3 col-md-3 col-sm-3">${description}</div>
    <div class="col-lg-3 col-md-3 col-sm-3">${reformattedDate}</div>
    <div class="col-lg-2 col-md-2 col-sm-2">
      <button class="modified_button--completed">
        <span class="material-symbols-outlined"> done </span>
      </button>
    </div>
    <div class="delete_button">
      <div class="col-lg-2 col-md-2 col-sm-2">
        <button class="modified_button--delete">
          <span class="material-symbols-outlined"> delete </span>
        </button>
      </div>
    </div>
  `;

  return newTodoItem;
};

const renderTasks = async () => {
  try {
    const tasksData = await tasks();
    const list = document.querySelector("#todo_list");
    list.innerHTML = "";

    tasksData
      .slice()
      .reverse()
      .forEach((task) => {
        const { id, description, dueDate, isCompleted } = task;
        const todoItem = renderTodoItem(id, description, dueDate, isCompleted);
        list.appendChild(todoItem);
      });
  } catch (error) {
    console.error("Error rendering tasks:", error.message);
  }
};

renderTasks();
