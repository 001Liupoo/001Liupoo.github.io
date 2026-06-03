// 初始化数据
let records = [];
let currentFilter = 'all';
let currentSearchKeyword = '';

// DOM 元素
const recordListEl = document.getElementById('recordList');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const addModal = document.getElementById('addModal');
const addForm = document.getElementById('addForm');
const modalTitle = document.getElementById('modalTitle');
let currentRecordType = '饮食';

// 养狗知识库
const tipsDatabase = [
    "幼犬每天喂3-4次，选择幼犬粮，用温水泡软。",
    "成年犬每天喂2次，定时定量，保证新鲜饮水。",
    "每天至少散步30分钟，小型犬可以适当减少。",
    "每月体外驱虫一次，每季度体内驱虫一次。",
    "每年按时打疫苗：狂犬+联苗。",
    "狗狗不能吃：巧克力、洋葱、葡萄、木糖醇、夏威夷果。",
    "每周检查耳朵、剪指甲，预防耳螨和指甲过长。",
    "夏天遛狗避开中午，小心地面烫伤脚垫。",
    "保持体重：能摸到肋骨但看不到是理想体型。",
    "换牙期（4-6个月）给磨牙棒，避免咬坏家具。",
    "社会化黄金期：3-16周，多接触人和环境。",
    "定点排便训练：饭后带去指定地点，奖励零食。"
];

// 显示当前日期
document.getElementById('currentDate').innerHTML = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

// 加载存储数据
function loadRecords() {
    const stored = localStorage.getItem('petDiary');
    if (stored) {
        records = JSON.parse(stored);
    } else {
        // 示例数据
        records = [
            { id: Date.now(), date: new Date().toISOString().slice(0,10), type: '饮食', content: '早餐：狗粮200g + 蛋黄一个', note: '吃得特别香', status: '完成' },
            { id: Date.now()+1, date: new Date().toISOString().slice(0,10), type: '作息', content: '小区草坪散步25分钟', note: '遇到另一只柯基玩得很开心', status: '完成' }
        ];
        saveRecords();
    }
    renderRecords();
}

function saveRecords() {
    localStorage.setItem('petDiary', JSON.stringify(records));
}

// 渲染记录（支持搜索+筛选）
function renderRecords() {
    let filtered = [...records];
    
    // 筛选类型
    if (currentFilter !== 'all') {
        filtered = filtered.filter(r => r.type === currentFilter);
    }
    
    // 搜索关键词
    if (currentSearchKeyword.trim() !== '') {
        const kw = currentSearchKeyword.trim().toLowerCase();
        filtered = filtered.filter(r => 
            r.content.toLowerCase().includes(kw) ||
            r.type.toLowerCase().includes(kw) ||
            (r.note && r.note.toLowerCase().includes(kw))
        );
    }
    
    // 按日期倒序
    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
    
    if (filtered.length === 0) {
        recordListEl.innerHTML = '<div class="empty-state">📭 没有找到相关记录，试试添加一条吧～</div>';
        return;
    }
    
    recordListEl.innerHTML = filtered.map(record => `
        <div class="record-card" data-type="${record.type}">
            <div class="record-header">
                <span class="record-type ${record.type}">${record.type}</span>
                <span class="record-date">${record.date}</span>
                <button class="delete-btn" onclick="deleteRecord(${record.id})">🗑️</button>
            </div>
            <div class="record-content">${escapeHtml(record.content)}</div>
            ${record.note ? `<div class="record-note">📌 ${escapeHtml(record.note)}</div>` : ''}
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 删除记录
function deleteRecord(id) {
    if (confirm('确定删除这条记录吗？')) {
        records = records.filter(r => r.id !== id);
        saveRecords();
        renderRecords();
    }
}

// 打开添加弹窗
function openAddModal(type) {
    currentRecordType = type;
    modalTitle.innerText = `添加${type}记录`;
    document.getElementById('recordDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('recordContent').value = '';
    document.getElementById('recordNote').value = '';
    addModal.style.display = 'flex';
}

function closeAddModal() {
    addModal.style.display = 'none';
}

// 保存新记录
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newRecord = {
        id: Date.now(),
        date: document.getElementById('recordDate').value,
        type: currentRecordType,
        content: document.getElementById('recordContent').value.trim(),
        note: document.getElementById('recordNote').value.trim() || '',
        status: '完成'
    };
    
    if (!newRecord.content) {
        alert('请填写记录内容');
        return;
    }
    
    records.unshift(newRecord);
    saveRecords();
    renderRecords();
    closeAddModal();
});

// 搜索监听
searchInput.addEventListener('input', (e) => {
    currentSearchKeyword = e.target.value;
    renderRecords();
});

// 筛选按钮
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderRecords();
    });
});

// 随机显示一条养狗建议
function refreshTip() {
    const randomIndex = Math.floor(Math.random() * tipsDatabase.length);
    document.getElementById('dailyTip').innerText = tipsDatabase[randomIndex];
}

// 导出备份
function exportBackup() {
    const data = JSON.stringify(records, null, 2);
    const blob = new Blob([data], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pet-diary-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
}

// 点击模态框外部关闭
window.onclick = function(event) {
    if (event.target === addModal) {
        closeAddModal();
    }
}

// 初始化
loadRecords();
refreshTip();

// 让refreshTip全局可用
window.refreshTip = refreshTip;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.deleteRecord = deleteRecord;
window.exportBackup = exportBackup;