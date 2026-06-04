// ==================== 全局变量 ====================
let records = [];
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
    records = JSON.parse(localStorage.getItem('wheat_records') || '[]');
    weights = JSON.parse(localStorage.getItem('wheat_weights') || '[]');
    lengths = JSON.parse(localStorage.getItem('wheat_lengths') || '[]');
    healthEvents = JSON.parse(localStorage.getItem('wheat_healthEvents') || '[]');
    petInfo = JSON.parse(localStorage.getItem('wheat_petInfo') || '{}');
    insurance = JSON.parse(localStorage.getItem('wheat_insurance') || getDefaultInsurance());
}

function saveAllData() {
    localStorage.setItem('wheat_records', JSON.stringify(records));
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
        coverage: "每次门诊限额1200元，手术限额2000元，定点医院赔付70%，非定点医院赔付40%",
        channel: "支付宝在线理赔或众安保险APP",
        bonus: "体外驱虫药1支、宠物联苗1支、免费宠物医师咨询4008299958",
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
    
    if (oldPwd !== currentPassword) {
        alert('当前密码错误');
        return;
    }
    if (newPwd !== confirmPwd) {
        alert('两次输入的新密码不一致');
        return;
    }
    if (newPwd.length < 4) {
        alert('密码长度至少4位');
        return;
    }
    
    currentPassword = newPwd;
    localStorage.setItem('petPassword', newPwd);
    alert('密码修改成功');
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// ==================== 辅助函数 ====================
function getTypeIcon(type) {
    const icons = { '主食': '🍖', '辅食': '🍗', '饮水': '💧', '便便': '💩', '大事记': '📝' };
    return icons[type] || '📌';
}

function getEventTypeIcon(type) {
    const icons = { '疫苗': '💉', '驱虫': '🪱', '洗护': '🛁', '就医': '🏥', '手术': '🔪' };
    return icons[type] || '📌';
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

// ==================== 渲染所有模块 ====================
function renderAll() {
    renderToday();
    renderDietRecords();
    renderDietCalendar();
    renderHealthRecords();
    renderUpcomingReminders();
    renderGrowthRecords();
    renderWeightChart();
    renderLengthChart();
    renderPetInfoForm();
    renderInsurance();
    renderTabooKnowledge();
    updateDataStats();
}

function renderToday() {
    const today = new Date().toISOString().slice(0,10);
    const todayRecords = records.filter(r => r.date === today).sort((a,b) => (b.time || '').localeCompare(a.time || ''));
    
    const timelineElem = document.getElementById('todayTimeline');
    if (!timelineElem) return;
    if (todayRecords.length === 0) {
        timelineElem.innerHTML = '<div class="empty-state">✨ 今天还没有记录，点击上方按钮添加</div>';
    } else {
        timelineElem.innerHTML = todayRecords.map(r => `
            <div class="timeline-item">
                <span class="timeline-time">${r.time || '全天'}</span>
                <span class="timeline-content">${getTypeIcon(r.type)} ${r.content}</span>
                ${r.note ? `<span class="timeline-note">📌 ${r.note}</span>` : ''}
                <button class="delete-mini" onclick="deleteRecord(${r.id})">🗑️</button>
            </div>
        `).join('');
    }
    
    const reminders = [];
    const todayDate = new Date();
    healthEvents.forEach(e => {
        if (e.nextDueDate) {
            const dueDate = new Date(e.nextDueDate);
            const daysLeft = Math.ceil((dueDate - todayDate) / (1000*60*60*24));
            if (daysLeft >= 0 && daysLeft <= 30) {
                reminders.push({ ...e, daysLeft });
            }
        }
    });
    
    const reminderElem = document.getElementById('todayReminders');
    if (reminderElem) {
        if (reminders.length === 0) {
            reminderElem.innerHTML = '<div class="empty-state">暂无近期提醒</div>';
        } else {
            reminderElem.innerHTML = reminders.map(r => `
                <div class="reminder-item ${r.daysLeft <= 7 ? 'reminder-urgent' : ''}">
                    <span>${getEventTypeIcon(r.eventType)} ${r.title}</span>
                    <span>${r.daysLeft === 0 ? '今天' : r.daysLeft + '天后'}</span>
                </div>
            `).join('');
        }
    }
}

function renderDietRecords() {
    const dietRecords = records.filter(r => ['主食','辅食','饮水'].includes(r.type))
        .sort((a,b) => new Date(b.date) - new Date(a.date));
    
    const container = document.getElementById('dietRecordsList');
    if (!container) return;
    if (dietRecords.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无饮食记录</div>';
        return;
    }
    
    const grouped = {};
    dietRecords.forEach(r => { grouped[r.date] = grouped[r.date] || []; grouped[r.date].push(r); });
    
    container.innerHTML = Object.keys(grouped).sort().reverse().map(date => `
        <div class="record-group">
            <div class="record-group-date">📅 ${date}</div>
            ${grouped[date].map(r => `
                <div class="record-item">
                    <span>${getTypeIcon(r.type)} ${r.content}</span>
                    <span class="record-meta">${r.time || ''} ${r.note ? `📌 ${r.note}` : ''}</span>
                    <button class="delete-mini" onclick="deleteRecord(${r.id})">🗑️</button>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function renderDietCalendar() {
    const datesWithRecords = new Set(records.filter(r => ['主食','辅食','饮水'].includes(r.type)).map(r => r.date));
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
        const hasRecord = datesWithRecords.has(dateStr);
        html += `<div class="calendar-day ${hasRecord ? 'has-record' : ''}">${d}</div>`;
    }
    html += '</div>';
    const container = document.getElementById('dietCalendar');
    if (container) container.innerHTML = html;
}

function renderHealthRecords() {
    const sorted = [...healthEvents].sort((a,b) => new Date(b.date) - new Date(a.date));
    const container = document.getElementById('healthRecordsList');
    if (!container) return;
    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无健康记录</div>';
        return;
    }
    
    container.innerHTML = sorted.map(e => `
        <div class="record-item">
            <div>
                <span class="health-type">${getEventTypeIcon(e.eventType)} ${e.eventType}</span>
                <div><strong>${e.title}</strong></div>
                <div class="record-meta">${e.date} ${e.institution ? '@ ' + e.institution : ''}</div>
                ${e.note ? `<div class="record-meta">📌 ${e.note}</div>` : ''}
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
    if (!container) return;
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
    if (!container) return;
    if (growthList.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无成长记录</div>';
        return;
    }
    
    container.innerHTML = growthList.map(g => `
        <div class="record-item">
            <span>${g.date} ${g.type}: ${g.value}${g.type === '体重' ? 'kg' : 'cm'}</span>
            ${g.note ? `<span class="record-meta">📌 ${g.note}</span>` : ''}
            <button class="delete-mini" onclick="deleteGrowthRecord('${g.type}', ${g.id})">🗑️</button>
        </div>
    `).join('');
}

function renderWeightChart() {
    const sorted = [...weights].sort((a,b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map(w => w.date);
    const data = sorted.map(w => w.value);
    
    const ctx = document.getElementById('weightChart')?.getContext('2d');
    if (!ctx) return;
    
    if (weightChart) weightChart.destroy();
    weightChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: '体重 (kg)', data, borderColor: '#E11D48', tension: 0.3, fill: false }] },
        options: { responsive: true, maintainAspectRatio: true }
    });
}

function renderLengthChart() {
    const sorted = [...lengths].sort((a,b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map(l => l.date);
    const data = sorted.map(l => l.value);
    
    const ctx = document.getElementById('lengthChart')?.getContext('2d');
    if (!ctx) return;
    
    if (lengthChart) lengthChart.destroy();
    lengthChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: '体长 (cm)', data, borderColor: '#10B981', tension: 0.3, fill: false }] },
        options: { responsive: true, maintainAspectRatio: true }
    });
}

function renderPetInfoForm() {
    const nameInput = document.getElementById('petName');
    if (nameInput) nameInput.value = petInfo.name || '';
    const birthdayInput = document.getElementById('petBirthday');
    if (birthdayInput) birthdayInput.value = petInfo.birthday || '';
    const birthplaceInput = document.getElementById('petBirthplace');
    if (birthplaceInput) birthplaceInput.value = petInfo.birthplace || '';
    const arrivalInput = document.getElementById('petArrivalDate');
    if (arrivalInput) arrivalInput.value = petInfo.arrivalDate || '';
    const fatherInput = document.getElementById('petFather');
    if (fatherInput) fatherInput.value = petInfo.father || '';
    const motherInput = document.getElementById('petMother');
    if (motherInput) motherInput.value = petInfo.mother || '';
    
    if (petInfo.birthday) {
        const age = calculateAge(petInfo.birthday);
        const ageSpan = document.getElementById('petAge');
        if (ageSpan) ageSpan.innerText = age;
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
        <div class="insurance-item"><strong>险种：</strong>${insurance.planName || '-'}</div>
        <div class="insurance-item"><strong>机构：</strong>${insurance.provider || '-'}</div>
        <div class="insurance-item"><strong>保费：</strong>${insurance.premium || '-'}</div>
        <div class="insurance-item"><strong>保险期：</strong>${insurance.period || '-'}</div>
        <div class="insurance-item"><strong>理赔限额：</strong>${insurance.coverage || '-'}</div>
        <div class="insurance-item"><strong>理赔渠道：</strong>${insurance.channel || '-'}</div>
        <div class="insurance-item"><strong>赠送权益：</strong>${insurance.bonus || '-'}</div>
        <div class="insurance-item"><strong>咨询电话：</strong>${insurance.hotline || '-'}</div>
    `;
}

function renderTabooKnowledge() {
    renderTabooTable('absoluteTaboo', foodTaboo.absolute);
    renderTabooTable('cautiousTaboo', foodTaboo.cautious);
    
    const searchInput = document.getElementById('tabooSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            if (!keyword) {
                renderTabooTable('absoluteTaboo', foodTaboo.absolute);
                renderTabooTable('cautiousTaboo', foodTaboo.cautious);
                return;
            }
            const filteredAbsolute = foodTaboo.absolute.filter(f => f.name.toLowerCase().includes(keyword));
            const filteredCautious = foodTaboo.cautious.filter(f => f.name.toLowerCase().includes(keyword));
            renderTabooTable('absoluteTaboo', filteredAbsolute);
            renderTabooTable('cautiousTaboo', filteredCautious);
        });
    }
}

