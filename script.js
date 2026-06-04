// ==================== 全局变量 ====================
let mealRecords = [];
let simpleRecords = [];
let weights = [];
let lengths = [];
let healthEvents = [];
let petInfo = {};
let insurance = {};

let weightChart = null;
let lengthChart = null;
let currentPassword = localStorage.getItem('petPassword') || '1234';

// ==================== 饮食禁忌知识库 ====================
const foodTaboo = {
    absolute: [
        { name: "巧克力、可可、咖啡、茶", severity: "高（可致命）", effect: "可可碱、咖啡因中毒，损伤心脏和神经" },
        { name: "木糖醇（口香糖、牙膏、无糖糖果等）", severity: "高（可致命）", effect: "导致低血糖、急性肝衰竭" },
        { name: "葡萄、葡萄干", severity: "高（可致命）", effect: "引发急性肾衰竭" },
        { name: "夏威夷果", severity: "高（可致命）", effect: "神经毒性，导致虚弱、呕吐、震颤" },
        { name: "洋葱、大葱、韭菜、大蒜", severity: "高（可致命）", effect: "破坏红细胞，引发溶血性贫血" },
        { name: "发霉/野生菌类", severity: "高（可致命）", effect: "含霉菌毒素，可致死" },
        { name: "酒精", severity: "高（可致命）", effect: "中毒、昏迷、死亡" },
        { name: "禽类骨头（鸡、鸭、鹅）、鱼刺", severity: "高（物理损伤）", effect: "划伤或刺穿食道、肠胃，引起内出血" }
    ],
    cautious: [
        { name: "肥肉、油炸食品", severity: "中", effect: "诱发胰腺炎" },
        { name: "动物肝脏", severity: "中", effect: "长期大量食用导致维生素A中毒" },
        { name: "生鸡蛋", severity: "中", effect: "沙门氏菌感染，消耗维生素H" },
        { name: "生肉、生鱼", severity: "中", effect: "细菌、寄生虫感染，生鱼致维生素B1缺乏" },
        { name: "桃、李、杏的果核", severity: "中", effect: "果核含氰化物，且有窒息风险" },
        { name: "海鲜", severity: "低", effect: "部分狗狗过敏，引起皮肤红肿、瘙痒" },
        { name: "人类饭菜（高盐高糖）", severity: "低", effect: "加重肾脏负担，导致肥胖、糖尿病" },
        { name: "牛奶及乳制品", severity: "低", effect: "乳糖不耐受，引起腹泻、胀气" }
    ]
};

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

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    renderAll();
    updateCurrentDate();
    refreshTip();
});

function loadAllData() {
    mealRecords = JSON.parse(localStorage.getItem('wheat_mealRecords') || '[]');
    simpleRecords = JSON.parse(localStorage.getItem('wheat_simpleRecords') || '[]');
    weights = JSON.parse(localStorage.getItem('wheat_weights') || '[]');
    lengths = JSON.parse(localStorage.getItem('wheat_lengths') || '[]');
    healthEvents = JSON.parse(localStorage.getItem('wheat_healthEvents') || '[]');
    petInfo = JSON.parse(localStorage.getItem('wheat_petInfo') || '{}');
    insurance = JSON.parse(localStorage.getItem('wheat_insurance') || getDefaultInsurance());
}

function saveAllData() {
    localStorage.setItem('wheat_mealRecords', JSON.stringify(mealRecords));
    localStorage.setItem('wheat_simpleRecords', JSON.stringify(simpleRecords));
    localStorage.setItem('wheat_weights', JSON.stringify(weights));
    localStorage.setItem('wheat_lengths', JSON.stringify(lengths));
    localStorage.setItem('wheat_healthEvents', JSON.stringify(healthEvents));
    localStorage.setItem('wheat_petInfo', JSON.stringify(petInfo));
    localStorage.setItem('wheat_insurance', JSON.stringify(insurance));
}

