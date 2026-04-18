import React, { useState, useCallback, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  BarChart as BarChartIcon,
  Copy,
  Share2,
  RefreshCw,
  ChevronRight,
  Target,
  Search,
  Clock,
  FileText,
  Trash2,
  Mail
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Components
import SplashScreen from "./components/SplashScreen";
import ToastNotification from "./components/ToastNotification";
import HelpModal from "./components/HelpModal";
import Navbar from "./components/Navbar";
import QuizSettings from "./components/QuizSettings";
import QuestionsPreview from "./components/QuestionsPreview";

// APIs
import { generateMCQs } from "./aiService";
import { createGoogleForm, getFormResponses } from "./googleFormsApi";

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashShown")
  );
  const [fadeSplash, setFadeSplash] = useState(false);

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [activeTab, setActiveTab] = useState("creator");
  const [showHelp, setShowHelp] = useState(false);

  const [syllabus, setSyllabus] = useState("");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState([]);

  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creatingForm, setCreatingForm] = useState(false);

  const [formLink, setFormLink] = useState("");
  const [formId, setFormId] = useState("");
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    if (showSplash) {
      const fadeTimer = setTimeout(() => setFadeSplash(true), 2000);
      const removeTimer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splashShown", "true");
      }, 2500);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }

    const savedHistory = localStorage.getItem("quizHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, [showSplash, isDark]);

  const toggleDark = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      showToast("Connected to Google Workspace", "success");
    },
    onError: () => showToast("Authentication failed", "error"),
    scope:
      "https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/forms.responses.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email",
    prompt: "consent",
  });

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || !syllabus.trim())
      return showToast("Topic and Syllabus are required", "error");

    setLoading(true);
    setQuestions([]);

    try {
      const result = await generateMCQs(
        topic,
        syllabus,
        Number(numQuestions),
        difficulty
      );

      if (result) {
        setQuestions(result);
        showToast("Quiz questions generated successfully!", "success");
      } else throw new Error();
    } catch {
      showToast("Failed to generate. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [topic, syllabus, numQuestions, difficulty]);

  const handleCreateForm = async () => {
    if (!accessToken)
      return showToast("Please connect your Google Account first", "error");

    setCreatingForm(true);

    try {
      const data = await createGoogleForm(topic, questions, accessToken);

      if (data?.url) {
        setFormLink(data.url);
        setFormId(data.id);
        
        // Save to History Logic restored here
        const newRecord = {
          topic,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          url: data.url,
          id: data.id,
        };
        const updatedHistory = [newRecord, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));

        showToast("Google Form created successfully!", "success");
        setActiveTab("analytics");
      } else throw new Error();
    } catch {
      showToast("Failed to create Google Form", "error");
    } finally {
      setCreatingForm(false);
    }
  };

  const fetchResults = async (idToFetch = formId) => {
    if (!idToFetch) return;
    setLoadingResults(true);
    const data = await getFormResponses(idToFetch, accessToken);
    if (data.length > 0) {
      setResults(data);
      showToast('Results updated successfully', 'success');
    } else showToast('Waiting for students to submit', 'error');
    setLoadingResults(false);
  };

  const deleteHistoryItem = idToDelete => {
    const updatedHistory = history.filter(item => item.id !== idToDelete);
    setHistory(updatedHistory);
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    showToast('Record deleted from History', 'success');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formLink);
    showToast('Form link copied to clipboard!', 'success');
  };


  const filteredHistory = history.filter(item =>
    item.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SplashScreen showSplash={showSplash} fadeSplash={fadeSplash} />
      {toast && <ToastNotification toast={toast} />}
      <HelpModal showHelp={showHelp} setShowHelp={setShowHelp} />

      <div className={`min-h-screen transition-colors ${
      isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
    }`}>
        <Navbar
          isDark={isDark}
          toggleDark={toggleDark}
          setShowHelp={setShowHelp}
          accessToken={accessToken}
          login={login}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
          
          {/* TAB 1: CREATOR */}
          {activeTab === "creator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-300 slide-in-from-bottom-4">
              <div className="lg:col-span-4">
                <QuizSettings
                  isDark={isDark}
                  topic={topic}
                  setTopic={setTopic}
                  syllabus={syllabus}
                  setSyllabus={setSyllabus}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  numQuestions={numQuestions}
                  setNumQuestions={setNumQuestions}
                  handleGenerate={handleGenerate}
                  loading={loading}
                />
              </div>

              <div className="lg:col-span-8">
                <QuestionsPreview
                  isDark={isDark}
                  loading={loading}
                  questions={questions}
                  creatingForm={creatingForm}
                  handleCreateForm={handleCreateForm}
                />
              </div>
            </div>
          )}

          {/* TAB 2: LIVE ANALYTICS (RESULTS) */}
          {activeTab === 'analytics' && (
            <div className='max-w-5xl mx-auto space-y-8'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <h2 className='text-xl font-bold flex items-center gap-3 tracking-tight'>
                  <BarChart size={22} className='text-indigo-600 dark:text-indigo-400' />
                  Results Analytics
                </h2>
                <div className='flex gap-2 w-full md:w-auto'>
                  <button
                    onClick={() => fetchResults(formId)}
                    disabled={loadingResults}
                    className='flex-1 md:flex-none px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm'>
                    <RefreshCw size={16} className={loadingResults ? 'animate-spin' : ''} />
                    Refresh Data
                  </button>
                </div>
              </div>

              {results.length > 0 ? (
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                  {/* ... existing results cards ... */}
                </div>
              ) : formLink ? (
                <div className={`p-8 rounded-2xl border text-center ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                }`}>
                  <div className='w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <Target size={32} />
                  </div>
                  <h2 className='text-2xl font-bold mb-2'>Quiz Deployed!</h2>
                  <p className='text-zinc-500 mb-8'>Your Google Form is ready. Share the link below to start gathering responses.</p>
                  
                  <div className='max-w-md mx-auto flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6'>
                    <input 
                      readOnly 
                      value={formLink} 
                      className='flex-1 bg-transparent border-none text-sm px-2 outline-none font-medium'
                    />
                    <button 
                      onClick={copyToClipboard}
                      className='px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all'
                    >
                      Copy link
                    </button>
                  </div>
                  
                  <div className='flex justify-center gap-4'>
                    <a 
                      href={formLink} 
                      target='_blank' 
                      rel='noreferrer' 
                      className='text-sm font-bold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-all'
                    >
                      <ChevronRight size={16} /> Open Form
                    </a>
                  </div>
                </div>
              ) : (
                <div className='py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl'>
                  <div className='w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                    <FileText size={32} className='opacity-20' />
                  </div>
                  <p className='text-zinc-500 font-medium'>No active quiz found. Create one to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VAULT (HISTORY) */}
          {activeTab === 'history' && (
            <div className='max-w-5xl mx-auto space-y-8'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <h2 className='text-xl font-bold flex items-center gap-3 tracking-tight'>
                  <Clock size={22} className='text-indigo-600 dark:text-indigo-400' />
                  Quiz Vault (History)
                </h2>
                <div className='relative w-full md:w-64'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' size={16} />
                  <input
                    type='text'
                    placeholder='Search past quizzes...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border outline-none transition-all ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600'
                        : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
                    }`}
                  />
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className={`py-32 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${isDark ? 'border-zinc-800 text-zinc-500 bg-zinc-900/20' : 'border-zinc-200 text-zinc-400 bg-zinc-50/50'}`}>
                  <FileText size={40} className='opacity-40 text-zinc-500' />
                  <p className='font-bold text-lg mt-4 text-zinc-700 dark:text-zinc-300 tracking-tight text-center'>
                    {history.length === 0 ? 'No history found' : 'No records match your search'}
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredHistory.map((item, idx) => (
                    <div key={item.id || idx} className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 group flex flex-col backdrop-blur-sm ${isDark ? 'bg-zinc-900/40 border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-900/20' : 'bg-white/80 border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50'}`}>
                      <div className='flex justify-between items-start mb-6'>
                        <div className='p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm'><FileText size={20} /></div>
                        <div className='flex flex-col items-end gap-2'>
                          <button onClick={() => deleteHistoryItem(item.id)} className='text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100' title='Delete from History'><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <h3 className='font-bold text-lg md:text-xl mb-3 line-clamp-2 text-slate-900 dark:text-white flex-1 tracking-tight'>{item.topic}</h3>
                      <div className="flex justify-between items-center mb-8 pt-5 border-t border-slate-100 dark:border-white/5">
                         <div className='flex items-center gap-2 text-slate-500 dark:text-zinc-400'><Clock size={14} /><span className='text-[11px] font-bold uppercase tracking-wider'>{item.date}</span></div>
                         <span className='text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500'>{item.time || 'N/A'}</span>
                      </div>
                      <div className='grid grid-cols-2 gap-3 mt-auto'>
                        <a href={item.url} target='_blank' rel='noreferrer' className='py-3 text-center text-sm font-bold bg-slate-50 border border-slate-200 dark:border-white/10 dark:bg-zinc-950 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-300 shadow-sm'>Open Form</a>
                        <button onClick={() => { setFormId(item.id); setFormLink(item.url); setActiveTab('analytics'); fetchResults(item.id); }} className='py-3 text-center text-sm font-bold bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shadow-sm'>View Results</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default App;
