// ===== Common Utilities =====

// Theme Management
// Theme Management
function initTheme() {
    // Light/Dark Mode
    const savedTheme = localStorage.getItem('quiz-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Color Theme (Experimental & Custom)
    const savedColorTheme = localStorage.getItem('color-theme');
    if (savedColorTheme) {
        if (savedColorTheme.startsWith('custom:')) {
            const hex = savedColorTheme.split(':')[1];
            applyCustomColor(hex);
        } else if (savedColorTheme !== 'default') {
            document.documentElement.setAttribute('data-color-theme', savedColorTheme);
        }
    }

    // Update UI if we are on settings page
    updateColorThemeUI(savedColorTheme || 'default');
    initCustomColorPicker();
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('quiz-theme', next);
    updateThemeIcon(next);
}

// Color Theme Management
function selectColorTheme(theme) {
    if (theme === 'default') {
        document.documentElement.removeAttribute('data-color-theme');
        clearCustomColor();
        localStorage.removeItem('color-theme');
    } else {
        clearCustomColor();
        document.documentElement.setAttribute('data-color-theme', theme);
        localStorage.setItem('color-theme', theme);
    }
    updateColorThemeUI(theme);
}

function applyCustomColor(hex) {
    const html = document.documentElement;
    html.removeAttribute('data-color-theme'); // Clear standard theme
    html.style.setProperty('--accent', hex);
    // Auto-generate hover and light versions using color-mix
    html.style.setProperty('--accent-hover', `color-mix(in srgb, ${hex}, white 20%)`);
    html.style.setProperty('--accent-light', `color-mix(in srgb, ${hex}, transparent 85%)`);
    html.style.setProperty('--accent-secondary', `color-mix(in srgb, ${hex}, blue 20%)`);
    html.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${hex}, color-mix(in srgb, ${hex}, black 20%))`);

    localStorage.setItem('color-theme', `custom:${hex}`);
}

function clearCustomColor() {
    const html = document.documentElement;
    html.style.removeProperty('--accent');
    html.style.removeProperty('--accent-hover');
    html.style.removeProperty('--accent-light');
    html.style.removeProperty('--accent-secondary');
    html.style.removeProperty('--accent-gradient');
}

function initCustomColorPicker() {
    const picker = document.getElementById('custom-color-picker');
    if (!picker) return;

    // Load saved value if custom
    const saved = localStorage.getItem('color-theme');
    if (saved && saved.startsWith('custom:')) {
        picker.value = saved.split(':')[1];
    }

    picker.addEventListener('input', (e) => {
        applyCustomColor(e.target.value);
        updateColorThemeUI('custom');
    });
}

function updateColorThemeUI(activeTheme) {
    const options = document.querySelectorAll('.color-option');
    if (!options.length) return;

    options.forEach(opt => {
        // Reset styles
        const circle = opt.querySelector('div');
        if (circle) {
            circle.style.border = '2px solid transparent';
            circle.style.transform = 'scale(1)';
        }
    });

    // Highlight active
    let activeOpt;
    if (activeTheme && activeTheme.startsWith('custom')) {
        activeOpt = document.getElementById('custom-color-option');
    } else {
        activeOpt = document.querySelector(`.color-option[onclick*="'${activeTheme}'"]`);
    }

    if (activeOpt) {
        const circle = activeOpt.querySelector('div');
        if (circle) {
            circle.style.border = '2px solid var(--text-primary)';
            circle.style.transform = 'scale(1.1)';
        }
    }
}

// ===== Subject Management (Multi-Subject Support) =====
let subjectsData = [];
let currentSubjectData = null;
let subjectsListPromise = null;
let currentSubjectConfigPromise = null;
let currentSubjectConfigId = null;
let loadedQuizDataSubjectId = null;

// List of disabled subjects that should not be accessible
const DISABLED_SUBJECTS = [];

function getCurrentSubjectId() {
    const storedSubject = localStorage.getItem('current-subject');

    // Block access to disabled subjects (e.g., KTH)
    if (storedSubject && DISABLED_SUBJECTS.includes(storedSubject)) {
        console.warn(`Subject '${storedSubject}' is disabled and cannot be accessed`);
        localStorage.setItem('current-subject', 'triet-mac-lenin');
        return 'triet-mac-lenin';
    }

    return storedSubject || 'triet-mac-lenin';
}

function setCurrentSubject(subjectId) {
    // Prevent setting disabled subjects
    if (DISABLED_SUBJECTS.includes(subjectId)) {
        console.error(`Cannot set subject to '${subjectId}' - this subject is disabled`);
        return;
    }

    localStorage.setItem('current-subject', subjectId);
    currentSubjectData = null;
    currentSubjectConfigPromise = null;
    currentSubjectConfigId = null;
    loadedQuizDataSubjectId = null;
    window.quizData.chapters = [];
    window.quizData.questions = [];
    window.quizData.studyTopics = [];

    if (window.__clientRouterReady) {
        navigateSpa(window.location.href, { replace: true });
    } else {
        window.location.reload();
    }
}

async function loadSubjectsList() {
    if (subjectsListPromise) return subjectsListPromise;

    subjectsListPromise = (async () => {
        try {
            const response = await fetch('subjects.json?v=' + Date.now());
            subjectsData = await response.json();
            return subjectsData;
        } catch (error) {
            console.error('Error loading subjects:', error);
            subjectsListPromise = null;
            return [];
        }
    })();

    return subjectsListPromise;
}

async function loadCurrentSubjectConfig() {
    const subjectId = getCurrentSubjectId();

    if (currentSubjectConfigPromise && currentSubjectConfigId === subjectId) {
        return currentSubjectConfigPromise;
    }

    // Additional check to block disabled subjects
    if (DISABLED_SUBJECTS.includes(subjectId)) {
        console.error(`Cannot load subject config for disabled subject '${subjectId}'`);
        return null;
    }

    await loadSubjectsList();
    const subject = subjectsData.find(s => s.id === subjectId);
    if (!subject) return null;

    currentSubjectConfigId = subjectId;
    currentSubjectConfigPromise = (async () => {
        try {
            const response = await fetch(`${subject.path}/subject.json?v=${Date.now()}`);
            currentSubjectData = await response.json();
            return currentSubjectData;
        } catch (error) {
            console.error('Error loading subject config:', error);
            currentSubjectConfigPromise = null;
            currentSubjectConfigId = null;
            return null;
        }
    })();

    return currentSubjectConfigPromise;
}

function getExamFilesPath() {
    if (!currentSubjectData) return 'exam';
    const subject = subjectsData.find(s => s.id === currentSubjectData.id);
    const examPath = currentSubjectData.examPath || 'exam';
    return subject ? `${subject.path}/${examPath}` : 'exam';
}

function getChapterFiles() {
    if (!currentSubjectData || !currentSubjectData.chapters) return [];
    const basePath = getExamFilesPath();
    return currentSubjectData.chapters.map(ch => `${basePath}/${ch.file}`);
}


// Header now displays NEO Education logo only - subject name removed
// updateHeaderWithSubject() function removed as part of rebranding


function createSubjectSelector() {
    const headerContent = document.querySelector('.header-content');
    if (!headerContent || subjectsData.length < 2) return;
    const currentSubjectId = getCurrentSubjectId();
    const currentSubject = subjectsData.find(s => s.id === currentSubjectId);

    const selector = document.createElement('div');
    selector.className = 'subject-selector';
    selector.innerHTML = `
        <button class="subject-btn" title="Chọn môn học">
            <span class="subject-icon">${currentSubject?.icon || '📚'}</span>
            <span class="subject-name-short">${currentSubject?.shortName || 'Môn học'}</span>
            <span class="dropdown-arrow">▼</span>
        </button>
        <div class="subject-dropdown">
            ${subjectsData.map(s => `
                <div class="subject-option ${s.id === currentSubjectId ? 'active' : ''}" data-subject="${s.id}">
                    <span class="opt-icon">${s.icon}</span>
                    <div class="opt-info">
                        <span class="opt-name">${s.name}</span>
                        <span class="opt-school">${s.shortSchool}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const themeToggle = headerContent.querySelector('.theme-toggle');
    if (themeToggle) headerContent.insertBefore(selector, themeToggle);
    else headerContent.appendChild(selector);

    const btn = selector.querySelector('.subject-btn');
    const dropdown = selector.querySelector('.subject-dropdown');
    btn.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('active'); });
    selector.querySelectorAll('.subject-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const subjectId = opt.dataset.subject;
            if (subjectId !== currentSubjectId) setCurrentSubject(subjectId);
        });
    });
    document.addEventListener('click', () => dropdown.classList.remove('active'));
}

// Data Loading
window.quizData = {
    chapters: [],
    questions: [],
    studyTopics: []
};


async function loadAllData(forceReload = false) {
    const subjectId = getCurrentSubjectId();
    if (!forceReload && loadedQuizDataSubjectId === subjectId && window.quizData.questions.length > 0) {
        return window.quizData;
    }

    window.quizData.chapters = [];
    window.quizData.questions = [];

    const files = getChapterFiles();
    console.log('Loading files:', files);

    for (const file of files) {
        try {
            let data;
            // Normalize file path for key lookup if needed (remove leading slash if present)
            const lookupKey = file.startsWith('/') ? file.substring(1) : file;

            if (window.QUIZ_DATA && window.QUIZ_DATA[lookupKey]) {
                data = window.QUIZ_DATA[lookupKey];
            } else {
                // Add timestamp to prevent caching
                const response = await fetch(`${file}?v=${new Date().getTime()}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                data = await response.json();
            }
            // Extract chapter number from 'chapter' or 'title' field, or fallback to filename
            let chapterNum = 0;
            if (data.chapter) {
                chapterNum = data.chapter;
            } else if (data.title) {
                const match = data.title.match(/\d+/);
                if (match) chapterNum = parseInt(match[0]);
            }

            // Fallback to filename (e.g., "1.json")
            if (!chapterNum || chapterNum === 0) {
                const fileMatch = file.match(/\/(\d+)\.json$/) || file.match(/^(\d+)\.json$/);
                if (fileMatch) chapterNum = parseInt(fileMatch[1]);
            }

            window.quizData.chapters.push({
                file,
                chapter: chapterNum,
                questions: data.questions
            });
            window.quizData.questions.push(...data.questions.map(q => ({
                ...q,
                // Normalize: support both 'text' and 'question' for question text
                text: q.text || q.question,
                // Normalize: support both 'correct_answer' and 'answer'
                correct_answer: q.correct_answer || q.answer,
                // Normalize options: support both {letter, text} and {id, content}
                options: (q.options || []).map(opt => ({
                    letter: opt.letter || opt.id,
                    text: opt.text || opt.content
                })),
                // Normalize explanation
                explanation: q.explanation || q.explain,
                chapter: chapterNum,
                file
            })));

            console.log(`Loaded ${file}: ${data.questions.length} questions`);

        } catch (error) {
            console.error(`Error loading ${file}:`, error);
            alert(`Không thể tải dữ liệu câu hỏi: ${file}\nLỗi: ${error.message}`);
        }
    }

    loadedQuizDataSubjectId = subjectId;
    return window.quizData;
}

