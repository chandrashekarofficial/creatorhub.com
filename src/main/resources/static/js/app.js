let token = localStorage.getItem("creatorhub_token");

const loginPage = document.getElementById("loginPage");
const dashboardApp = document.getElementById("dashboardApp");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");


// ===============================
// API HELPER
// ===============================

async function apiRequest(url, options = {}) {

    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    loginError.textContent = "";

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {

        const result = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        if (!result.ok) {
            throw new Error("Invalid email or password.");
        }

        const data = await result.json();

        token = data.token;

        localStorage.setItem("creatorhub_token", token);

        showApp();

        loadDashboard();

    } catch (error) {

        loginError.textContent = error.message;
    }
});


// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener("click", logout);

function logout() {

    token = null;

    localStorage.removeItem("creatorhub_token");

    dashboardApp.classList.add("d-none");
    loginPage.classList.remove("d-none");
}


// ===============================
// SHOW APP
// ===============================

function showApp() {

    loginPage.classList.add("d-none");
    dashboardApp.classList.remove("d-none");
}


// ===============================
// DASHBOARD
// ===============================

async function loadDashboard() {

    const container =
        document.getElementById("dashboardCards");

    container.innerHTML =
        `<div class="loading">Loading dashboard...</div>`;

    try {

        const data =
            await apiRequest("/api/dashboard");
const videos =
    await apiRequest("/api/videos");

renderPerformanceChart(videos);
renderEngagementChart(videos);
        const cards = [

            ["Total Videos", data.totalVideos],

            ["Total Views", data.totalViews],

            ["Total Likes", data.totalLikes],

            ["Comments", data.totalComments],

            ["Shares", data.totalShares],

            ["Average CTR", `${data.averageCtr}%`],

            ["Engagement", `${Number(data.averageEngagement).toFixed(1)}%`],

            ["Content Ideas", data.totalContentIdeas],

            ["Calendar Events", data.totalCalendarEvents],

            ["SEO Records", data.totalSeoRecords],

            ["Reports", data.totalReports]
        ];

        container.innerHTML = cards.map(card => `

            <div class="col-sm-6 col-lg-3">

                <div class="stat-card">

                    <h6>${card[0]}</h6>

                    <h3>${card[1]}</h3>

                </div>

            </div>

        `).join("");

    } catch (error) {

        container.innerHTML =
            `<div class="error-message">${error.message}</div>`;
    }
}


// ===============================
// VIDEOS
// ===============================

async function loadVideos() {

    const container =
        document.getElementById("videosContainer");

    container.innerHTML =
        `<div class="loading">Loading videos...</div>`;

    try {

        const videos =
            await apiRequest("/api/videos");

        if (!videos || videos.length === 0) {

            container.innerHTML =
                `<div class="data-card">No videos found.</div>`;

            return;
        }

        container.innerHTML = `

            <div class="data-card">

                <div class="table-responsive">

                    <table class="table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Views</th>
                                <th>Likes</th>
                                <th>Comments</th>
                                <th>CTR</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${videos.map(video => `

                                <tr>

                                    <td>${video.videoId}</td>

                                    <td>${video.title}</td>

                                    <td>${video.views}</td>

                                    <td>${video.likes}</td>

                                    <td>${video.comments}</td>

                                    <td>${video.ctr}%</td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        container.innerHTML =
            `<div class="error-message">${error.message}</div>`;
    }
}


// ===============================
// CONTENT IDEAS
// ===============================

async function loadContent() {

    const container =
        document.getElementById("contentContainer");

    container.innerHTML =
        `<div class="loading">Loading content ideas...</div>`;

    try {

        const content =
            await apiRequest("/api/content");

        if (!content || content.length === 0) {

            container.innerHTML =
                `<div class="data-card">No content ideas found.</div>`;

            return;
        }

        container.innerHTML = `

            <div class="data-card">

                <div class="table-responsive">

                    <table class="table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${content.map(item => `

                                <tr>

                                    <td>${item.ideaId}</td>

                                    <td>${item.title}</td>

                                    <td>${item.category}</td>

                                    <td>${item.status}</td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        container.innerHTML =
            `<div class="error-message">${error.message}</div>`;
    }
}


// ===============================
// CALENDAR
// ===============================

async function loadCalendar() {

    const container =
        document.getElementById("calendarContainer");

    container.innerHTML =
        `<div class="loading">Loading calendar...</div>`;

    try {

        const events =
            await apiRequest("/api/calendar");

        if (!events || events.length === 0) {

            container.innerHTML =
                `<div class="data-card">No calendar events found.</div>`;

            return;
        }

        container.innerHTML = `

            <div class="data-card">

                <div class="table-responsive">

                    <table class="table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Content ID</th>
                                <th>Date</th>
                                <th>Type</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${events.map(event => `

                                <tr>

                                    <td>${event.eventId}</td>

                                    <td>${event.contentId}</td>

                                    <td>${event.eventDate}</td>

                                    <td>${event.eventType}</td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        container.innerHTML =
            `<div class="error-message">${error.message}</div>`;
    }
}


