document.addEventListener("DOMContentLoaded", function () {
  let currentDate = Date.now();
  const list = document.querySelector("#todo_list");
  let tasks = JSON.parse(localStorage.getItem("task-list")) || [];

  const renderTodoItem = function (id, description, dueDate) {
    const newTodoItem = document.createElement("li");
    newTodoItem.classList.add("todo_list--item");
    newTodoItem.setAttribute("data-id", id);

    newTodoItem.innerHTML = `
    <div class="col-lg-2 col-md-2 col-sm-2">${id}</div>
    <div class="col-lg-4 col-md-4 col-sm-4">${description}</div>
    <div class="col-lg-2 col-md-2 col-sm-2">${dueDate}</div>
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

  const renderTasks = function () {
    list.innerHTML = "";

    tasks.forEach((task) => {
      const todoItem = renderTodoItem(task.id, task.description, task.dueDate);
      list.appendChild(todoItem);

      // Add click event listener for delete button
      const deleteButton = todoItem.querySelector(".modified_button--delete");
      deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
      });

      const completeButton = todoItem.querySelector(
        ".modified_button--completed"
      );
      completeButton.addEventListener("click", function () {
        completeTask(task.id);
      });
    });
  };
  renderTasks();

  const deleteTask = (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
  };

  let isCompleted = false;
  const completeTask = (id) => {
    tasks.forEach((task) => {
      if (task.id === id) {
        const todoItem = document.querySelector(
          `#todo_list li[data-id="${id}"]`
        );
        if (!isCompleted) {
          todoItem.classList.remove("todo_list--item");
          todoItem.classList.add("todo_list--item_finished");
          isCompleted = true;
        } else {
          todoItem.classList.remove("todo_list--item_finished");
          todoItem.classList.add("todo_list--item");
          isCompleted = false;
        }
      }
    });
  };

  // FOR THE INPUT FORM
  let formIsOpen = false;
  const inputField = document.querySelector(".addList_section--input");
  inputField.addEventListener("click", function () {
    if (!formIsOpen) {
      const inputForm = document.createElement("div");

      inputForm.innerHTML = `

      <div class = 'inputForm'>
        <div class = 'input_Form--header'>ADD A TASK</div>
          <div class = 'input_section--description'>
          <div class = 'input_Form '>Description</div>
          <input type="text" class="addList_section--input"  id = 'descriptionInput' placeholder="Add a new task">

        </div>

        <div class = 'input_section--date'>
            <div class = 'input_Form '>Due Date</div>
            <input type="date" class="addList_section--input" id = 'dateInput' placeholder="Due date">

        </div>
        <div class = 'input_section--button'>
            <div class = 'addList_section--button'>
              <button class="modified_button--completed">
              <span class="material-symbols-outlined"> add </span>
              </button>
            </div>
            <div class = 'inputForm--cancel'>
              <button class = 'modified_button--delete'>
              <span class="material-symbols-outlined">
                  cancel
                  </span>
              </button>
            </div>


        </div>

      </div>

      `;
      document.body.appendChild(inputForm);

      formIsOpen = true;

      const cancelButton = inputForm.querySelector(".inputForm--cancel");
      cancelButton.addEventListener("click", function () {
        inputForm.remove();
        formIsOpen = false;
      });

      // FOR THE ADD BUTTON

      const addButton = inputForm.querySelector(".addList_section--button");
      let descriptionInputField = inputForm.querySelector("#descriptionInput");
      let dateInputField = inputForm.querySelector("#dateInput");
      addButton.addEventListener("click", function () {
        const descriptionInputValue = descriptionInputField.value.trim();
        const dateInputValue = dateInputField.value.trim();
        if (descriptionInputValue !== "" && dateInputValue !== "") {
          // Add a new task
          tasks.push({
            id: tasks.length + 1,
            description: descriptionInputValue,
            dueDate: dateInputValue,
          });

          localStorage.setItem("task-list", JSON.stringify(tasks));

          // Re-render the updated tasks
          renderTasks();
          console.log(tasks);

          descriptionInputField.value = "";
          inputForm.remove();
          formIsOpen = false;
        }
      });
    }
  });

  const deleteAllButton = document.getElementById("delete_All");
  deleteAllButton.addEventListener("click", function () {
    tasks = [];
    renderTasks();
  });
});