function getDefaultInsurance() {
    return {
        planName: "支付宝宠物医保升级版",
        provider: "众安保险",
        premium: "38.25元/月",
        period: "20260531-20270530",
        coverage: "每次门诊限额1200元，手术限额2000元，定点医院赔付70%，非定点医院赔付40%，清单外医院不赔付。",
        channel: "支付宝在线理赔或众安保险APP",
        bonus: "体外驱虫药（邮寄）1支、宠物联苗1支、免费宠物医师咨询4008299958",
        hotline: "400-829-9958"
    };
}

// ==================== 密码锁 ====================
function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    if (input === currentPassword) {
        document.getElementById('lockScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('lockError').innerText = '';
    } else {
        document.getElementById('lockError').innerText = '密码错误';
    }
}

function showLockScreen() {
    document.getElementById('lockScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('passwordInput').value = '';
}

function changePassword() {
    const oldPwd = document.getElementById('oldPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    
    if (oldPwd !== currentPassword) { alert('当前密码错误'); return; }
    if (newPwd !== confirmPwd) { alert('两次密码不一致'); return; }
    if (newPwd.length < 4) { alert('密码至少4位'); return; }
    
    currentPassword = newPwd;
    localStorage.setItem('petPassword', newPwd);
    alert('密码修改成功');
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// ==================== 辅助函数 ====================
function showMessage(msg) {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#10B981;color:white;padding:8px 20px;border-radius:40px;z-index:9999;font-size:14px;`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function updateCurrentDate() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][now.getDay()]}`;
    const elem = document.getElementById('currentDateDisplay');
    if (elem) elem.innerText = dateStr;
}

function refreshTip() {
    const tipElem = document.getElementById('dailyTip');
    if (tipElem) {
        const randomIndex = Math.floor(Math.random() * tipsDatabase.length);
        tipElem.innerText = tipsDatabase[randomIndex];
    }
}

function getEventTypeIcon(type) {
    const icons = { '疫苗': '💉', '驱虫': '🪱', '洗护': '🛁', '就医': '🏥', '手术': '🔪' };
    return icons[type] || '📌';
}

// ==================== 餐次记录弹窗 ====================
function openAddMealModal(mealType) {
    document.getElementById('modalMealType').value = mealType;
    document.getElementById('mealModalTitle').innerText = `添加${mealType}`;
    document.getElementById('modalMealDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('modalMealTime').value = 
        mealType === '早餐' ? '08:00' : (mealType === '午餐' ? '12:00' : (mealType === '晚餐' ? '19:00' : '15:00'));
    document.getElementById('modalMainFood').value = '';
    document.getElementById('modalMainWeight').value = '';
    document.getElementById('modalSideFood').value = '';
    document.getElementById('modalSideWeight').value = '';
    document.getElementById('modalWaterAmount').value = '';
    document.getElementById('modalMealNote').value = '';
    document.getElementById('mealModal').style.display = 'flex';
}

function closeMealModal() {
    document.getElementById('mealModal').style.display = 'none';
}

document.getElementById('mealModalForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const mealData = {
        id: Date.now(),
        date: document.getElementById('modalMealDate').value,
        meal: document.getElementById('modalMealType').value,
        time: document.getElementById('modalMealTime').value,
        mainFood: document.getElementById('modalMainFood').value,
        mainWeight: parseInt(document.getElementById('modalMainWeight').value) || 0,
        sideFood: document.getElementById('modalSideFood').value,
        sideWeight: parseInt(document.getElementById('modalSideWeight').value) || 0,
        water: parseInt(document.getElementById('modalWaterAmount').value) || 0,
        note: document.getElementById('modalMealNote').value
    };
    if (!mealData.mainFood && !mealData.sideFood && !mealData.water) {
        alert('请至少填写主食、辅食或饮水其中一项');
        return;
    }
    mealRecords.push(mealData);
    saveAllData();
    renderAll();
    closeMealModal();
    showMessage('保存成功');
});

// ==================== 简单记录弹窗 ====================
function openAddSimpleModal(type) {
    document.getElementById('simpleRecordType').value = type;
    document.getElementById('simpleModalTitle').innerText = `添加${type}`;
    document.getElementById('simpleRecordDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('simpleRecordContent').value = '';
    document.getElementById('simpleRecordNote').value = '';
    document.getElementById('simpleModal').style.display = 'flex';
}

function closeSimpleModal() {
    document.getElementById('simpleModal').style.display = 'none';
}

document.getElementById('simpleModalForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('simpleRecordType').value;
    const newRecord = {
        id: Date.now(),
        date: document.getElementById('simpleRecordDate').value,
        type: type,
        content: document.getElementById('simpleRecordContent').value,
        note: document.getElementById('simpleRecordNote').value
    };
    if (!newRecord.content) { alert('请填写内容'); return; }
    simpleRecords.push(newRecord);
    saveAllData();
    renderAll();
    closeSimpleModal();
    showMessage('保存成功');
});

// ==================== 渲染所有模块 ====================
function renderAll() {
    renderWeekStats();
    renderTodayTimeline();
    renderTodayReminders();
    renderRecentMilestones();
    renderAllMilestones();      // 成长Tab的大记事
    renderDietCalendar();
    renderDietRecordsList();
    renderHealthRecords();
    renderUpcomingReminders();
    renderGrowthRecords();
    renderWeightChart();
    renderLengthChart();
    renderPetInfoForm();
    renderInsurance();
    renderTabooLists();
    updateDataStats();
}

function renderWeekStats() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7*24*3600*1000).toISOString().slice(0,10);
    const recentMeals = mealRecords.filter(m => m.date >= weekAgo);
    const totalMeals = recentMeals.length;
    const totalWater = recentMeals.reduce((sum, m) => sum + (m.water || 0), 0);
    const uniqueDays = new Set(recentMeals.map(m => m.date)).size;
    document.getElementById('statMeals').innerText = totalMeals;
    document.getElementById('statWater').innerText = totalWater;
    document.getElementById('statDays').innerText = uniqueDays;
}

