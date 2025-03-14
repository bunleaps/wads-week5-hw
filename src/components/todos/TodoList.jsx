import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import EditModal from "./EditModal";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/auth");
      return;
    }

    const q = query(
      collection(db, "todos"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, [navigate]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    try {
      await addDoc(collection(db, "todos"), {
        text: input,
        completed: false,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      setInput("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await updateDoc(doc(db, "todos", todo.id), {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editText.trim() || !editTodo) return;

    try {
      await updateDoc(doc(db, "todos", editTodo.id), {
        text: editText,
      });
      setEditTodo(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const openEditModal = useCallback((todo) => {
    setEditTodo(todo);
    setEditText(todo.text); // This ensures the initial value is set
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Todos</h2>
        <TodoForm input={input} onInputChange={setInput} onSubmit={addTodo} />
        <ul className="mt-6 space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleComplete}
              onEdit={openEditModal}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      </div>
      {editTodo && (
        <EditModal
          todo={editTodo}
          editText={editText}
          onEditChange={setEditText}
          onSave={handleEdit}
          onCancel={() => setEditTodo(null)}
        />
      )}
    </div>
  );
}

export default TodoList;
