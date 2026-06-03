// ========== 全局变量 ==========
let records = [];
let weights = [];
let photos = [];
let currentFilter = 'all';
let currentSearchKeyword = '';

// 养狗常识库（可搜索）
const knowledgeBase = [
    { title: "疫苗时间表", content: "幼犬6-8周第一针，每隔3-4周一针，共三针。成年后每年加强一针。" },
    { title: "驱虫频率", content: "体内驱虫：3个月一次；体外驱虫：1个月一次。" },
    { title: "不能吃的食物", content: "巧克力、洋葱、大蒜、葡萄、夏威夷果、木糖醇、牛油果。" },
    { title: "训练技巧", content: "正向激励，用零食奖励好行为，不打骂。每次训练5-10分钟。" },
    { title: "刷牙方法", content: "每周刷2-3次，使用宠物专用牙膏，从小培养习惯。" },
    { title: "社会化训练", content: "3-16周是黄金期，多带出门接触不同人、狗、环境。" },
    { title: "洗澡频率", content: "夏天2周一次，冬天1个月一次。用宠物专用香波。" },
    { title: "遛狗建议", content: "每天至少30分钟，大型犬需要1小时以上。" },
    { title: "便便健康", content: "正常：成型可捡起；软便：消化不良；腹泻：需就医。" },
    { title: "中暑急救", content: "移至阴凉处，用凉水打湿脚垫和腹部，立即送医。" }
];

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    renderAll();
    refreshTip();
    setupKnowledgeSearch();
});

function loadAllData() {
    records = JSON.parse(localStorage.getItem('petDiary') || '[]');
    weights = JSON.parse(localStorage.getItem('petWeights') || '[]');
    photos = JSON.parse(localStorage.getItem('petPhotos') || '[]');
}

function saveAllData() {
    localStorage.setItem('petDiary', JSON.stringify(records));
    localStorage.setItem('petWeights', JSON.stringify(weights));
    localStorage.setItem('petPhotos', JSON.stringify(photos));
}

// ========== 密码锁 ==========
function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const defaultPassword = localStorage.getItem('petPassword') || '1234';
    if (input === defaultPassword) {
        document.getElementById('lockScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
    } else {
        document.getElementById('lockError').innerText = '密码错误';
    }
}
// 修改密码（可选）
function changePassword(newPwd) {
    localStorage.setItem('petPassword', newPwd);
    alert('密码已修改');
}

// ========== 统计看板 ==========
function renderStats() {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const monthRecords = records.filter(r => r.date.startsWith(currentMonth));
    
    document.getElementById('statTotal').innerText = records.length;
    document.getElementById('statMonth').innerText = monthRecords.length;
    document.getElementById('statFood').innerText = records.filter(r => r.type === '饮食').length;
    document.getElementById('statExercise').innerText = records.filter(r => r.type === '作息').length;
}

// ========== 疫苗提醒 ==========
function renderVaccineReminder() {
    const lastVaccine = localStorage.getItem('lastVaccineDate');
    const lastDeworm = localStorage.getItem('lastDewormDate');
    const today = new Date();
    
    let html = '';
    
    if (lastVaccine) {
        const vaccineDate = new Date(lastVaccine);
        const daysPassed = Math.floor((today - vaccineDate) / (1000*60*60*24));
        const daysToNext = 365 - daysPassed;
        let status = '';
        if (daysToNext <= 30) status = 'urgent';
        else if (daysToNext <= 60) status = 'warning';
        else status = 'safe';
        html += `<div class="vaccine-item"><span class="vaccine-name">💉 疫苗</span><span class="vaccine-days ${status}">${daysToNext > 0 ? daysToNext + '天后接种' : '已过期'}</span></div>`;
    } else {
        html += `<div class="vaccine-item"><span>💉 疫苗</span><span>未记录，点击设置</span></div>`;
    }
    
    if (lastDeworm) {
        const dewormDate = new Date(lastDeworm);
        const daysPassed = Math.floor((today - dewormDate) / (1000*60*60*24));
        const daysToNext = 90 - daysPassed;
        let status = '';
        if (daysToNext <= 14) status = 'urgent';
        else if (daysToNext <= 30) status = 'warning';
        else status = 'safe';
        html += `<div class="vaccine-item"><span class="vaccine-name">🪱 驱虫</span><span class="vaccine-days ${status}">${daysToNext > 0 ? daysToNext + '天后进行' : '已过期'}</span></div>`;
    } else {
        html += `<div class="vaccine-item"><span>🪱 驱虫</span><span>未记录，点击设置</span></div>`;
    }
    
    html += `<div class="vaccine-item"><span>📅 设置提醒</span><span><button class="small-btn" onclick="setVaccineReminder()">设置日期</button></span></div>`;
    document.getElementById('vaccineContent').innerHTML = html;
}