// ===============================
// SEO
// ===============================

async function loadSeo() {

    const container =
        document.getElementById("seoContainer");

    container.innerHTML =
        `<div class="loading">Loading SEO data...</div>`;

    try {

        const seo =
            await apiRequest("/api/seo");

        if (!seo || seo.length === 0) {

            container.innerHTML =
                `<div class="data-card">No SEO records found.</div>`;

            return;
        }

        container.innerHTML = seo.map(item => `

            <div class="data-card mb-3">

                <h5>SEO #${item.seoId}</h5>

                <p>
                    <strong>Content ID:</strong>
                    ${item.contentId}
                </p>

                <p>
                    <strong>Keywords:</strong>
                    ${item.keywords}
                </p>

                <p>
                    <strong>Hashtags:</strong>
                    ${item.hashtags}
                </p>

                <p class="mb-0">
                    <strong>Description:</strong>
                    ${item.description}
                </p>

            </div>

        `).join("");

    } catch (error) {

        container.innerHTML =
            `<div class="error-message">${error.message}</div>`;
    }
}


// ===============================
// REPORTS
// ===============================

async function loadReports() {

    const container =
        document.getElementById("reportsContainer");

    container.innerHTML =
        `<div class="loading">Loading reports...</div>`;

    try {

        const reports =
            await apiRequest("/api/reports");

        if (!reports || reports.length === 0) {

            container.innerHTML =
                `<div class="data-card">No reports found.</div>`;

            return;
        }

        container.innerHTML = `

            <div class="data-card">

                <div class="table-responsive">

                    <table class="table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Month</th>
                                <th>Total Views</th>
                                <th>Engagement</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${reports.map(report => `

                                <tr>

                                    <td>${report.reportId}</td>

                                    <td>${report.reportMonth}</td>

                                    <td>${report.totalViews}</td>

                                    <td>${report.averageEngagement}%</td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        container.innerHTML =
            `<div class="error-message">${error.message}</div>`;
    }
}


// ===============================
// NAVIGATION
// ===============================

document.querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const page =
                button.dataset.page;

            document.querySelectorAll(".nav-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            document.querySelectorAll(".page")
                .forEach(section =>
                    section.classList.add("d-none")
                );

            document
                .getElementById(`page-${page}`)
                .classList.remove("d-none");

            if (page === "dashboard") loadDashboard();
            if (page === "videos") loadVideos();
            if (page === "content") loadContent();
            if (page === "calendar") loadCalendar();
            if (page === "seo") loadSeo();
            if (page === "reports") loadReports();

        });

    });


// ===============================
// AUTO LOGIN
// ===============================

if (token) {

    showApp();

    loadDashboard();

}
// ===============================
// DASHBOARD CHARTS
// ===============================

let performanceChart = null;
let engagementChart = null;


function renderPerformanceChart(videos) {

    const canvas =
        document.getElementById("performanceChart");

    if (!canvas) return;

    if (performanceChart) {
        performanceChart.destroy();
    }

    if (!videos || videos.length === 0) {
        return;
    }

    const labels =
        videos.map(video => video.title);

    const views =
        videos.map(video => video.views);

    const likes =
        videos.map(video => video.likes);

    const comments =
        videos.map(video => video.comments);


    performanceChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels,

            datasets: [

                {
                    label: "Views",
                    data: views
                },

                {
                    label: "Likes",
                    data: likes
                },

                {
                    label: "Comments",
                    data: comments
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                }

            },

            scales: {

                y: {
                    beginAtZero: true
                }

            }

        }

    });
}


function renderEngagementChart(videos) {

    const canvas =
        document.getElementById("engagementChart");

    if (!canvas) return;

    if (engagementChart) {
        engagementChart.destroy();
    }

    if (!videos || videos.length === 0) {
        return;
    }

    const totalLikes =
        videos.reduce(
            (sum, video) => sum + Number(video.likes || 0),
            0
        );

    const totalComments =
        videos.reduce(
            (sum, video) => sum + Number(video.comments || 0),
            0
        );

    const totalShares =
        videos.reduce(
            (sum, video) => sum + Number(video.shares || 0),
            0
        );


    engagementChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [
                "Likes",
                "Comments",
                "Shares"
            ],

            datasets: [

                {
                    data: [
                        totalLikes,
                        totalComments,
                        totalShares
                    ]
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });
}