async function loadStudyData() {
    try {
        await loadSubjectsList();
        const subject = subjectsData.find(s => s.id === getCurrentSubjectId());
        const studyDataPath = subject ? `${subject.path}/study_data.json` : 'study_data.json';
        const response = await fetch(`${studyDataPath}?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Failed to load study data');
        window.quizData.studyTopics = await response.json();
        return window.quizData.studyTopics;
    } catch (error) {
        console.error('Error loading study data:', error);
        return [];
    }
}

function getQuestionsByChapter(chapter) {
    if (!chapter || chapter === 'all') {
        return window.quizData.questions;
    }

    // 1. Try direct match (String ID or File Path)
    const directMatch = window.quizData.questions.filter(q => q.file === chapter || q.chapter == chapter);
    if (directMatch.length > 0) return directMatch;

    // 2. Legacy: Try to extract number (for old Triet/PhapLuat if needed)
    let chapterNum = parseInt(chapter);
    if (isNaN(chapterNum) && typeof chapter === 'string') {
        const match = chapter.match(/chuong_(\d+)/i) || chapter.match(/(\d+)/);
        if (match) {
            chapterNum = parseInt(match[1]);
        }
    }

    if (!isNaN(chapterNum) && chapterNum > 0) {
        return window.quizData.questions.filter(q => q.chapter === chapterNum);
    }

    return [];
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Stats Management
function getStats() {
    return {
        studiedToday: parseInt(localStorage.getItem('studiedToday') || '0'),
        totalCorrect: parseInt(localStorage.getItem('totalCorrect') || '0'),
        totalAnswered: parseInt(localStorage.getItem('totalAnswered') || '0')
    };
}

function updateStats(updates) {
    const stats = getStats();
    Object.keys(updates).forEach(key => {
        stats[key] = (stats[key] || 0) + updates[key];
        localStorage.setItem(key, stats[key]);
    });
    return stats;
}

// Reset daily stats at midnight
function checkDailyReset() {
    const now = new Date();
    const lastReset = localStorage.getItem('lastReset');
    const today = now.toDateString();

    if (lastReset !== today) {
        localStorage.setItem('studiedToday', '0');
        localStorage.setItem('lastReset', today);
    }
}

// Navigation highlighting
function highlightCurrentNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const href = tab.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking on a nav link
        mainNav.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }
}

// ===== Lightweight Client-side Navigation =====
const SPA_PAGE_INITIALIZERS = {
    'index.html': 'initDashboard',
    'study.html': 'initStudy',
    'exam.html': 'initExam',
    'simulation.html': 'initSimulation'
};

const SPA_PAGE_TEARDOWNS = {
    'study.html': 'teardownStudy',
    'exam.html': 'teardownExam',
    'simulation.html': 'teardownSimulation'
};

const SPA_LOADED_SCRIPTS = new Set();
const SPA_EXECUTED_INLINE_SCRIPTS = new Set();

function getPageNameFromUrl(url = window.location.href) {
    const parsed = new URL(url, window.location.href);
    return parsed.pathname.split('/').pop() || 'index.html';
}

function getScriptKey(src) {
    return new URL(src, window.location.href).pathname;
}

function markExistingScriptsAsLoaded() {
    document.querySelectorAll('script[src]').forEach(script => {
        SPA_LOADED_SCRIPTS.add(getScriptKey(script.src));
    });
}

function markExistingInlineScriptsAsExecuted() {
    const pageName = getPageNameFromUrl();
    document.body.querySelectorAll('script:not([src])').forEach((script, index) => {
        if (script.textContent.trim()) {
            SPA_EXECUTED_INLINE_SCRIPTS.add(`${pageName}:${index}`);
        }
    });
}

function initCommonPageChrome() {
    initTheme();
    checkDailyReset();
    highlightCurrentNav();
    initMobileMenu();
}

function shouldHandleSpaLink(link) {
    if (!link || link.target || link.hasAttribute('download')) return false;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (!url.pathname.endsWith('.html') && url.pathname !== '/' && url.pathname !== '') return false;
    return true;
}

function ensurePageStyles(doc) {
    const existing = new Set(
        Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .map(link => new URL(link.href, window.location.href).pathname)
    );

    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const key = new URL(href, window.location.href).pathname;
        if (existing.has(key)) return;

        const nextLink = document.createElement('link');
        nextLink.rel = 'stylesheet';
        nextLink.href = href;
        document.head.appendChild(nextLink);
        existing.add(key);
    });
}

function syncPageMetadata(doc) {
    const nextTitle = doc.querySelector('title');
    if (nextTitle) document.title = nextTitle.textContent;

    const nextDescription = doc.querySelector('meta[name="description"]');
    const currentDescription = document.querySelector('meta[name="description"]');
    if (nextDescription && currentDescription) {
        currentDescription.setAttribute('content', nextDescription.getAttribute('content') || '');
    }
}

function loadExternalScript(src) {
    const key = getScriptKey(src);
    if (SPA_LOADED_SCRIPTS.has(key)) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            SPA_LOADED_SCRIPTS.add(key);
            resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

async function executePageScripts(doc, pageName) {
    const scripts = Array.from(doc.body.querySelectorAll('script'));

    for (let index = 0; index < scripts.length; index++) {
        const script = scripts[index];
        const src = script.getAttribute('src');

        if (src) {
            await loadExternalScript(src);
            continue;
        }

        const code = script.textContent.trim();
        const inlineKey = `${pageName}:${index}`;
        if (!code || SPA_EXECUTED_INLINE_SCRIPTS.has(inlineKey)) continue;

        SPA_EXECUTED_INLINE_SCRIPTS.add(inlineKey);
        (0, eval)(code);
    }
}

async function initializeSpaPage(pageName) {
    initCommonPageChrome();

    const initName = SPA_PAGE_INITIALIZERS[pageName];
    if (initName && typeof window[initName] === 'function') {
        await window[initName]();
    }

    if (pageName === 'settings.html') {
        if (typeof window.renderSubjectSelector === 'function') await window.renderSubjectSelector();
        if (typeof window.initColorThemeUI === 'function') window.initColorThemeUI();
        if (typeof window.renderCustomColors === 'function') window.renderCustomColors();
        if (typeof window.updateThemeUI === 'function') window.updateThemeUI();
    }
}

function teardownCurrentSpaPage() {
    const teardownName = SPA_PAGE_TEARDOWNS[getPageNameFromUrl()];
    if (teardownName && typeof window[teardownName] === 'function') {
        window[teardownName]();
    }
}

async function navigateSpa(url, { replace = false } = {}) {
    const targetUrl = new URL(url, window.location.href);
    const pageName = getPageNameFromUrl(targetUrl.href);

    try {
        document.documentElement.classList.add('spa-loading');
        const response = await fetch(`${targetUrl.pathname}${targetUrl.search}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        teardownCurrentSpaPage();
        ensurePageStyles(doc);
        syncPageMetadata(doc);
        document.body.className = doc.body.className;
        document.body.innerHTML = doc.body.innerHTML;

        await executePageScripts(doc, pageName);

        if (replace) history.replaceState({ spa: true }, '', targetUrl.href);
        else history.pushState({ spa: true }, '', targetUrl.href);

        await initializeSpaPage(pageName);
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('SPA navigation failed, falling back to full load:', error);
        window.location.href = targetUrl.href;
    } finally {
        document.documentElement.classList.remove('spa-loading');
    }
}

function initClientRouter() {
    markExistingScriptsAsLoaded();
    markExistingInlineScriptsAsExecuted();
    window.__clientRouterReady = true;
    history.replaceState({ spa: true }, '', window.location.href);

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');
        if (!shouldHandleSpaLink(link)) return;

        const url = new URL(link.href, window.location.href);
        const current = new URL(window.location.href);
        if (url.pathname === current.pathname && url.search === current.search) return;

        event.preventDefault();
        navigateSpa(url.href);
    });

    window.addEventListener('popstate', () => {
        navigateSpa(window.location.href, { replace: true });
    });
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', async () => {
    initCommonPageChrome();
    initClientRouter();

    // Initialize multi-subject support (for data loading, not header display)
    await loadSubjectsList();
    await loadCurrentSubjectConfig();
    // Header now displays NEO Education logo only - updateHeaderWithSubject() removed
    // Subject selector moved to Settings page

    // Theme toggle removed from header - now in Settings page

});

