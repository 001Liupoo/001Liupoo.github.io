* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #FEF2F2;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1F2937;
    padding-bottom: 30px;
}

/* ========== 密码锁 ========== */
.lock-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.lock-box {
    background: white;
    padding: 40px 30px;
    border-radius: 48px;
    text-align: center;
    width: 85%;
    max-width: 320px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.lock-icon {
    font-size: 64px;
    margin-bottom: 10px;
}

.lock-box h2 {
    color: #1F2937;
    margin-bottom: 8px;
}

.lock-box p {
    color: #6B7280;
    font-size: 14px;
    margin-bottom: 20px;
}

.lock-box input {
    width: 100%;
    padding: 14px;
    border: 1px solid #E5E7EB;
    border-radius: 40px;
    font-size: 16px;
    text-align: center;
    margin-bottom: 16px;
}

.lock-box button {
    width: 100%;
    padding: 14px;
    background: #E11D48;
    color: white;
    border: none;
    border-radius: 40px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.lock-error {
    color: #E11D48;
    font-size: 12px;
    margin-top: 10px;
}

/* ========== 主界面 ========== */
#mainApp {
    max-width: 800px;
    margin: 0 auto;
}

/* 顶部栏 */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: white;
    border-bottom: 1px solid #FEE2E2;
    position: sticky;
    top: 0;
    z-index: 100;
}

.top-bar h1 {
    font-size: 20px;
    color: #E11D48;
}

.top-actions {
    display: flex;
    gap: 12px;
}

.icon-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 6px;
}

/* Tab 导航 */
.tab-bar {
    display: flex;
    background: white;
    border-bottom: 1px solid #FEE2E2;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.tab-bar::-webkit-scrollbar {
    display: none;
}

.tab-btn {
    flex: 1;
    min-width: 70px;
    padding: 12px 8px;
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 500;
    color: #6B7280;
    cursor: pointer;
    white-space: nowrap;
}

.tab-btn.active {
    color: #E11D48;
    border-bottom: 2px solid #E11D48;
}

/* 内容区 */
.tab-content {
    display: none;
    padding: 16px;
}

.tab-content.active {
    display: block;
}

.container {
    max-width: 600px;
    margin: 0 auto;
}

/* ========== 首页样式 ========== */
.welcome-card {
    background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
    color: white;
    padding: 20px;
    border-radius: 32px;
    margin-bottom: 20px;
    box-shadow: 0 8px 20px rgba(225,29,72,0.2);
}

.welcome-text h2 {
    font-size: 20px;
    margin-bottom: 4px;
}

.welcome-text p {
    font-size: 14px;
    opacity: 0.9;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
}

.stat-card {
    background: white;
    padding: 16px 8px;
    border-radius: 24px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-number {
    font-size: 28px;
    font-weight: bold;
    color: #E11D48;
}

.stat-label {
    font-size: 12px;
    color: #6B7280;
    margin-top: 4px;
}

.quick-entry {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 24px;
}

.quick-btn-large {
    background: white;
    border: none;
    padding: 12px 0;
    border-radius: 48px;
    font-weight: 600;
    font-size: 14px;
    color: #E11D48;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: all 0.2s;
}

.quick-btn-large:active {
    transform: scale(0.96);
}

/* 通用卡片 */
.form-card, .records-card, .reminder-card, .timeline-card, 
.calendar-card, .chart-card, .knowledge-card, .tips-card, 
.info-card, .search-card, .milestone-card {
    background: white;
    border-radius: 24px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

h3 {
    font-size: 16px;
    margin-bottom: 16px;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* 表单 */
.form-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
}

.form-row label {
    width: 70px;
    font-size: 14px;
    color: #4B5563;
    font-weight: 500;
}

.form-row input, .form-row select, .form-row textarea {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #E5E7EB;
    border-radius: 16px;
    font-size: 14px;
    font-family: inherit;
}

.btn-primary {
    width: 100%;
    padding: 12px;
    background: #E11D48;
    color: white;
    border: none;
    border-radius: 40px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
}

.btn-secondary {
    padding: 8px 16px;
    background: #FEF2F2;
    color: #E11D48;
    border: 1px solid #FECACA;
    border-radius: 40px;
    font-size: 14px;
    cursor: pointer;
}

.btn-danger {
    padding: 8px 16px;
    background: #FEF2F2;
    color: #DC2626;
    border: 1px solid #FECACA;
    border-radius: 40px;
    font-size: 14px;
    cursor: pointer;
}

.button-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 12px;
}

/* 搜索框 */
.search-box {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.search-box input {
    flex: 1;
    padding: 12px;
    border: 1px solid #E5E7EB;
    border-radius: 40px;
    font-size: 14px;
}

.search-box button {
    padding: 8px 16px;
    white-space: nowrap;
    margin-top: 0;
    width: auto;
}

.search-results {
    margin-top: 12px;
    max-height: 300px;
    overflow-y: auto;
}

.search-result-item {
    background: #F9FAFB;
    padding: 12px;
    border-radius: 16px;
    margin-bottom: 8px;
    font-size: 14px;
}

/* 时间线 */
.timeline-list, .records-list, .reminder-list, .milestone-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.timeline-item, .record-item {
    padding: 12px;
    background: #F9FAFB;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

.timeline-meal {
    font-weight: 600;
    color: #E11D48;
    margin-bottom: 6px;
}

.timeline-detail {
    font-size: 13px;
    color: #4B5563;
    margin-left: 8px;
}

.timeline-note {
    font-size: 12px;
    color: #6B7280;
    margin-top: 4px;
}

.delete-mini {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #FCA5A5;
}

/* 提醒卡片 */
.reminder-item {
    padding: 12px;
    background: #FEF3C7;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.reminder-urgent {
    background: #FEE2E2;
    color: #DC2626;
}

/* 日历 */
.calendar-mini {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    text-align: center;
}

.calendar-weekday {
    font-size: 12px;
    color: #9CA3AF;
    padding: 6px;
}

.calendar-day {
    padding: 8px 4px;
    font-size: 13px;
    border-radius: 30px;
    background: #F9FAFB;
}

.calendar-day.has-record {
    background: #FEF2F2;
    color: #E11D48;
    font-weight: bold;
}

/* 知识库 */
.taboo-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.taboo-item {
    padding: 10px;
    background: #F9FAFB;
    border-radius: 16px;
    font-size: 13px;
}

.taboo-item strong {
    color: #E11D48;
}

/* 空状态 */
.empty-state {
    text-align: center;
    padding: 30px;
    color: #9CA3AF;
    font-size: 14px;
}

/* 弹窗 */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 400px;
    border-radius: 32px;
    padding: 24px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content .close {
    float: right;
    font-size: 24px;
    cursor: pointer;
    color: #9CA3AF;
}

/* 响应式 */
@media (max-width: 480px) {
    .form-row {
        flex-direction: column;
        align-items: stretch;
    }
    .form-row label {
        width: auto;
    }
    .quick-entry {
        grid-template-columns: repeat(4, 1fr);
    }
    .quick-btn-large {
        font-size: 12px;
        padding: 10px 0;
    }
}
