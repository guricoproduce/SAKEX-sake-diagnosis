// Data: Questions and Results
// This is a binary tree structure where 'yes' and 'no' lead to the next node ID.
// Leaf nodes have a 'result' property instead of 'yes'/'no'.

const sakeData = {
    // Starting Question
    "q1": {
        text: "日本酒は普段からよく飲みますか？",
        yes: "q2",
        no: "q3"
    },
    
    // Branch A (Experienced)
    "q2": {
        text: "香りが華やかなタイプが好きですか？",
        yes: "q4",
        no: "q5"
    },
    
    // Branch B (Beginner)
    "q3": {
        text: "甘いお酒やフルーティーな味は好きですか？",
        yes: "q6",
        no: "q7"
    },

    // Detailed Branches
    "q4": {
        text: "食事と一緒に楽しみたいですか？",
        yes: "r1", // 華やか & 食中酒 -> バランス型
        no: "r2"  // 華やか & 単体 -> 大吟醸系
    },
    "q5": {
        text: "どっしりとしたお米の旨味を感じたいですか？",
        yes: "r3", // 旨味 -> 純米酒
        no: "r4"  // スッキリ -> 辛口
    },
    "q6": {
        text: "スパークリング（発泡）日本酒に興味はありますか？",
        yes: "r5", // スパークリング
        no: "r6"  // 甘口フルーティー
    },
    "q7": {
        text: "キリッとした辛口で、後味スッキリが良いですか？",
        yes: "r4", // 辛口
        no: "r1"  // バランス
    }
};

const results = {
    "r1": {
        name: "純米吟醸 〇〇",
        description: "香りと旨味のバランスが絶妙。食事を引き立てる万能な一本です。",
        tags: ["バランス", "食中酒", "爽やか"],
        link: "https://sakex.base.shop/categories/5374111", // Placeholder
        image: "path/to/image1.jpg"
    },
    "r2": {
        name: "純米大吟醸 磨き〇〇",
        description: "まるで果実のような華やかな香り。ワイングラスで楽しみたい贅沢な一本。",
        tags: ["華やか", "フルーティー", "贈答用"],
        link: "https://sakex.base.shop/categories/5374111",
        image: "path/to/image2.jpg"
    },
    "r3": {
        name: "特別純米 〇〇",
        description: "お米本来のふくよかな旨味とコク。ぬる燗にしても美味しい、通好みの一本。",
        tags: ["旨味", "コク", "燗酒おすすめ"],
        link: "https://sakex.base.shop/categories/5374111",
        image: "path/to/image3.jpg"
    },
    "r4": {
        name: "超辛口純米 〇〇",
        description: "雑味がなく、キレのある後味。どんな料理も邪魔しない、究極の食中酒。",
        tags: ["辛口", "スッキリ", "キレ"],
        link: "https://sakex.base.shop/categories/5374111",
        image: "path/to/image4.jpg"
    },
    "r5": {
        name: "発泡純米酒 〇〇",
        description: "シャンパンのようなきめ細かい泡立ち。日本酒が初めての方にもおすすめ。",
        tags: ["スパークリング", "低アルコール", "飲みやすい"],
        link: "https://sakex.base.shop/categories/5374111",
        image: "path/to/image5.jpg"
    },
    "r6": {
        name: "純米吟醸 甘口 〇〇",
        description: "優しい甘みと酸味のハーモニー。デザート感覚でも楽しめる一本。",
        tags: ["甘口", "フルーティー", "初心者おすすめ"],
        link: "https://sakex.base.shop/categories/5374111",
        image: "path/to/image6.jpg"
    }
};

// State
let currentQuestionId = "q1";
let history = []; // Stack to keep track of path for "Back" button

// DOM Elements
const screens = {
    intro: document.getElementById('intro'),
    question: document.getElementById('question-container'),
    result: document.getElementById('result-container')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    questionText: document.getElementById('question-text'),
    optionButtons: document.querySelectorAll('.btn-option'),
    backBtn: document.getElementById('back-btn'),
    progressBar: document.getElementById('progress-fill'),
    
    resultName: document.getElementById('result-name'),
    resultDesc: document.getElementById('result-desc'),
    resultTags: document.getElementById('result-tags'),
    resultLink: document.getElementById('result-link'),
    resultImage: document.getElementById('result-image'),
    restartBtn: document.getElementById('restart-btn')
};

// Event Listeners
elements.startBtn.addEventListener('click', startDiagnosis);
elements.backBtn.addEventListener('click', goBack);
elements.restartBtn.addEventListener('click', resetDiagnosis);

elements.optionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const answer = e.target.getAttribute('data-answer');
        handleAnswer(answer);
    });
});

// Functions
function switchScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
        // Reset animation
        screen.style.animation = 'none';
        screen.offsetHeight; /* trigger reflow */
        screen.style.animation = null; 
    });
    
    screens[screenName].classList.remove('hidden');
    screens[screenName].classList.add('active');
}

function startDiagnosis() {
    currentQuestionId = "q1";
    history = [];
    updateQuestionDisplay();
    switchScreen('question');
}

function handleAnswer(answer) {
    const currentData = sakeData[currentQuestionId];
    const nextId = currentData[answer];

    history.push(currentQuestionId);

    if (nextId.startsWith('r')) {
        // It's a result
        showResult(nextId);
    } else {
        // It's another question
        currentQuestionId = nextId;
        updateQuestionDisplay();
    }
}

function goBack() {
    if (history.length === 0) {
        switchScreen('intro');
        return;
    }
    currentQuestionId = history.pop();
    updateQuestionDisplay();
}

function updateQuestionDisplay() {
    const data = sakeData[currentQuestionId];
    
    // Fade out text
    elements.questionText.style.opacity = 0;
    
    setTimeout(() => {
        elements.questionText.textContent = data.text;
        elements.questionText.style.opacity = 1;
        
        // Simple progress simulation (depth based)
        const depth = history.length;
        const maxDepth = 4; // Approximate max depth
        const progress = Math.min(((depth + 1) / maxDepth) * 100, 100);
        elements.progressBar.style.width = `${progress}%`;
    }, 200);
}

function showResult(resultId) {
    const data = results[resultId];
    
    elements.resultName.textContent = data.name;
    elements.resultDesc.textContent = data.description;
    elements.resultLink.href = data.link;
    
    // Clear and add tags
    elements.resultTags.innerHTML = '';
    data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = `#${tag}`;
        span.style.marginRight = '10px';
        span.style.color = 'var(--color-accent)';
        elements.resultTags.appendChild(span);
    });

    switchScreen('result');
}

function resetDiagnosis() {
    switchScreen('intro');
    currentQuestionId = "q1";
    history = [];
}
