const completeTask = async (id) => {
  try {
    const response = await fetch(
      `https://658a8a68ba789a9622374750.mockapi.io/tasks/${id}`,
      {
        method: "PUT",
        header: { "content-type": "application/json" },
        body: JSON.stringify(isCompleted ? false : true),
      }
    );
    if (response.ok) {
      const data = await response.json();
      todoItem.classList.toggle("todo_list--item");
      todoItem.classList.toggle("todo_list--item_finished");
      console.log(data);
      renderTasks();
    }
  } catch (err) {
    console.log("Error occured while updating the task" + err.message);
  }
};
