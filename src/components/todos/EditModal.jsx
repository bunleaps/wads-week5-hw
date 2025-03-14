import React, { useEffect } from "react";

function EditModal({ todo, editText, onEditChange, onSave, onCancel }) {
  useEffect(() => {
    if (todo) {
      onEditChange(todo.text);
    }
  }, [todo, onEditChange]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Edit Todo
          </h3>
          <form onSubmit={onSave} className="space-y-4">
            <input
              type="text"
              value={editText}
              onChange={(e) => onEditChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
