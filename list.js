document.addEventListener("DOMContentLoaded", function () {
  let currentDate = new Date();
  let sortButton = document.getElementById("sort_button");
  const list = document.querySelector("#todo_list");
  let tasks = JSON.parse(localStorage.getItem("task-list")) || [];

  // REFORMAT DATE TIME
  const reformatDate = (dueDate) => {
    const date = new Date(dueDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderTodoItem = function (id, description, dueDate, isCompleted) {
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

  const renderTasks = function () {
    list.innerHTML = "";

    tasks.forEach((task) => {
      const todoItem = renderTodoItem(
        task.id,
        task.description,
        task.dueDate,
        task.isCompleted
      );
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
    localStorage.setItem("task-list", JSON.stringify(tasks));
    renderTasks();
  };

  const completeTask = (id) => {
    tasks.forEach((task) => {
      if (task.id === id) {
        task.isCompleted = !task.isCompleted;
        const todoItem = document.querySelector(
          `#todo_list li[data-id="${id}"]`
        );
        const completeButton = todoItem.querySelector(
          ".modified_button--completed"
        );
        todoItem.classList.toggle("todo_list--item");
        todoItem.classList.toggle("todo_list--item_finished");

        localStorage.setItem("task-list", JSON.stringify(tasks));
      }
    });
  };

  // FOR THE INPUT FORM
  let formIsOpen = false;
  const inputField = document.getElementById("addTask");
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
            isCompleted: false,
          });

          localStorage.setItem("task-list", JSON.stringify(tasks));

          // Re-render the updated tasks
          renderTasks();
          console.log(tasks);

          descriptionInputField.value = "";
          inputForm.remove();
          formIsOpen = false;
        } else if (descriptionInputValue === "") {
          alert("Description field missing");
        } else if (dateInputValue === "") {
          alert("Date missing");
        }
      });
    }
  });

  const deleteAllButton = document.getElementById("delete_All");
  deleteAllButton.addEventListener("click", function () {
    tasks = [];
    localStorage.setItem("task-list", JSON.stringify(tasks));
    renderTasks();
  });

  // SORT BY DATE TIME CLOSEST TO THE CURRENT DATE
  let isSorted = false;

  sortButton.addEventListener("click", function () {
    if (isSorted) {
      tasks = tasks.reverse();
      isSorted = false;
    } else {
      tasks = tasks.sort((a, b) => {
        let date1 = new Date(a.dueDate);
        let diff1 = Math.abs(date1 - currentDate);

        let date2 = new Date(b.dueDate);
        let diff2 = Math.abs(date2 - currentDate);

        return diff1 - diff2;
      });

      isSorted = true;
    }

    localStorage.setItem("task-list", JSON.stringify(tasks));
    renderTasks();
  });

  // FOR THE SEARCH BAR

  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") {
        tasks = JSON.parse(localStorage.getItem("task-list")) || [];
        renderTasks();
      }
      const searchString = e.target.value.toLowerCase();
      const filteredTasks = tasks.filter((task) => {
        return task.description.toLowerCase().includes(searchString);
      });
      tasks = filteredTasks;
      renderTasks();
    }
  });
});
