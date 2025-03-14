import React from "react";

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  return (
    <li className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span
        className={`flex-1 text-gray-700 ${
          todo.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onEdit(todo)}
        className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-3 py-1.5 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