function renderTodayTimeline() {
    const today = new Date().toISOString().slice(0,10);
    const todayMeals = mealRecords.filter(m => m.date === today).sort((a,b) => a.time.localeCompare(b.time));
    const todaySimple = simpleRecords.filter(s => s.date === today);
    
    const container = document.getElementById('todayTimeline');
    if (todayMeals.length === 0 && todaySimple.length === 0) {
        container.innerHTML = '<div class="empty-state">✨ 今天还没有记录，点击上方按钮添加</div>';
        return;
    }
    
    let html = '';
    todayMeals.forEach(m => {
        html += `<div class="timeline-item">
            <div style="flex:1">
                <div class="timeline-meal">🍖 ${m.meal} ${m.time}</div>
                ${m.mainFood ? `<div class="timeline-detail">主食：${m.mainFood} ${m.mainWeight}g</div>` : ''}
                ${m.sideFood ? `<div class="timeline-detail">辅食：${m.sideFood} ${m.sideWeight}g</div>` : ''}
                ${m.water ? `<div class="timeline-detail">饮水：${m.water}ml</div>` : ''}
                ${m.note ? `<div class="timeline-note">📌 ${m.note}</div>` : ''}
            </div>
            <button class="delete-mini" onclick="deleteMealRecord(${m.id})">🗑️</button>
        </div>`;
    });
    todaySimple.forEach(s => {
        const icon = s.type === '饮水' ? '💧' : (s.type === '便便' ? '💩' : '📝');
        html += `<div class="timeline-item">
            <div style="flex:1">
                <div class="timeline-meal">${icon} ${s.type}</div>
                <div class="timeline-detail">${s.content}</div>
                ${s.note ? `<div class="timeline-note">📌 ${s.note}</div>` : ''}
            </div>
            <button class="delete-mini" onclick="deleteSimpleRecord(${s.id})">🗑️</button>
        </div>`;
    });
    container.innerHTML = html;
}

