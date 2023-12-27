let descriptionInputField = inputForm.querySelector("#descriptionInput");
let dateInputField = inputForm.querySelector("#dateInput");

const addTask = async () => {
  try {
    if (descriptionInputField.value !== "" && dateInputField.value !== "") {
      const response = await fetch(
        "https://658a8a68ba789a9622374750.mockapi.io/tasks",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            description,
            dueDate,
            isCompleted: false,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      renderTasks();

      descriptionInputField.value = "";
      inputForm.remove();
      formIsOpen = false;
    } else if (descriptionInputField.value === "") {
      alert("Description field missing");
    } else if (dateInputField.value === "") {
      alert("Date missing");
    }
  } catch (err) {
    console.log("Error occured:" + err.message);
  }
};
