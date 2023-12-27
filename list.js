document.addEventListener("DOMContentLoaded", async function () {
  let sortButton = document.getElementById("sort_button");
  const list = document.querySelector("#todo_list");

  // REFORMAT DATE TIME
  const reformatDate = (dueDate) => {
    const date = new Date(dueDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  let tasks = [];
  let originalTasks = [];

  const getTasks = async () => {
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

  try {
    originalTasks = await getTasks();
    tasks = [...originalTasks];
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
  }

  const renderTasks = async () => {
    try {
      const list = document.querySelector("#todo_list");
      list.innerHTML = "";

      tasks
        .slice()
        .reverse()
        .forEach((task) => {
          const { id, description, dueDate, isCompleted } = task;
          const todoItem = renderTodoItem(
            id,
            description,
            dueDate,
            isCompleted
          );
          list.insertBefore(todoItem, list.firstChild);

          const deleteButton = todoItem.querySelector(
            ".modified_button--delete"
          );
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
    } catch (error) {
      console.error("Error rendering tasks:", error.message);
    }
  };

  renderTasks();

  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `https://658a8a68ba789a9622374750.mockapi.io/tasks/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log(data);
      tasks = tasks.filter((task) => task.id !== id);
      renderTasks();
    } catch (err) {
      console.log("Error occured while deleting the task" + err.message);
    }
  };

  const completeTask = async (id) => {
    try {
      const selectedTask = await fetch(
        `https://658a8a68ba789a9622374750.mockapi.io/tasks/${id}`
      );
      if (!selectedTask.ok) {
        throw new Error("Cannot fetch the task");
      }
      const task = await selectedTask.json();
      const isCompleted = task.isCompleted;

      const response = await fetch(
        `https://658a8a68ba789a9622374750.mockapi.io/tasks/${id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ isCompleted: !isCompleted }),
        }
      );
      if (response.ok) {
        const updatedTask = await response.json();
        console.log(updatedTask);
        tasks = tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        renderTasks();
      }
    } catch (err) {
      console.log("Error occured while updating the task" + err.message);
    }
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
          const newTask = {
            description: descriptionInputValue,
            dueDate: dateInputValue,
            isCompleted: false,
          };
          addTask(newTask);

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

  const addTask = async (task) => {
    try {
      const response = await fetch(
        "https://658a8a68ba789a9622374750.mockapi.io/tasks",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(task),
        }
      );
      const data = await response.json();
      console.log(data);
      tasks.push(data);
      renderTasks();
    } catch (err) {
      console.log("Error occured:" + err.message);
    }
  };

  const deleteAllButton = document.getElementById("delete_All");
  deleteAllButton.addEventListener("click", function () {
    tasks = [];
    renderTasks();
  });

  // SORT BY DATE TIME

  let isSorted = false;
  sortButton.addEventListener("click", async function () {
    if (!isSorted) {
      tasks = sortFunction([...tasks]); // create a copy of tasks before sorting
      renderTasks();
      isSorted = true;
    } else {
      tasks = [...originalTasks];
      renderTasks();
      isSorted = false;
    }
  });

  // Adjusted sort function using localeCompare

  const sortFunction = (tasks) => {
    return tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  };

  // FOR THE SEARCH BAR

  const searchBar = document.getElementById("search-Bar");
  searchBar.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const searchString = e.target.value.toLowerCase();
      tasks =
        searchString === "" ? [...originalTasks] : searchFunction(searchString);
      renderTasks();
    }
  });

  const searchFunction = (searchString) => {
    return originalTasks.filter((task) =>
      task.description.toLowerCase().includes(searchString)
    );
  };
});