function renderTodayReminders() {
    const today = new Date();
    const upcoming = healthEvents.filter(e => e.nextDueDate)
        .map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.nextDueDate) - today) / (1000*60*60*24)) }))
        .filter(e => e.daysLeft >= 0 && e.daysLeft <= 30);
    const container = document.getElementById('todayReminders');
    if (upcoming.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无近期提醒</div>';
        return;
    }
    container.innerHTML = upcoming.map(r => `
        <div class="reminder-item ${r.daysLeft <= 7 ? 'reminder-urgent' : ''}">
            <span>${getEventTypeIcon(r.eventType)} ${r.title}</span>
            <span>${r.daysLeft === 0 ? '今天' : r.daysLeft + '天后'}</span>
        </div>
    `).join('');
}

function renderRecentMilestones() {
    const milestones = simpleRecords.filter(s => s.type === '大事记').sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,3);
    const container = document.getElementById('recentMilestones');
    if (milestones.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无大事记，点击📝记录重要时刻</div>';
        return;
    }
    container.innerHTML = milestones.map(m => `
        <div class="timeline-item">
            <span>📅 ${m.date}：${m.content}</span>
            <button class="delete-mini" onclick="deleteSimpleRecord(${m.id})">🗑️</button>
        </div>
    `).join('');
}

function renderAllMilestones() {
    const milestones = simpleRecords.filter(s => s.type === '大事记').sort((a,b) => new Date(b.date) - new Date(a.date));
    const container = document.getElementById('allMilestones');
    if (!container) return;
    if (milestones.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无大事记，点击📝记录重要时刻</div>';
        return;
    }
    container.innerHTML = milestones.map(m => `
        <div class="timeline-item">
            <span>📅 ${m.date}：${m.content} ${m.note ? `（${m.note}）` : ''}</span>
            <button class="delete-mini" onclick="deleteSimpleRecord(${m.id})">🗑️</button>
        </div>
    `).join('');
}

function renderDietCalendar() {
    const datesWithMeals = new Set(mealRecords.map(m => m.date));
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = '<div class="calendar-mini">';
    ['日','一','二','三','四','五','六'].forEach(d => { html += `<div class="calendar-weekday">${d}</div>`; });
    for (let i = 0; i < firstDay; i++) html += '<div></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const hasRecord = datesWithMeals.has(dateStr);
        html += `<div class="calendar-day ${hasRecord ? 'has-record' : ''}" onclick="showDailySummary('${dateStr}')">${d}</div>`;
    }
    html += '</div>';
    document.getElementById('dietCalendar').innerHTML = html;
}

function showDailySummary(date) {
    const meals = mealRecords.filter(m => m.date === date).sort((a,b) => a.time.localeCompare(b.time));
    const simple = simpleRecords.filter(s => s.date === date && s.type !== '大事记');
    
    if (meals.length === 0 && simple.length === 0) {
        document.getElementById('dailySummaryContent').innerHTML = '<div class="empty-state">当日无饮食记录</div>';
        document.getElementById('dailySummaryCard').style.display = 'block';
        return;
    }
    
    let totalWater = meals.reduce((sum, m) => sum + (m.water || 0), 0);
    let html = `<div><strong>${date}</strong> 共 ${meals.length} 餐，总饮水 ${totalWater}ml</div>`;
    meals.forEach(m => {
        html += `<div style="margin-top:8px;padding:8px;background:#F9FAFB;border-radius:12px;">
            <strong>${m.meal} ${m.time}</strong><br>
            ${m.mainFood ? `主食：${m.mainFood} ${m.mainWeight}g<br>` : ''}
            ${m.sideFood ? `辅食：${m.sideFood} ${m.sideWeight}g<br>` : ''}
            ${m.water ? `饮水：${m.water}ml<br>` : ''}
            ${m.note ? `📌 ${m.note}` : ''}
        </div>`;
    });
    simple.forEach(s => {
        const icon = s.type === '饮水' ? '💧' : '💩';
        html += `<div style="margin-top:8px;padding:8px;background:#F9FAFB;border-radius:12px;">
            ${icon} ${s.type}：${s.content} ${s.note ? `（${s.note}）` : ''}
        </div>`;
    });
    document.getElementById('dailySummaryContent').innerHTML = html;
    document.getElementById('dailySummaryCard').style.display = 'block';
}

