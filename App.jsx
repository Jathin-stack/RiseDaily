import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  Flame,
  Filter,
  X,
  Sun,
  Moon,
  AlertCircle,
  Tag,
  ArrowUpDown,
  BookOpen,
  LayoutGrid,
  List,
  Info,
  Zap,
  Award,
  RefreshCw,
  Eye,
  StickyNote
} from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  { text: "Small improvements every day lead to remarkable results.", author: "James Clear" },
  { text: "Discipline beats motivation.", author: "Jocko Willink" },
  { text: "Your future is built by what you do today.", author: "Robert Kiyosaki" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Fall seven times and stand up eight.", author: "Japanese Proverb" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Energy flows where attention goes.", author: "Tony Robbins" },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Simplicity is the prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" },
  { text: "The harder I work, the luckier I get.", author: "Samuel Goldwyn" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Motivation gets you going, but habit keeps you growing.", author: "John C. Maxwell" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
  { text: "Courage is resistance to fear, mastery of fear - not absence of fear.", author: "Mark Twain" },
  { text: "Focus on the process, not the outcome.", author: "Marcus Aurelius" },
  { text: "The successful warrior is the average man, laser-focused.", author: "Bruce Lee" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "What we fear doing most is usually what we most need to do.", author: "Tim Ferriss" },
  { text: "Be so good they can't ignore you.", author: "Steve Martin" },
  { text: "Continuous improvement is better than delayed perfection.", author: "Mark Twain" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Patience, persistence and perspiration make an unbeatable combination for success.", author: "Napoleon Hill" },
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { text: "Small daily deeds done consistently compound into massive destiny.", author: "Robin Sharma" }
];

const getNextUniqueQuoteIndex = (currentIndex = -1) => {
  try {
    const savedSeen = localStorage.getItem('risedaily_seen_quotes');
    let seenIndices = savedSeen ? JSON.parse(savedSeen) : [];

    let availableIndices = MOTIVATIONAL_QUOTES.map((_, idx) => idx).filter(
      idx => !seenIndices.includes(idx) && idx !== currentIndex
    );

    if (availableIndices.length === 0) {
      seenIndices = currentIndex >= 0 ? [currentIndex] : [];
      availableIndices = MOTIVATIONAL_QUOTES.map((_, idx) => idx).filter(
        idx => idx !== currentIndex
      );
    }

    const selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    seenIndices.push(selectedIndex);
    localStorage.setItem('risedaily_seen_quotes', JSON.stringify(seenIndices));

    return selectedIndex;
  } catch (e) {
    console.error("Failed to process unique quote index", e);
    return Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  }
};

const isOverdue = (dateStr, isCompleted) => {
  if (!dateStr || isCompleted) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const isToday = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return due.getTime() === today.getTime();
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'No due date';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const getPriorityStyle = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-rose-500/20 text-rose-500 border-rose-500/30 font-bold';
    case 'medium':
      return 'bg-amber-500/20 text-amber-500 border-amber-500/30 font-bold';
    case 'low':
      return 'bg-sky-500/20 text-sky-500 border-sky-500/30 font-bold';
    default:
      return 'bg-slate-500/20 text-slate-500 border-slate-500/30 font-bold';
  }
};

const getCategoryStyle = (category) => {
  switch (category?.toLowerCase()) {
    case 'work':
      return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 font-bold';
    case 'personal':
      return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 font-bold';
    case 'study':
      return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold';
    case 'health':
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold';
    default:
      return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30 font-bold';
  }
};

const triggerConfetti = () => {
  try {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#0284c7', '#06b6d4', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 300,
        y: canvas.height / 3 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 10 - 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.rotation += p.vRot;
        p.opacity -= 0.015;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    };

    render();
  } catch (e) {
    console.error("Confetti rendering error", e);
  }
};

const DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Review Daily Goals & Micro-habits',
    description: 'Set priority action items for today and organize workspace.',
    priority: 'High',
    category: 'Personal',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedTime: '15 mins',
    notes: 'Focus on 80/20 rule for high-impact activities.',
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: '2',
    title: 'Complete Project Architecture & Code Design',
    description: 'Refactor components, add responsive layouts, and test UI states.',
    priority: 'High',
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedTime: '2 hours',
    notes: 'Ensure clean theme toggles and instant keyboard shortcut responsiveness.',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: '3',
    title: 'Read 20 pages of Productivity & Deep Work',
    description: 'Focus on building atomic habits and minimizing digital distractions.',
    priority: 'Medium',
    category: 'Study',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimatedTime: '30 mins',
    notes: 'Take brief summary notes in journal.',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: '4',
    title: '30-Minute Cardio & Hydration Tracking',
    description: 'Evening jog and drink at least 3 liters of water throughout the day.',
    priority: 'Medium',
    category: 'Health',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedTime: '45 mins',
    notes: 'Track heart rate and stretch after run.',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('risedaily_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch (e) {
      console.error("Failed to load tasks from Local Storage", e);
      return DEFAULT_TASKS;
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('risedaily_theme') || 'dark';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewLayout, setViewLayout] = useState('grid');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [taskToView, setTaskToView] = useState(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const [quoteIndex, setQuoteIndex] = useState(() => getNextUniqueQuoteIndex());
  const [currentTime, setCurrentTime] = useState(new Date());

  const searchInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('risedaily_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to persist tasks to Local Storage", e);
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('risedaily_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isInputActive = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable
      );

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }

      if (!isInputActive && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setEditingTask(null);
        setIsModalOpen(true);
      }

      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setDeletingTaskId(null);
        setTaskToView(null);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleToggleComplete = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          triggerConfetti();
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleConfirmDelete = () => {
    if (deletingTaskId) {
      setTasks(prev => prev.filter(t => t.id !== deletingTaskId));
      setDeletingTaskId(null);
    }
  };

  const getRandomQuote = () => {
    setQuoteIndex(prevIdx => getNextUniqueQuoteIndex(prevIdx));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || task.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesPriority = selectedPriority === 'All' || task.priority.toLowerCase() === selectedPriority.toLowerCase();
      const matchesStatus = selectedStatus === 'All' ||
        (selectedStatus === 'Pending' && !task.completed) ||
        (selectedStatus === 'Completed' && task.completed);

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const order = { high: 1, medium: 2, low: 3 };
        return (order[a.priority.toLowerCase()] || 4) - (order[b.priority.toLowerCase()] || 4);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  }, [tasks, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy]);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0];
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-black'}`}>
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-sky-600' : 'bg-sky-300'}`}></div>
        <div className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
        <div className={`absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-15 ${isDark ? 'bg-cyan-600' : 'bg-cyan-300'}`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-screen">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/25 text-white font-bold transform hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-6 h-6 animate-pulse text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  RiseDaily
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 font-semibold">
                  v2.0
                </span>
              </div>
              <p className={`text-xs sm:text-sm font-semibold tracking-wide ${isDark ? 'text-slate-400' : 'text-black'}`}>
                Improve Every Single Day
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            {/* Live Clock Display */}
            <div className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-black shadow-xs'
            }`}>
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>•</span>
              <span className="font-mono text-sky-500 font-bold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/10' 
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 shadow-sm'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Shortcuts Modal Toggle */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-sky-400 hover:text-sky-300 hover:bg-slate-800 hover:border-sky-500/40' 
                  : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300 shadow-sm'
              }`}
              title="Keyboard Shortcuts"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Add Task Button */}
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold active:scale-95 transition-all duration-200 ${
                isDark
                  ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 hover:from-sky-300 hover:via-cyan-300 hover:to-blue-300 text-slate-950 shadow-lg shadow-sky-500/25'
                  : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 hover:from-sky-600 hover:via-cyan-600 hover:to-blue-600 text-white shadow-md shadow-sky-500/25'
              }`}
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add Task</span>
              <kbd className={`hidden sm:inline-block ml-1 text-[10px] px-1.5 py-0.5 rounded font-mono font-extrabold ${
                isDark ? 'bg-slate-950/20 text-slate-950' : 'bg-white/25 text-white'
              }`}>N</kbd>
            </button>
          </div>
        </header>

        {/* Motivational Banner */}
        <div className="my-6">
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
            isDark ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 shrink-0 mt-0.5">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-sky-500 mb-0.5">Daily Motivation</p>
                <p className={`text-sm sm:text-base font-bold italic ${isDark ? 'text-slate-100' : 'text-black'}`}>
                  "{currentQuote.text}"
                </p>
                <p className="text-xs text-sky-500 font-bold mt-1">— {currentQuote.author}</p>
              </div>
            </div>

            <button
              onClick={getRandomQuote}
              className={`self-end sm:self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                isDark 
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/50 hover:text-sky-200' 
                  : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300 shadow-xs'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Quote</span>
            </button>
          </div>
        </div>

        {/* Dashboard Analytics Section */}
        <section className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className={`p-4 rounded-2xl border transition-all duration-200 ${
            isDark ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-black'}`}>Total Tasks</span>
              <BookOpen className="w-4 h-4 text-sky-500" />
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-black'}`}>{totalTasks}</div>
            <div className={`text-[11px] font-medium mt-1 ${isDark ? 'text-slate-500' : 'text-black'}`}>All created items</div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-200 ${
            isDark ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-black'}`}>Pending Tasks</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">{pendingTasks}</div>
            <div className={`text-[11px] font-medium mt-1 ${isDark ? 'text-slate-500' : 'text-black'}`}>Action needed</div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-200 ${
            isDark ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-black'}`}>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">{completedTasks}</div>
            <div className={`text-[11px] font-medium mt-1 ${isDark ? 'text-slate-500' : 'text-black'}`}>Accomplished</div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-200 ${
            isDark ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-400' : 'text-black'}`}>Daily Progress</span>
              <Award className="w-4 h-4 text-sky-500" />
            </div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-500">{completionPercentage}%</span>
              <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-black'}`}>
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className={`p-4 rounded-2xl border mb-6 backdrop-blur-md ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <div className="relative w-full md:w-80">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-black'}`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tasks... (Ctrl + F)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-8 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-black placeholder-slate-500 font-medium'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
              
              <div className="flex items-center gap-1.5">
                <Tag className={`w-3.5 h-3.5 hidden sm:inline ${isDark ? 'text-slate-400' : 'text-black'}`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-black'
                  }`}
                >
                  <option value="All">All Categories</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className={`w-3.5 h-3.5 hidden sm:inline ${isDark ? 'text-slate-400' : 'text-black'}`} />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-black'
                  }`}
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                {['All', 'Pending', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedStatus === status
                        ? isDark
                          ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 text-slate-950 shadow-sm shadow-sky-500/20'
                          : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 text-white shadow-sm shadow-sky-500/20'
                        : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-black hover:text-sky-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className={`w-3.5 h-3.5 hidden sm:inline ${isDark ? 'text-slate-400' : 'text-black'}`} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-black'
                  }`}
                >
                  <option value="dueDate">Sort: Due Date</option>
                  <option value="priority">Sort: Priority</option>
                  <option value="title">Sort: Title</option>
                  <option value="created">Sort: Recently Added</option>
                </select>
              </div>

              <div className={`hidden sm:flex p-1 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-1 rounded-lg ${viewLayout === 'grid' ? (isDark ? 'bg-slate-800 text-sky-400' : 'bg-sky-500 text-white shadow-xs') : 'text-black hover:text-sky-600'}`}
                  title="Grid Layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-1 rounded-lg ${viewLayout === 'list' ? (isDark ? 'bg-slate-800 text-sky-400' : 'bg-sky-500 text-white shadow-xs') : 'text-black hover:text-sky-600'}`}
                  title="List Layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Task Cards Container */}
        <main className="flex-1">
          {filteredTasks.length === 0 ? (
            <div className={`text-center py-16 px-4 rounded-3xl border ${
              isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-black'}`}>No tasks found</h3>
              <p className={`text-sm font-medium max-w-md mx-auto mb-6 ${isDark ? 'text-slate-400' : 'text-black'}`}>
                {searchQuery || selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All'
                  ? "No tasks match your active search and filter parameters."
                  : "You're all caught up! Create a new task to boost your productivity for today."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedPriority('All');
                  setSelectedStatus('All');
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  isDark
                    ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 hover:from-sky-300 hover:via-cyan-300 hover:to-blue-300 text-slate-950 shadow-lg shadow-sky-500/25'
                    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 hover:from-sky-600 hover:via-cyan-600 hover:to-blue-600 text-white shadow-md shadow-sky-500/25'
                }`}
              >
                + Create New Task
              </button>
            </div>
          ) : (
            <div className={
              viewLayout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
                : 'flex flex-col gap-3'
            }>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isDark={isDark}
                  onToggleComplete={() => handleToggleComplete(task.id)}
                  onEdit={() => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                  onDelete={() => setDeletingTaskId(task.id)}
                  onViewDetails={() => setTaskToView(task)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-500">RiseDaily</span>
            <span className={isDark ? 'text-slate-500' : 'text-black'}>–</span>
            <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-black'}`}>Improve Every Single Day</span>
          </div>
          <div className={`italic font-medium ${isDark ? 'text-slate-400' : 'text-black'}`}>
            "Consistency creates success."
          </div>
        </footer>

      </div>

      {/* Modals */}
      {isModalOpen && (
        <TaskFormModal
          isDark={isDark}
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}

      {deletingTaskId && (
        <DeleteConfirmModal
          isDark={isDark}
          taskTitle={tasks.find(t => t.id === deletingTaskId)?.title}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {taskToView && (
        <TaskDetailsModal
          isDark={isDark}
          task={taskToView}
          onClose={() => setTaskToView(null)}
          onEdit={() => {
            setEditingTask(taskToView);
            setTaskToView(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {isShortcutsOpen && (
        <ShortcutsModal
          isDark={isDark}
          onClose={() => setIsShortcutsOpen(false)}
        />
      )}

    </div>
  );
}

function TaskCard({ task, isDark, onToggleComplete, onEdit, onDelete, onViewDetails }) {
  const overdue = isOverdue(task.dueDate, task.completed);
  const dueToday = isToday(task.dueDate) && !task.completed;

  return (
    <div
      className={`group rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl ${
        task.completed
          ? isDark ? 'bg-slate-900/30 border-slate-800/60 opacity-75' : 'bg-slate-100/80 border-slate-200 opacity-80'
          : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              onClick={onToggleComplete}
              className={`p-1 rounded-full transition-transform active:scale-90 ${
                task.completed ? 'text-emerald-500 hover:text-emerald-400' : 'text-slate-400 hover:text-sky-500'
              }`}
              title={task.completed ? "Mark as pending" : "Mark as completed"}
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>

            <h3
              onClick={onViewDetails}
              className={`font-bold text-base sm:text-lg leading-snug cursor-pointer hover:text-sky-500 transition-colors line-clamp-2 ${
                task.completed ? 'line-through text-slate-400' : isDark ? 'text-slate-100' : 'text-black'
              }`}
            >
              {task.title}
            </h3>
          </div>
        </div>

        {task.description && (
          <p className={`text-xs sm:text-sm mb-4 line-clamp-2 font-medium ${isDark ? 'text-slate-400' : 'text-black'}`}>
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(task.priority)}`}>
            {task.priority} Priority
          </span>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryStyle(task.category)}`}>
            {task.category}
          </span>

          {task.estimatedTime && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-black'
            }`}>
              <Clock className="w-3 h-3 text-sky-500" />
              {task.estimatedTime}
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-black'}`} />
          <span className={`font-bold ${
            overdue
              ? 'text-rose-500 font-bold'
              : dueToday
              ? 'text-amber-500 font-bold'
              : isDark ? 'text-slate-400' : 'text-black'
          }`}>
            {overdue && '⚠️ Overdue: '}
            {dueToday && '🔥 Today: '}
            {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onViewDetails}
            className={`p-1.5 rounded-lg border transition-all ${
              isDark 
                ? 'bg-slate-800/60 hover:bg-sky-500/20 border-slate-700/80 hover:border-sky-500/40 text-slate-300 hover:text-sky-300' 
                : 'bg-sky-50 hover:bg-sky-100 border-sky-200 hover:border-sky-300 text-sky-700 shadow-xs'
            }`}
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onEdit}
            className={`p-1.5 rounded-lg border transition-all ${
              isDark 
                ? 'bg-slate-800/60 hover:bg-amber-500/20 border-slate-700/80 hover:border-amber-500/40 text-slate-300 hover:text-amber-300' 
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-300 text-amber-700 shadow-xs'
            }`}
            title="Edit Task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDelete}
            className={`p-1.5 rounded-lg border transition-all ${
              isDark
                ? 'bg-rose-500/10 hover:bg-rose-500/25 border-rose-500/30 text-rose-400 hover:text-rose-300'
                : 'bg-rose-50 hover:bg-rose-100 border-rose-200 hover:border-rose-300 text-rose-700 shadow-xs'
            }`}
            title="Delete Permanently"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskFormModal({ isDark, task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    category: task?.category || 'Work',
    dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
    estimatedTime: task?.estimatedTime || '',
    notes: task?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Task title is required.' });
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-black'
      }`}>
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              {task ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-black'}`}>
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-black hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Complete daily workout & stretch"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({});
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-black'
              }`}
              autoFocus
            />
            {errors.title && <p className="text-xs text-rose-500 font-bold mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Description</label>
            <textarea
              rows={2}
              placeholder="Brief details or key action points..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-black'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-black'
                }`}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-black'
                }`}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-black'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Est. Time Required</label>
              <input
                type="text"
                placeholder="e.g. 45 mins / 2 hrs"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-black'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Optional Notes / Checklist</label>
            <textarea
              rows={2}
              placeholder="Any additional references, links, or micro-steps..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-black'
              }`}
            />
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' 
                  : 'bg-slate-100 border-slate-300 text-black hover:bg-slate-200 shadow-xs'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 hover:from-sky-300 hover:via-cyan-300 hover:to-blue-300 text-slate-950 shadow-lg shadow-sky-500/20'
                  : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 hover:from-sky-600 hover:via-cyan-600 hover:to-blue-600 text-white shadow-md shadow-sky-500/25'
              }`}
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ isDark, taskTitle, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 relative ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-black'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-black'}`}>Delete Task Permanently?</h3>
        <p className={`text-xs sm:text-sm mb-4 font-medium ${isDark ? 'text-slate-400' : 'text-black'}`}>
          Are you sure you want to delete <span className="font-bold text-rose-500">"{taskTitle}"</span>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-black hover:bg-slate-200 shadow-xs'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/25 active:scale-95 transition-all"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskDetailsModal({ isDark, task, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-black'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(task.priority)}`}>
              {task.priority} Priority
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getCategoryStyle(task.category)}`}>
              {task.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-black hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className={`text-xl font-extrabold mb-3 ${isDark ? 'text-slate-100' : 'text-black'}`}>{task.title}</h2>

        {task.description && (
          <div className="mb-4">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Description</h4>
            <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-black'}`}>
              {task.description}
            </p>
          </div>
        )}

        {task.notes && (
          <div className={`p-3.5 rounded-2xl border mb-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-500 mb-1">
              <StickyNote className="w-3.5 h-3.5" />
              <span>Notes & References</span>
            </div>
            <p className={`text-xs whitespace-pre-wrap font-medium ${isDark ? 'text-slate-300' : 'text-black'}`}>
              {task.notes}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs mb-6">
          <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`block mb-0.5 font-bold ${isDark ? 'text-slate-400' : 'text-black'}`}>Due Date</span>
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>{formatDate(task.dueDate)}</span>
          </div>
          <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`block mb-0.5 font-bold ${isDark ? 'text-slate-400' : 'text-black'}`}>Est. Time</span>
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>{task.estimatedTime || 'Not specified'}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/60">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-black hover:bg-slate-200 shadow-xs'
            }`}
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className={`px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-md shadow-sky-500/25'
            }`}
          >
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
}

function ShortcutsModal({ isDark, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-sm rounded-3xl border shadow-2xl p-6 relative ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-black'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-500" />
            <h3 className={`font-bold text-lg ${isDark ? 'text-slate-100' : 'text-black'}`}>Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className={`p-1 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-black hover:text-sky-600'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs mb-6">
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800/50 bg-slate-950/40">
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>Add New Task</span>
            <kbd className="px-2 py-1 rounded bg-sky-500/20 text-sky-500 font-mono font-bold">N</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800/50 bg-slate-950/40">
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>Search Tasks</span>
            <kbd className="px-2 py-1 rounded bg-sky-500/20 text-sky-500 font-mono font-bold">Ctrl + F</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800/50 bg-slate-950/40">
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>Close Modal / Popup</span>
            <kbd className="px-2 py-1 rounded bg-sky-500/20 text-sky-500 font-mono font-bold">Esc</kbd>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all ${
            isDark
              ? 'bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-md shadow-sky-500/25'
          }`}
        >
          Got it
        </button>
      </div>
    </div>
  );
}