function renderTabooTable(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (data.length === 0) {
        container.innerHTML = '<div class="empty-state">未找到相关食物</div>';
        return;
    }
    container.innerHTML = `
        <div class="taboo-row taboo-header">
            <span>食物名称</span>
            <span>危害程度</span>
            <span>主要危害</span>
        </div>
        ${data.map(item => `
            <div class="taboo-row">
                <span>${item.name}</span>
                <span>${item.severity}</span>
                <span>${item.effect}</span>
            </div>
        `).join('')}
    `;
}

function updateDataStats() {
    const totalRecords = records.length + weights.length + lengths.length + healthEvents.length;
    const statsElem = document.getElementById('dataStats');
    if (statsElem) statsElem.innerText = `记录 ${totalRecords} 条`;
}

// ==================== 表单提交事件 ====================
function setupEventListeners() {
    // 饮食表单
    const dietForm = document.getElementById('dietForm');
    if (dietForm) {
        dietForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const date = document.getElementById('dietDate').value;
            const time = document.getElementById('dietTime').value;
            const mainFood = document.getElementById('mainFood').value;
            const mainWeight = document.getElementById('mainFoodWeight').value;
            const sideFood = document.getElementById('sideFood').value;
            const sideWeight = document.getElementById('sideFoodWeight').value;
            const waterAmount = document.getElementById('waterAmount').value;
            const note = document.getElementById('dietNote').value;
            
            if (mainFood && mainWeight) {
                records.push({ id: Date.now(), date, type: '主食', content: `${mainFood} ${mainWeight}g`, note, time });
            }
            if (sideFood && sideWeight) {
                records.push({ id: Date.now()+1, date, type: '辅食', content: `${sideFood} ${sideWeight}g`, note, time });
            }
            if (waterAmount) {
                records.push({ id: Date.now()+2, date, type: '饮水', content: `饮水 ${waterAmount}ml`, note, time });
            }
            saveAllData();
            renderAll();
            dietForm.reset();
            document.getElementById('dietDate').value = new Date().toISOString().slice(0,10);
            alert('保存成功');
        });
    }
    
    // 健康表单
    const healthForm = document.getElementById('healthForm');
    if (healthForm) {
        healthForm.addEventListener('submit', (e) => {
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
            healthForm.reset();
            document.getElementById('healthDate').value = new Date().toISOString().slice(0,10);
            alert('保存成功');
        });
    }
    
    // 成长表单
    const growthForm = document.getElementById('growthForm');
    if (growthForm) {
        growthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const date = document.getElementById('growthDate').value;
            const weightVal = document.getElementById('growthWeight').value;
            const lengthVal = document.getElementById('growthLength').value;
            const note = document.getElementById('growthNote').value;
            
            if (weightVal) weights.push({ id: Date.now(), date, value: parseFloat(weightVal), note });
            if (lengthVal) lengths.push({ id: Date.now()+1, date, value: parseFloat(lengthVal), note });
            saveAllData();
            renderAll();
            growthForm.reset();
            document.getElementById('growthDate').value = new Date().toISOString().slice(0,10);
            alert('保存成功');
        });
    }
    
    // 宠物信息表单
    const petInfoForm = document.getElementById('petInfoForm');
    if (petInfoForm) {
        petInfoForm.addEventListener('submit', (e) => {
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
            alert('基础信息已保存');
        });
    }
    
    // Tab 切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = `tab-${btn.dataset.tab}`;
            const tabContent = document.getElementById(tabId);
            if (tabContent) tabContent.classList.add('active');
            if (btn.dataset.tab === 'growth') {
                setTimeout(() => { renderWeightChart(); renderLengthChart(); }, 100);
            }
        });
    });
}