function renderDietRecordsList() {
    const sorted = [...mealRecords].sort((a,b) => new Date(b.date) - new Date(a.date));
    const container = document.getElementById('dietRecordsList');
    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无饮食记录</div>';
        return;
    }
    const grouped = {};
    sorted.forEach(m => { grouped[m.date] = grouped[m.date] || []; grouped[m.date].push(m); });
    
    let html = '';
    Object.keys(grouped).sort().reverse().forEach(date => {
        html += `<div class="record-group"><div class="record-group-date" style="font-weight:600;margin:12px 0 8px;">📅 ${date}</div>`;
        grouped[date].forEach(m => {
            html += `<div class="record-item">
                <div style="flex:1">
                    <strong>${m.meal} ${m.time}</strong><br>
                    ${m.mainFood ? `主食：${m.mainFood} ${m.mainWeight}g<br>` : ''}
                    ${m.sideFood ? `辅食：${m.sideFood} ${m.sideWeight}g<br>` : ''}
                    ${m.water ? `饮水：${m.water}ml<br>` : ''}
                    ${m.note ? `<span class="timeline-note">📌 ${m.note}</span>` : ''}
                </div>
                <button class="delete-mini" onclick="deleteMealRecord(${m.id})">🗑️</button>
            </div>`;
        });
        html += `</div>`;
    });
    container.innerHTML = html;
}

function renderHealthRecords() {
    const sorted = [...healthEvents].sort((a,b) => new Date(b.date) - new Date(a.date));
    const container = document.getElementById('healthRecordsList');
    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无健康记录</div>';
        return;
    }
    container.innerHTML = sorted.map(e => `
        <div class="record-item">
            <div style="flex:1">
                <span>${getEventTypeIcon(e.eventType)} ${e.eventType}</span>
                <div><strong>${e.title}</strong></div>
                <div class="timeline-detail">${e.date} ${e.institution ? '@ ' + e.institution : ''}</div>
                ${e.note ? `<div class="timeline-note">📌 ${e.note}</div>` : ''}
            </div>
            <button class="delete-mini" onclick="deleteHealthEvent(${e.id})">🗑️</button>
        </div>
    `).join('');
}

function renderUpcomingReminders() {
    const today = new Date();
    const upcoming = healthEvents.filter(e => e.nextDueDate)
        .map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.nextDueDate) - today) / (1000*60*60*24)) }))
        .filter(e => e.daysLeft >= 0 && e.daysLeft <= 60)
        .sort((a,b) => a.daysLeft - b.daysLeft);
    const container = document.getElementById('upcomingReminders');
    if (upcoming.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无即将到来的提醒</div>';
        return;
    }
    container.innerHTML = upcoming.map(r => `
        <div class="reminder-item ${r.daysLeft <= 7 ? 'reminder-urgent' : ''}">
            <span>${getEventTypeIcon(r.eventType)} ${r.title}</span>
            <span>${r.daysLeft === 0 ? '今天' : r.daysLeft + '天后'}</span>
        </div>
    `).join('');
}