function setVaccineReminder() {
    const vaccineDate = prompt('最近一次疫苗日期 (YYYY-MM-DD)：');
    if (vaccineDate) localStorage.setItem('lastVaccineDate', vaccineDate);
    const dewormDate = prompt('最近一次体内驱虫日期 (YYYY-MM-DD)：');
    if (dewormDate) localStorage.setItem('lastDewormDate', dewormDate);
    renderVaccineReminder();
}

// ========== 体重追踪 ==========
function renderWeights() {
    if (weights.length === 0) {
        document.getElementById('weightList').innerHTML = '暂无体重记录';
        return;
    }
    const sorted = [...weights].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);
    let html = '';
    for (let w of sorted) {
        html += `<div class="weight-item"><span>${w.date}</span><span>${w.value} kg</span></div>`;
    }
    document.getElementById('weightList').innerHTML = html;
}

function openWeightModal() {
    document.getElementById('weightModal').style.display = 'flex';
    document.getElementById('weightDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('weightValue').value = '';
}

function closeWeightModal() {
    document.getElementById('weightModal').style.display = 'none';
}

document.getElementById('weightForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    weights.push({
        date: document.getElementById('weightDate').value,
        value: parseFloat(document.getElementById('weightValue').value)
    });
    saveAllData();
    renderWeights();
    closeWeightModal();
});

// ========== 便便记录 ==========
function openStoolModal() {
    document.getElementById('stoolModal').style.display = 'flex';
    document.getElementById('stoolDate').value = new Date().toISOString().slice(0,10);
}

function closeStoolModal() {
    document.getElementById('stoolModal').style.display = 'none';
}

document.getElementById('stoolForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const statusMap = { normal: '正常', soft: '软便', diarrhea: '腹泻', dry: '偏干' };
    const stoolStatus = document.getElementById('stoolStatus').value;
    const note = document.getElementById('stoolNote').value;
    let healthTip = '';
    if (stoolStatus === 'diarrhea') healthTip = '⚠️ 腹泻需注意，观察是否持续，必要时就医';
    else if (stoolStatus === 'soft') healthTip = '💡 软便可能消化不良，减少零食观察';
    else healthTip = '✅ 便便正常，继续保持';
    
    records.push({
        id: Date.now(),
        date: document.getElementById('stoolDate').value,
        type: '便便',
        content: `便便状态：${statusMap[stoolStatus]}`,
        note: note ? `${note} ${healthTip}` : healthTip
    });
    saveAllData();
    renderRecords();
    closeStoolModal();
});

// ========== 照片上传 ==========
function openPhotoModal() {
    document.getElementById('photoModal').style.display = 'flex';
    document.getElementById('photoDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('photoFile').value = '';
}

function closePhotoModal() {
    document.getElementById('photoModal').style.display = 'none';
}

document.getElementById('photoForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = document.getElementById('photoFile').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        photos.push({
            id: Date.now(),
            date: document.getElementById('photoDate').value,
            data: evt.target.result,
            desc: document.getElementById('photoDesc').value
        });
        saveAllData();
        records.push({
            id: Date.now()+1,
            date: document.getElementById('photoDate').value,
            type: '健康',
            content: '📸 上传了照片',
            note: document.getElementById('photoDesc').value || '小狗照片'
        });
        saveAllData();
        renderRecords();
        closePhotoModal();
    };
    reader.readAsDataURL(file);
});

