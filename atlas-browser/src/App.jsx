import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, MessageSquare, X, Plus } from 'lucide-react';
import './App.css';

// Компонент AI Панелі
const AIPanel = ({ isOpen, onClose, currentUrl, pageContent }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Привіт! Я Atlas AI. Чим можу допомогти з цією сторінкою?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Тут буде виклик Gemini API
    // Для прикладу - імітація відповіді
    setTimeout(() => {
      const aiMsg = { role: 'ai', text: `Я проаналізував сторінку ${currentUrl}. Ви запитали: "${userMsg.text}". Ось що я знайшов...` };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <h3>Atlas AI</h3>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      <div className="ai-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message ai">Думаю...</div>}
      </div>
      <div className="ai-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Запитайте про сторінку..."
        />
        <button onClick={handleSend}><ArrowRight size={18} /></button>
      </div>
      <div className="ai-actions">
        <button onClick={() => setInput("Зроби підсумок сторінки")}>Summarize</button>
        <button onClick={() => setInput("Поясни простими словами")}>Explain</button>
        <button onClick={() => setInput("Переклади сторінку")}>Translate</button>
      </div>
    </div>
  );
};

// Головний компонент браузера
function App() {
  const [tabs, setTabs] = useState([{ id: 1, title: 'New Tab', url: 'https://google.com' }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState('https://google.com');
  const [isAiOpen, setIsAiOpen] = useState(true);
  const webviewRef = useRef(null);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleNavigate = () => {
    let url = urlInput;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    // Оновлюємо URL активної вкладки
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, url } : t));
  };

  const handleNewTab = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    setTabs([...tabs, { id: newId, title: 'New Tab', url: 'https://google.com' }]);
    setActiveTabId(newId);
    setUrlInput('https://google.com');
  };

  const closeTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
      setUrlInput(newTabs[newTabs.length - 1].url);
    }
  };

  return (
    <div className="browser-container">
      {/* Верхня панель: Вкладки */}
      <div className="tabs-bar">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => { setActiveTabId(tab.id); setUrlInput(tab.url); }}
          >
            <span className="tab-title">{tab.title}</span>
            <button className="tab-close" onClick={(e) => closeTab(tab.id, e)}><X size={12} /></button>
          </div>
        ))}
        <button className="new-tab-btn" onClick={handleNewTab}><Plus size={16} /></button>
      </div>

      {/* Адресний рядок */}
      <div className="address-bar">
        <button className="nav-btn"><ArrowLeft size={18} /></button>
        <button className="nav-btn"><ArrowRight size={18} /></button>
        <button className="nav-btn"><RotateCw size={18} /></button>

        <div className="url-input-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
            className="url-input"
          />
        </div>

        <button
          className={`ai-toggle-btn ${isAiOpen ? 'active' : ''}`}
          onClick={() => setIsAiOpen(!isAiOpen)}
        >
          <MessageSquare size={18} />
          <span>Atlas AI</span>
        </button>
      </div>

      {/* Основна область: Webview + AI Panel */}
      <div className="main-content">
        <div className="webview-container" style={{ width: isAiOpen ? '70%' : '100%' }}>
          {/* У Electron ми використовуємо <webview>, але для React-розробки поки що iframe */}
          {/* В реальному Electron додатку тут має бути <webview src={activeTab.url} ... /> */}
          <iframe
            src={activeTab.url}
            title="browser-view"
            className="browser-frame"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>

        <AIPanel
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          currentUrl={activeTab.url}
        />
      </div>
    </div>
  );
}

export default App;