function renderGrowthRecords() {
    const growthList = [];
    weights.forEach(w => { growthList.push({ date: w.date, type: '体重', value: w.value, note: w.note, id: w.id }); });
    lengths.forEach(l => { growthList.push({ date: l.date, type: '体长', value: l.value, note: l.note, id: l.id }); });
    growthList.sort((a,b) => new Date(b.date) - new Date(a.date));
    const container = document.getElementById('growthRecordsList');
    if (growthList.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无成长记录</div>';
        return;
    }
    container.innerHTML = growthList.map(g => `
        <div class="record-item">
            <span>${g.date} ${g.type}: ${g.value}${g.type === '体重' ? 'kg' : 'cm'}</span>
            ${g.note ? `<span class="timeline-note">📌 ${g.note}</span>` : ''}
            <button class="delete-mini" onclick="deleteGrowthRecord('${g.type}', ${g.id})">🗑️</button>
        </div>
    `).join('');
}

function renderWeightChart() {
    const sorted = [...weights].sort((a,b) => new Date(a.date) - new Date(b.date));
    const ctx = document.getElementById('weightChart')?.getContext('2d');
    if (!ctx) return;
    if (weightChart) weightChart.destroy();
    if (sorted.length === 0) return;
    weightChart = new Chart(ctx, {
        type: 'line',
        data: { labels: sorted.map(w => w.date), datasets: [{ label: '体重 (kg)', data: sorted.map(w => w.value), borderColor: '#E11D48', tension: 0.3, fill: false }] },
        options: { responsive: true, maintainAspectRatio: true }
    });
}

function renderLengthChart() {
    const sorted = [...lengths].sort((a,b) => new Date(a.date) - new Date(b.date));
    const ctx = document.getElementById('lengthChart')?.getContext('2d');
    if (!ctx) return;
    if (lengthChart) lengthChart.destroy();
    if (sorted.length === 0) return;
    lengthChart = new Chart(ctx, {
        type: 'line',
        data: { labels: sorted.map(l => l.date), datasets: [{ label: '体长 (cm)', data: sorted.map(l => l.value), borderColor: '#10B981', tension: 0.3, fill: false }] },
        options: { responsive: true, maintainAspectRatio: true }
    });
}

function renderPetInfoForm() {
    document.getElementById('petName').value = petInfo.name || '';
    document.getElementById('petBirthday').value = petInfo.birthday || '';
    document.getElementById('petBirthplace').value = petInfo.birthplace || '';
    document.getElementById('petArrivalDate').value = petInfo.arrivalDate || '';
    document.getElementById('petFather').value = petInfo.father || '';
    document.getElementById('petMother').value = petInfo.mother || '';
    if (petInfo.birthday) {
        const age = calculateAge(petInfo.birthday);
        document.getElementById('petAge').innerText = age;
    }
}

function calculateAge(birthday) {
    const birth = new Date(birthday);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0) return `${months}个月`;
    return `${years}岁${months}个月`;
}

function renderInsurance() {
    const container = document.getElementById('insuranceInfo');
    if (!container) return;
    container.innerHTML = `
        <div class="insurance-item"><strong>险种：</strong> ${insurance.planName || '-'}</div>
        <div class="insurance-item"><strong>保险机构：</strong> ${insurance.provider || '-'}</div>
        <div class="insurance-item"><strong>保费：</strong> ${insurance.premium || '-'}</div>
        <div class="insurance-item"><strong>保险期：</strong> ${insurance.period || '-'}</div>
        <div class="insurance-item"><strong>理赔限额：</strong> ${insurance.coverage || '-'}</div>
        <div class="insurance-item"><strong>理赔渠道：</strong> ${insurance.channel || '-'}</div>
        <div class="insurance-item"><strong>赠送权益：</strong> ${insurance.bonus || '-'}</div>
        <div class="insurance-item"><strong>咨询电话：</strong> ${insurance.hotline || '-'}</div>
    `;
}

