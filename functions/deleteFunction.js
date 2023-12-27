const deleteFunction = async (id) => {
  try {
    const response = await fetch(
      `https://658a8a68ba789a9622374750.mockapi.io/tasks/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log(data);
    renderTasks();
  } catch (err) {
    console.log("Error occured while deleting the task" + err.message);
  }
};