// ==================== 删除功能 ====================
function deleteRecord(id) {
    if (confirm('确定删除这条记录吗？')) {
        records = records.filter(r => r.id !== id);
        saveAllData();
        renderAll();
    }
}

function deleteHealthEvent(id) {
    if (confirm('确定删除这条健康记录吗？')) {
        healthEvents = healthEvents.filter(e => e.id !== id);
        saveAllData();
        renderAll();
    }
}

function deleteGrowthRecord(type, id) {
    if (confirm('确定删除这条成长记录吗？')) {
        if (type === '体重') weights = weights.filter(w => w.id !== id);
        else lengths = lengths.filter(l => l.id !== id);
        saveAllData();
        renderAll();
    }
}

// ==================== 备份功能 ====================
function exportBackup() {
    const backup = { records, weights, lengths, healthEvents, petInfo, insurance };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wheat-diary-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
}

function triggerImport() {
    document.getElementById('importFile').click();
}

function importBackup(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.records) records = data.records;
            if (data.weights) weights = data.weights;
            if (data.lengths) lengths = data.lengths;
            if (data.healthEvents) healthEvents = data.healthEvents;
            if (data.petInfo) petInfo = data.petInfo;
            if (data.insurance) insurance = data.insurance;
            saveAllData();
            renderAll();
            alert('导入成功');
        } catch (err) {
            alert('备份文件格式错误');
        }
    };
    reader.readAsText(file);
    input.value = '';
}

