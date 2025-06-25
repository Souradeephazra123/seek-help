"use server";

export async function getAllTasks() {
  try {
    const res = await fetch(`${process.env.API_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
}

export async function AddTask(title: string, completed = false) {
  try {
    const res = await fetch(`${process.env.API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, completed }),
    });

    return res.json();
  } catch (error) {
    console.error("Error adding task:", error);
    throw new Error("Failed to add task");
  }
}

export async function updateTask(
  id: number,
  title: string,
  completed: boolean = false
) {
  try {
    const res = await fetch(`${process.env.API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, completed }),
    });

    return res.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}

export async function DeleteTask(id: number) {
  try {
    const res = await fetch(`${process.env.API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.json();
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
}
