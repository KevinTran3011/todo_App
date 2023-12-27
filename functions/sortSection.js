const sortFunction = async () => {
  try {
    const url = new URL(`https://658a8a68ba789a9622374750.mockapi.io/tasks`);
    url.searchParams.append("sortBy", "dueDate");
    url.searchParams.append("order", "desc");

    const response = await fetch(url, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("Error occured while sorting the task" + err.message);
  }
};
