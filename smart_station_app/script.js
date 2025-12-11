// Mock Data
const busData = [
    { id: '304', dest: 'Centerville', platform: '2', time: '10:45 AM', status: 'On Time' },
    { id: '512', dest: 'West End', platform: '4', time: '11:00 AM', status: 'Delayed' },
    { id: '101', dest: 'Airport', platform: '1', time: '11:15 AM', status: 'Boarding' },
    { id: '405', dest: 'Tech Park', platform: '3', time: '11:30 AM', status: 'On Time' }
];

const crowdLevels = [
    { bus: '304', level: 80, label: 'High' }, // High density
    { bus: '512', level: 30, label: 'Low' },
    { bus: '101', level: 60, label: 'Med' },
    { bus: '405', level: 20, label: 'Low' }
];

// Intialize
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    renderSchedule();
    renderCrowd();
    setInterval(updateTime, 1000);
});

// Time Update
function updateTime() {
    const now = new Date();
    document.getElementById('current-time').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Tab Switching
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    // Show target tab
    document.getElementById(tabId).classList.add('active');

    // Update Sidebar Active State
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Update Header Title
    const titles = {
        'dashboard': 'Live Dashboard',
        'crowd': 'Crowd & Safety',
        'map': 'Station Map',
        'tickets': 'E-Tickets'
    };
    document.getElementById('page-title').innerText = titles[tabId];
}

// Render Dashboard Schedule
function renderSchedule() {
    const tbody = document.getElementById('bus-schedule-body');
    tbody.innerHTML = '';

    busData.forEach(bus => {
        const row = `
            <tr>
                <td><i class="fa-solid fa-bus"></i> ${bus.id}</td>
                <td>${bus.dest}</td>
                <td><span class="badge">PF-${bus.platform}</span></td>
                <td style="color: ${getStatusColor(bus.status)}">${bus.status}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function getStatusColor(status) {
    if (status === 'On Time') return '#22c55e';
    if (status === 'Delayed') return '#ef4444';
    if (status === 'Boarding') return '#eab308';
    return '#fff';
}

// Render Crowd Visualizer
function renderCrowd() {
    const container = document.getElementById('crowd-visualizer');
    container.innerHTML = '';

    crowdLevels.forEach(item => {
        const height = item.level + '%';
        let colorClass = 'low';
        if (item.level > 40) colorClass = 'medium';
        if (item.level > 70) colorClass = 'high';

        const bar = document.createElement('div');
        bar.className = `bar ${colorClass}`;
        bar.style.height = height;
        bar.setAttribute('data-label', `Bus ${item.bus}`);
        container.appendChild(bar);
    });
}

// SOS Logic
function triggerSOS() {
    const status = document.getElementById('sos-status');
    const btn = document.querySelector('.sos-btn');

    status.classList.remove('hidden');
    // Flash button
    let isRed = true;
    const interval = setInterval(() => {
        btn.style.background = isRed ? '#b91c1c' : '#ef4444';
        isRed = !isRed;
    }, 200);

    setTimeout(() => {
        clearInterval(interval);
        status.innerText = "Security has been deployed to your location.";
    }, 3000);
}

// Audio Guidance
let audioEnabled = false;
function toggleAudio() {
    audioEnabled = !audioEnabled;
    const btn = document.getElementById('audioBtn');

    if (audioEnabled) {
        btn.style.background = 'rgba(99, 102, 241, 0.5)';
        speak("Audio guide enabled. You are currently at the main dashboard.");
    } else {
        btn.style.background = 'rgba(255,255,255,0.05)';
        window.speechSynthesis.cancel();
    }
}

function announceLocation() {
    if (!audioEnabled) {
        alert("Please enable Voice Guide first.");
        return;
    }
    speak("You are currently located near the Waiting Area, approximately 20 meters from Platform 1.");
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }
}

// Ticket Generation
function generateTicket(e) {
    e.preventDefault();
    const dest = document.getElementById('dest-select').value;
    const pax = document.getElementById('passenger-count').value;

    if (!dest) return;

    const ticketHTML = `
        <div class="ticket-card">
            <div class="ticket-header">
                <h2>SMART TICKET</h2>
                <span>#${Math.floor(Math.random() * 90000) + 10000}</span>
            </div>
            <div class="ticket-body">
                <p><strong>To:</strong> ${dest}</p>
                <p><strong>Passengers:</strong> ${pax}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <div style="margin-top: 1rem; text-align: center;">
                    <i class="fa-solid fa-qrcode" style="font-size: 4rem;"></i>
                    <p style="font-size: 0.8rem; color: #555;">Scan at Gate</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('ticket-result').innerHTML = ticketHTML;
}
