"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Check, Trash2, ListTodo, Edit3, Save, X } from "lucide-react";
import { AddTask, DeleteTask, getAllTasks, updateTask } from "@/app/action";
import { get } from "http";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function CreativeQualityCard() {
  // const metrics = [
  //   { label: "Visuals", value: "10%", color: "#EAB308", angle: 90 }, // Yellow
  //   { label: "Sound", value: "10%", color: "#F97316", angle: 90 }, // Orange
  //   { label: "Editing", value: "10%", color: "#84CC16", angle: 90 }, // Green
  //   { label: "Narrative", value: "10%", color: "#8B5A2B", angle: 90 }, // Brown
  // ]

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingCompleted, setEditingCompleted] = useState(false);

  // Calculate cumulative angles for positioning
  // let cumulativeAngle = 0
  // const segmentData = metrics.map((metric, index) => {
  //   const startAngle = cumulativeAngle
  //   cumulativeAngle += metric.angle
  //   return {
  //     ...metric,
  //     startAngle,
  //     endAngle: cumulativeAngle,
  //   }
  // })

  // Function to create SVG path for arc segment
  // const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
  //   const start = polarToCartesian(centerX, centerY, radius, endAngle)
  //   const end = polarToCartesian(centerX, centerY, radius, startAngle)
  //   const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  //   return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ")
  // }

  // const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  //   const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  //   return {
  //     x: centerX + radius * Math.cos(angleInRadians),
  //     y: centerY + radius * Math.sin(angleInRadians),
  //   }
  // }

  const fetchTasks = async () => {
    setIsLoading(true);
    const res = await getAllTasks();

    setTasks(res?.data);
    setIsLoading(false);
  };

  // Simulate fetching tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle.trim(),
      completed: false,
    };

    try {
      await AddTask(newTask.title, newTask.completed);
    } catch (error) {
      console.error("Error adding task:", error);
      return;
    }
    // Simulate API call
    // setTasks((prev) => [newTask, ...prev]);
    fetchTasks();
    setNewTaskTitle("");
  };

  const toggleTask = async (id: number) => {
    try {
      const getTaskStatus = tasks.find((task) => task.id === id);
      if (!getTaskStatus) throw new Error("Task not found");
      await updateTask(
        id,
        getTaskStatus?.title,
        getTaskStatus?.completed ? false : true
      );
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
      return;
    }
    // Simulate API call
    // setTasks((prev) =>
    //   prev.map((task) =>
    //     task.id === id ? { ...task, completed: !task.completed } : task
    //   )
    // );
  };

  const deleteTask = async (id: number) => {
    try {
      await DeleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      return;
    }
    // Simulate API call
    // setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingCompleted(task.completed);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingCompleted(false);
  };

  const saveTask = async (id: number) => {
    if (!editingTitle.trim()) return;

    try {
      const getTaskStatus = tasks.find((task) => task.id === id);
      await updateTask(
        id,
        editingTitle.trim(),
        getTaskStatus?.completed ? false : true
      );
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
      return;
    }

    // Simulate API call
    // setTasks((prev) =>
    //   prev.map((task) =>
    //     task.id === id
    //       ? {
    //           ...task,
    //           title: editingTitle.trim(),
    //           completed: editingCompleted,
    //         }
    //       : task
    //   )
    // );

    // Reset editing state
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingCompleted(false);
  };

  const completedCount =
    tasks?.length > 0 ? tasks.filter((task) => task.completed).length : 0;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ListTodo className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          </div>
          <p className="text-gray-600">Stay organized and get things done</p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {totalCount || 0}
              </div>
              <div className="text-sm text-gray-500">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedCount || 0}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(totalCount - completedCount )|| 0}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={addTask} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter a new task..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 placeholder:text-gray-500 text-black focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
              <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tasks yet</p>
              <p className="text-gray-400">
                Add your first task above to get started!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tasks?.length > 0 ? (
                tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                      task.completed ? "bg-green-50" : ""
                    } ${editingTaskId === task.id ? "bg-blue-50" : ""}`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    {editingTaskId === task.id ? (
                      // Edit Mode
                      <>
                        {/* Complete Checkbox in Edit Mode */}
                        <button
                          onClick={() => setEditingCompleted(!editingCompleted)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            editingCompleted
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-green-500"
                          }`}
                        >
                          {editingCompleted && <Check className="w-4 h-4" />}
                        </button>

                        {/* Edit Input */}
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 text-black focus:ring-indigo-500 focus:border-transparent outline-none"
                            autoFocus
                          />
                        </div>

                        {/* Save and Cancel Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveTask(task.id)}
                            className="flex-shrink-0 p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                            title="Save changes"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                            title="Cancel editing"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      // View Mode
                      <>
                        {/* Complete Button */}
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-green-500"
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4" />}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-medium transition-all ${
                              task.completed
                                ? "text-gray-500 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {task.title}
                          </h3>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => startEditing(task)}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit task"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete task"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className=" text-black text-lg text-center font-bold">
                  No Tasks found
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built by Souradeep Hazra</p>
        </div>
      </div>
    </div>
  );
}
