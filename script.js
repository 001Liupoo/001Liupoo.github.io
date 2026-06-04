// ==================== 全局变量 ====================
let records = [];           // 日常记录（饮食、饮水、便便、大事记）
let weights = [];           // 体重记录
let lengths = [];           // 体长记录
let healthEvents = [];      // 健康事件（疫苗、驱虫、洗护、就医、手术）
let petInfo = {};           // 宠物基础信息
let insurance = {};         // 医保信息

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

// 养狗小贴士库
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
    setupEventListeners();
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
        bonus: "体外驱虫药1支、宠物联苗