// ========== 养狗常识搜索 ==========
function setupKnowledgeSearch() {
    const searchInput = document.getElementById('knowledgeSearch');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const results = knowledgeBase.filter(k => 
            k.title.toLowerCase().includes(keyword) || 
            k.content.toLowerCase().includes(keyword)
        );
        const container = document.getElementById('knowledgeResults');
        if (results.length === 0) {
            container.innerHTML = '<div class="knowledge-item">未找到相关内容</div>';
        } else {
            container.innerHTML = results.map(r => 
                `<div class="knowledge-item"><strong>${r.title}</strong><br>${r.content}</div>`
            ).join('');
        }
    });
    // 默认显示全部
    document.getElementById('knowledgeSearch').dispatchEvent(new Event('input'));
}

// ========== 原有记录功能 ==========
function renderRecords() {
    let filtered = [...records];
    if (currentFilter !== 'all') {
        filtered = filtered.filter(r => r.type === currentFilter);
    }
    if (currentSearchKeyword.trim()) {
        const kw = currentSearchKeyword.toLowerCase();
        filtered = filtered.filter(r => 
            r.content.toLowerCase().includes(kw) || 
            (r.note && r.note.toLowerCase().includes(kw))
        );
    }
    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
    
    const container = document.getElementById('recordList');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">📭 暂无记录</div>';
        return;
    }
    container.innerHTML = filtered.map(r => `
        <div class="record-card" data-type="${r.type}">
            <div class="record-header">
                <span class="record-type ${r.type}">${r.type}</span>
                <span>${r.date}</span>
                <button class="delete-btn" onclick="deleteRecord(${r.id})">🗑️</button>
            </div>
            <div class="record-content">${escapeHtml(r.content)}</div>
            ${r.note ? `<div class="record-note">📌 ${escapeHtml(r.note)}</div>` : ''}
        </div>
    `).join('');
}

function deleteRecord(id) {
    if (confirm('删除这条记录？')) {
        records = records.filter(r => r.id !== id);
        saveAllData();
        renderRecords();
        renderStats();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openAddModal(type) {
    window.currentRecordType = type;
    document.getElementById('modalTitle').innerText = `添加${type}记录`;
    document.getElementById('recordDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('recordContent').value = '';
    document.getElementById('recordNote').value = '';
    document.getElementById('addModal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

document.getElementById('addForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    records.push({
        id: Date.now(),
        date: document.getElementById('recordDate').value,
        type: window.currentRecordType,
        content: document.getElementById('recordContent').value,
        note: document.getElementById('recordNote').value
    });
    saveAllData();
    renderRecords();
    renderStats();
    closeAddModal();
});

document.getElementById('searchInput')?.addEventListener('input', (e) => {
    currentSearchKeyword = e.target.value;
    renderRecords();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderRecords();
    });
});

function exportBackup() {
    const backup = { records, weights, photos };
    const blob = new Blob([JSON.stringify(backup)], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `puppy-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
}

function refreshTip() {
    const tips = ["记得每天遛狗", "定期驱虫很重要", "多陪狗狗玩耍", "注意饮食均衡", "保持饮水干净"];
    document.getElementById('dailyTip')?.setAttribute('data-tip', tips[Math.floor(Math.random()*tips.length)]);
}

function renderAll() {
    renderStats();
    renderVaccineReminder();
    renderWeights();
    renderRecords();
}

// 全局暴露函数
window.checkPassword = checkPassword;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.openWeightModal = openWeightModal;
window.closeWeightModal = closeWeightModal;
window.openStoolModal = openStoolModal;
window.closeStoolModal = closeStoolModal;
window.openPhotoModal = openPhotoModal;
window.closePhotoModal = closePhotoModal;
window.deleteRecord = deleteRecord;
window.exportBackup = exportBackup;
window.setVaccineReminder = setVaccineReminder;
window.refreshTip = refreshTip;