function renderTabooLists() {
    const absoluteContainer = document.getElementById('absoluteTaboo');
    const cautiousContainer = document.getElementById('cautiousTaboo');
    if (absoluteContainer) {
        absoluteContainer.innerHTML = foodTaboo.absolute.map(f => `
            <div class="taboo-item"><strong>${f.name}</strong><br>危害程度：${f.severity}<br>${f.effect}</div>
        `).join('');
    }
    if (cautiousContainer) {
        cautiousContainer.innerHTML = foodTaboo.cautious.map(f => `
            <div class="taboo-item"><strong>${f.name}</strong><br>危害程度：${f.severity}<br>${f.effect}</div>
        `).join('');
    }
}

function updateDataStats() {
    const total = mealRecords.length + simpleRecords.length + weights.length + lengths.length + healthEvents.length;
    document.getElementById('dataStats').innerText = `记录 ${total} 条`;
}

// ==================== 删除功能 ====================
function deleteMealRecord(id) {
    if (confirm('删除这条餐次记录？')) {
        mealRecords = mealRecords.filter(m => m.id !== id);
        saveAllData();
        renderAll();
    }
}
function deleteSimpleRecord(id) {
    if (confirm('删除这条记录？')) {
        simpleRecords = simpleRecords.filter(s => s.id !== id);
        saveAllData();
        renderAll();
    }
}
function deleteHealthEvent(id) {
    if (confirm('删除这条健康记录？')) {
        healthEvents = healthEvents.filter(e => e.id !== id);
        saveAllData();
        renderAll();
    }
}
function deleteGrowthRecord(type, id) {
    if (confirm('删除这条成长记录？')) {
        if (type === '体重') weights = weights.filter(w => w.id !== id);
        else lengths = lengths.filter(l => l.id !== id);
        saveAllData();
        renderAll();
    }
}

// ==================== 搜索功能 ====================
function searchDietRecords() {
    const keyword = document.getElementById('dietSearchInput').value.toLowerCase();
    if (!keyword.trim()) { renderDietRecordsList(); return; }
    const results = mealRecords.filter(m => 
        m.mainFood.toLowerCase().includes(keyword) ||
        m.sideFood.toLowerCase().includes(keyword) ||
        m.note.toLowerCase().includes(keyword)
    );
    const container = document.getElementById('dietSearchResults');
    if (results.length === 0) {
        container.innerHTML = '<div class="empty-state">未找到相关饮食记录</div>';
        return;
    }
    container.innerHTML = results.sort((a,b) => new Date(b.date) - new Date(a.date)).map(m => `
        <div class="search-result-item">
            <strong>${m.date} ${m.meal} ${m.time}</strong><br>
            ${m.mainFood ? `主食：${m.mainFood} ${m.mainWeight}g<br>` : ''}
            ${m.sideFood ? `辅食：${m.sideFood} ${m.sideWeight}g<br>` : ''}
            ${m.water ? `饮水：${m.water}ml<br>` : ''}
            ${m.note ? `📌 ${m.note}` : ''}
        </div>
    `).join('');
}
function clearDietSearch() {
    document.getElementById('dietSearchInput').value = '';
    document.getElementById('dietSearchResults').innerHTML = '';
    renderDietRecordsList();
}
function searchTaboo() {
    const keyword = document.getElementById('tabooSearchInput').value.toLowerCase();
    if (!keyword.trim()) { renderTabooLists(); return; }
    const absoluteResults = foodTaboo.absolute.filter(f => f.name.toLowerCase().includes(keyword));
    const cautiousResults = foodTaboo.cautious.filter(f => f.name.toLowerCase().includes(keyword));
    let html = '';
    if (absoluteResults.length) {
        html += `<h4 style="margin:8px 0">🚫 绝对禁止</h4>`;
        absoluteResults.forEach(f => { html += `<div class="taboo-item"><strong>${f.name}</strong><br>危害：${f.severity}<br>${f.effect}</div>`; });
    }
    if (cautiousResults.length) {
        html += `<h4 style="margin:8px 0">⚠️ 谨慎避免</h4>`;
        cautiousResults.forEach(f => { html += `<div class="taboo-item"><strong>${f.name}</strong><br>危害：${f.severity}<br>${f.effect}</div>`; });
    }
    if (!absoluteResults.length && !cautiousResults.length) html = '<div class="empty-state">未找到相关食物信息</div>';
    document.getElementById('tabooSearchResults').innerHTML = html;
}
function resetTabooSearch() {
    document.getElementById('tabooSearchInput').value = '';
    document.getElementById('tabooSearchResults').innerHTML = '';
    renderTabooLists();
}

