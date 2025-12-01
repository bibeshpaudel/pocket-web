import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckSquare, Plus, Trash2, Check, X, Sparkles, Trophy, 
  Flag, MoreVertical, Search, Filter, 
  ArrowUpDown, Download, Upload, AlertCircle, Clock,
  Briefcase, Edit2, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants & Helpers ---

const PRIORITIES = {
  high: { label: 'High', color: 'text-red-500', border: 'border-l-red-500', bg: 'bg-red-500/10' },
  medium: { label: 'Medium', color: 'text-yellow-500', border: 'border-l-yellow-500', bg: 'bg-yellow-500/10' },
  low: { label: 'Low', color: 'text-green-500', border: 'border-l-green-500', bg: 'bg-green-500/10' }
};

// --- Components ---

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-muted/30 p-3 rounded-xl border border-border flex items-center gap-3 flex-1 min-w-[80px]">
    <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
      <Icon size={16} className={color.replace('bg-', 'text-').replace('/10', '')} />
    </div>
    <div>
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{label}</p>
      <p className="text-lg font-bold leading-none">{value}</p>
    </div>
  </div>
);

const EditModal = ({ task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleChange = (field, value) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <h3 className="font-bold text-lg">Edit Task</h3>
          <button onClick={onClose}><X size={20} className="text-muted-foreground hover:text-foreground" /></button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Task</label>
            <input 
              value={editedTask.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
            <select 
              value={editedTask.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full p-2 bg-muted/50 border border-border rounded-lg outline-none"
            >
              {Object.keys(PRIORITIES).map(p => (
                <option key={p} value={p}>{PRIORITIES[p].label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
            <textarea 
              value={editedTask.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full p-2 bg-muted/50 border border-border rounded-lg outline-none h-24 resize-none"
              placeholder="Add details..."
            />
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">Cancel</button>
          <button onClick={() => onSave(editedTask)} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Save Changes</button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

// --- Main Widget ---

export default function ToDoWidget() {
  // State
  const [todos, setTodos] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pocket-todos-v2');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('active'); // active, completed, all
  const [sort, setSort] = useState('created'); // created, priority, alpha
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [buttonRect, setButtonRect] = useState(null);
  
  // Input State
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('pocket-todos-v2', JSON.stringify(todos));
  }, [todos]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') setIsOpen(false);
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Update button rect when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [isOpen]);

  // Actions
  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date().toISOString(),
      notes: ''
    };

    setTodos([newTodo, ...todos]);
    setNewTaskText('');
  };

  const updateTask = (updatedTask) => {
    setTodos(todos.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t
    ));
  };

  const deleteTask = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    if (window.confirm('Are you sure you want to clear all completed tasks?')) {
      setTodos(todos.filter(t => !t.completed));
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todos));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `pocket-tasks-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setTodos([...todos, ...imported]); // Merge
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Derived State
  const filteredTodos = useMemo(() => {
    let result = todos;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.text.toLowerCase().includes(q));
    }

    // Main Filter
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    // Sort
    return result.sort((a, b) => {
      if (sort === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'priority') {
        const pMap = { high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      if (sort === 'alpha') return a.text.localeCompare(b.text);
      return 0;
    });
  }, [todos, filter, sort, search]);

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    percent: todos.length === 0 ? 0 : Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
  };

  return (
    <>
      {/* Trigger */}
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground group"
        title="Tasks"
      >
        <div className="relative">
          <CheckSquare size={20} />
          {stats.pending > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
              {stats.pending}
            </span>
          )}
        </div>
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none opacity-20" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${stats.percent}, 100`}
            className="text-primary transition-all duration-500 ease-out"
          />
        </svg>
      </button>

      {/* Modal/Popup - Portalled to body */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{
                  position: 'fixed',
                  top: buttonRect ? buttonRect.bottom + 8 : '60px',
                  right: buttonRect ? window.innerWidth - buttonRect.right : '20px',
                  maxHeight: '85vh'
                }}
                className="w-[95vw] sm:w-[500px] bg-card border border-border rounded-xl shadow-xl overflow-hidden z-[60] flex flex-col"
              >
                {/* Header Stats */}
                <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-3 pt-6 sm:pt-4">
                  <div className="grid grid-cols-3 gap-3 flex-grow">
                    <StatCard label="Total" value={stats.total} icon={Briefcase} color="bg-blue-500" />
                    <StatCard label="Done" value={stats.completed} icon={Check} color="bg-green-500" />
                    <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-orange-500" />
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-2 mr-6 sm:mr-0">
                     <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path className="text-muted-foreground/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                          <path className="text-primary transition-all duration-500 ease-out" strokeDasharray={`${stats.percent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        </svg>
                        <span className="absolute text-[10px] font-bold">{stats.percent}%</span>
                     </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-3 border-b border-border space-y-3 bg-card">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={16} />
                      <input 
                        ref={inputRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks... (Ctrl+F)"
                        className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <select 
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="h-full pl-3 pr-8 bg-muted/50 border border-border rounded-lg text-sm appearance-none outline-none cursor-pointer hover:bg-muted"
                      >
                        <option value="created">Newest</option>
                        <option value="priority">Priority</option>
                        <option value="alpha">A-Z</option>
                      </select>
                      <ArrowUpDown size={14} className="absolute right-2.5 top-3 pointer-events-none text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['all', 'active', 'completed'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                          filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task List */}
                <div className="flex-grow overflow-y-auto p-2 bg-muted/10 min-h-[300px]">
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {filteredTodos.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-muted-foreground">
                          <Sparkles className="mx-auto mb-3 opacity-50" size={32} />
                          <p>No tasks found</p>
                          <p className="text-xs mt-1">Try changing filters or add a new task</p>
                        </motion.div>
                      ) : (
                        filteredTodos.map(todo => (
                            <motion.div
                              key={todo.id}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`group relative bg-card border-l-4 ${PRIORITIES[todo.priority].border} border-y border-r border-border rounded-r-lg shadow-sm hover:shadow-md transition-all p-3`}
                            >
                              <div className="flex items-start gap-3">
                                
                                <button
                                  onClick={() => toggleComplete(todo.id)}
                                  className={`flex-shrink-0 w-5 h-5 mt-1 rounded border flex items-center justify-center transition-all ${
                                    todo.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/40 hover:border-primary'
                                  }`}
                                >
                                  {todo.completed && <Check size={12} strokeWidth={3} />}
                                </button>

                                <div className="flex-grow min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-medium text-sm break-words ${todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                      {todo.text}
                                    </span>
                                    {todo.notes && <div title={todo.notes}><Briefcase size={12} className="text-muted-foreground" /></div>}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setEditingTask(todo)} className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                                    <Edit2 size={14} />
                                  </button>
                                  <button onClick={() => deleteTask(todo.id)} className="p-1.5 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Input Area */}
                <form onSubmit={addTask} className="p-3 bg-card border-t border-border">
                  <div className="flex gap-2 mb-2">
                    <input 
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Add a new task..."
                      className="flex-grow p-2 bg-muted/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!newTaskText.trim()}
                      className="px-4 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Priority Dropdown */}
                    <div className="relative group">
                       <div className={`flex items-center gap-1 px-2 py-1.5 rounded-md border border-border bg-muted/50 text-xs cursor-pointer hover:bg-muted ${PRIORITIES[newTaskPriority].color}`}>
                          <Flag size={12} />
                          {PRIORITIES[newTaskPriority].label}
                          <ChevronDown size={12} className="ml-1 opacity-50" />
                       </div>
                       <select 
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       >
                          {Object.keys(PRIORITIES).map(p => <option key={p} value={p}>{PRIORITIES[p].label}</option>)}
                       </select>
                    </div>
                  </div>
                </form>

                {/* Footer */}
                <div className="p-2 bg-muted/30 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
                  <div className="flex gap-2">
                    <button onClick={exportData} className="hover:text-foreground flex items-center gap-1"><Download size={10} /> Export</button>
                    <label className="hover:text-foreground flex items-center gap-1 cursor-pointer">
                      <Upload size={10} /> Import
                      <input type="file" accept=".json" onChange={importData} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span>{stats.pending} items left</span>
                    {stats.completed > 0 && (
                      <button onClick={clearCompleted} className="text-red-500 hover:underline">Clear Completed</button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Edit Modal */}
      {editingTask && (
        <EditModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
          onSave={updateTask} 
        />
      )}
    </>
  );
}