function clearAllData() {
    if (confirm('⚠️ 确定要清空所有数据吗？此操作不可恢复！')) {
        if (confirm('再次确认：真的要清空所有记录吗？')) {
            records = [];
            weights = [];
            lengths = [];
            healthEvents = [];
            petInfo = {};
            insurance = getDefaultInsurance();
            saveAllData();
            renderAll();
            alert('所有数据已清空');
        }
    }
}

function editInsurance() {
    document.getElementById('insPlanName').value = insurance.planName || '';
    document.getElementById('insProvider').value = insurance.provider || '';
    document.getElementById('insPremium').value = insurance.premium || '';
    document.getElementById('insPeriod').value = insurance.period || '';
    document.getElementById('insCoverage').value = insurance.coverage || '';
    document.getElementById('insChannel').value = insurance.channel || '';
    document.getElementById('insBonus').value = insurance.bonus || '';
    document.getElementById('insHotline').value = insurance.hotline || '';
    document.getElementById('insuranceModal').style.display = 'flex';
}

function closeInsuranceModal() {
    document.getElementById('insuranceModal').style.display = 'none';
}

const insuranceForm = document.getElementById('insuranceForm');
if (insuranceForm) {
    insuranceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        insurance = {
            planName: document.getElementById('insPlanName').value,
            provider: document.getElementById('insProvider').value,
            premium: document.getElementById('insPremium').value,
            period: document.getElementById('insPeriod').value,
            coverage: document.getElementById('insCoverage').value,
            channel: document.getElementById('insChannel').value,
            bonus: document.getElementById('insBonus').value,
            hotline: document.getElementById('insHotline').value
        };
        saveAllData();
        renderInsurance();
        closeInsuranceModal();
        alert('医保信息已保存');
    });
}

function openRecordModal(type) {
    document.getElementById('recordType').value = type;
    document.getElementById('recordModalTitle').innerText = `添加${type}`;
    document.getElementById('recordDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('recordContent').value = '';
    document.getElementById('recordNote').value = '';
    document.getElementById('recordModal').style.display = 'flex';
}

function closeRecordModal() {
    document.getElementById('recordModal').style.display = 'none';
}

const recordModalForm = document.getElementById('recordModalForm');
if (recordModalForm) {
    recordModalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('recordType').value;
        const date = document.getElementById('recordDate').value;
        const content = document.getElementById('recordContent').value;
        const note = document.getElementById('recordNote').value;
        if (!content) { alert('请填写内容'); return; }
        records.push({ id: Date.now(), date, type, content, note });
        saveAllData();
        renderAll();
        closeRecordModal();
        alert('保存成功');
    });
}

function openWeightModal() {
    document.getElementById('weightRecordDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('weightRecordValue').value = '';
    document.getElementById('weightModal').style.display = 'flex';
}

function closeWeightModal() {
    document.getElementById('weightModal').style.display = 'none';
}

const weightModalForm = document.getElementById('weightModalForm');
if (weightModalForm) {
    weightModalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('weightRecordDate').value;
        const value = parseFloat(document.getElementById('weightRecordValue').value);
        if (!value) { alert('请输入体重'); return; }
        weights.push({ id: Date.now(), date, value });
        saveAllData();
        renderAll();
        closeWeightModal();
        alert('体重已记录');
    });
}

setupEventListeners();