// ==================== 表单提交 ====================
document.getElementById('healthForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newEvent = {
        id: Date.now(),
        eventType: document.getElementById('healthType').value,
        date: document.getElementById('healthDate').value,
        title: document.getElementById('healthTitle').value,
        institution: document.getElementById('healthInstitution').value,
        contact: document.getElementById('healthContact').value,
        nextDueDate: document.getElementById('healthNextDue').value,
        cost: parseFloat(document.getElementById('healthCost').value) || 0,
        note: document.getElementById('healthNote').value
    };
    healthEvents.push(newEvent);
    saveAllData();
    renderAll();
    document.getElementById('healthForm').reset();
    document.getElementById('healthDate').value = new Date().toISOString().slice(0,10);
    showMessage('健康事件已保存');
});

document.getElementById('growthForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('growthDate').value;
    const weightVal = document.getElementById('growthWeight').value;
    const lengthVal = document.getElementById('growthLength').value;
    const note = document.getElementById('growthNote').value;
    if (weightVal) weights.push({ id: Date.now(), date, value: parseFloat(weightVal), note });
    if (lengthVal) lengths.push({ id: Date.now()+1, date, value: parseFloat(lengthVal), note });
    saveAllData();
    renderAll();
    document.getElementById('growthForm').reset();
    document.getElementById('growthDate').value = new Date().toISOString().slice(0,10);
    showMessage('成长数据已保存');
});

document.getElementById('petInfoForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    petInfo = {
        name: document.getElementById('petName').value,
        birthday: document.getElementById('petBirthday').value,
        birthplace: document.getElementById('petBirthplace').value,
        arrivalDate: document.getElementById('petArrivalDate').value,
        father: document.getElementById('petFather').value,
        mother: document.getElementById('petMother').value
    };
    saveAllData();
    renderAll();
    showMessage('基础信息已保存');
});

// ==================== 备份功能 ====================
function exportBackup() {
    const backup = { mealRecords, simpleRecords, weights, lengths, healthEvents, petInfo, insurance };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wheat-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
}
function triggerImport() { document.getElementById('importFile').click(); }
function importBackup(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.mealRecords) mealRecords = data.mealRecords;
            if (data.simpleRecords) simpleRecords = data.simpleRecords;
            if (data.weights) weights = data.weights;
            if (data.lengths) lengths = data.lengths;
            if (data.healthEvents) healthEvents = data.healthEvents;
            if (data.petInfo) petInfo = data.petInfo;
            if (data.insurance) insurance = data.insurance;
            saveAllData();
            renderAll();
            showMessage('导入成功');
        } catch(err) { alert('备份文件格式错误'); }
    };
    reader.readAsText(file);
    input.value = '';
}
function clearAllData() {
    if (confirm('⚠️ 确定清空所有数据？不可恢复！')) {
        mealRecords = []; simpleRecords = []; weights = []; lengths = []; healthEvents = []; petInfo = {};
        insurance = getDefaultInsurance();
        saveAllData();
        renderAll();
        showMessage('所有数据已清空');
    }
}

// Tab 切换
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = `tab-${btn.dataset.tab}`;
        document.getElementById(tabId)?.classList.add('active');
        if (btn.dataset.tab === 'growth') setTimeout(() => { renderWeightChart(); renderLengthChart(); }, 100);
        // 隐藏饮食小计卡片
        const summaryCard = document.getElementById('dailySummaryCard');
        if (summaryCard) summaryCard.style.display = 'none';
    });
});
