
let token = localStorage.getItem("creatorhub_token");

const loginPage = document.getElementById("loginPage");
const dashboardApp = document.getElementById("dashboardApp");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

let performanceChart = null;
let engagementChart = null;


// ======================================================
// API HELPER
// ======================================================

async function apiRequest(url, options = {}) {

    const headers = {
        ...(options.headers || {})
    };

    if (token) {
       headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
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


// ======================================================
// LOGIN
// ======================================================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    loginError.textContent = "";

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error("Invalid email or password.");
        }

        const data = await response.json();

        token = data.token;

        localStorage.setItem(
            "creatorhub_token",
            token
        );

        showApp();

        await loadDashboard();

    } catch (error) {

        loginError.textContent = error.message;
    }
});


// ======================================================
// LOGOUT
// ======================================================

logoutBtn.addEventListener("click", logout);

function logout() {

    token = null;

    localStorage.removeItem("creatorhub_token");

    dashboardApp.classList.add("d-none");

    loginPage.classList.remove("d-none");

    destroyCharts();
}


// ======================================================
// SHOW APP
// ======================================================

function showApp() {

    loginPage.classList.add("d-none");

    dashboardApp.classList.remove("d-none");
}


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    const container =
        document.getElementById("dashboardCards");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            Loading dashboard...
        </div>
    `;

    try {

        const data =
            await apiRequest("/api/dashboard");

        const videos =
            await apiRequest("/api/videos");

        // Render charts
        renderPerformanceChart(videos);
        renderEngagementChart(videos);

        const cards = [

            ["Total Videos", data.totalVideos],

            ["Total Views", Number(data.totalViews || 0).toLocaleString()],
["Total Likes", Number(data.totalLikes || 0).toLocaleString()],
["Comments", Number(data.totalComments || 0).toLocaleString()],
["Shares", Number(data.totalShares || 0).toLocaleString()],

            [
                "Average CTR",
                `${Number(data.averageCtr || 0).toFixed(2)}%`
            ],

            [
                "Engagement",
                `${Number(data.averageEngagement || 0).toFixed(2)}%`
            ],

            ["Content Ideas", data.totalContentIdeas],

            ["Calendar Events", data.totalCalendarEvents],

            ["SEO Records", data.totalSeoRecords],

            ["Reports", data.totalReports]
        ];

        container.innerHTML = cards.map(card => `

            <div class="col-sm-6 col-lg-3">

                <div class="stat-card">

                    <h6>${escapeHtml(card[0])}</h6>

                    <h3>${card[1] ?? 0}</h3>

                </div>

            </div>

        `).join("");

    } catch (error) {

        container.innerHTML = `
            <div class="error-message">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


// ======================================================
// PERFORMANCE CHART
// ======================================================

function renderPerformanceChart(videos) {

    const canvas =
        document.getElementById("performanceChart");

    if (!canvas) {
        return;
    }

    if (performanceChart) {
        performanceChart.destroy();
        performanceChart = null;
    }

    if (!videos || videos.length === 0) {
        return;
    }

    const labels =
        videos.map(video => video.title);

    const views =
        videos.map(video => Number(video.views || 0));

    const likes =
        videos.map(video => Number(video.likes || 0));

    const comments =
        videos.map(video => Number(video.comments || 0));

    performanceChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: labels,

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

            interaction: {
                mode: "index",
                intersect: false
            },

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


// ======================================================
// ENGAGEMENT CHART
// ======================================================

function renderEngagementChart(videos) {

    const canvas =
        document.getElementById("engagementChart");

    if (!canvas) {
        return;
    }

    if (engagementChart) {
        engagementChart.destroy();
        engagementChart = null;
    }

    if (!videos || videos.length === 0) {
        return;
    }

    const totalLikes =
        videos.reduce(
            (sum, video) =>
                sum + Number(video.likes || 0),
            0
        );

    const totalComments =
        videos.reduce(
            (sum, video) =>
                sum + Number(video.comments || 0),
            0
        );

    const totalShares =
        videos.reduce(
            (sum, video) =>
                sum + Number(video.shares || 0),
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


// ======================================================
// DESTROY CHARTS
// ======================================================

function destroyCharts() {

    if (performanceChart) {
        performanceChart.destroy();
        performanceChart = null;
    }

    if (engagementChart) {
        engagementChart.destroy();
        engagementChart = null;
    }
}


// ======================================================
// VIDEOS
// ======================================================

async function loadVideos() {

    const container =
        document.getElementById("videosContainer");

    if (!container) return;

    container.innerHTML = `

        <div class="d-flex justify-content-between align-items-center mb-4">

            <div>
                <h4 class="mb-1">
                    Your Videos
                </h4>

                <p class="text-muted mb-0">
                    Manage your video performance
                </p>
            </div>

            <button
                class="btn btn-primary"
                onclick="showVideoForm()">

                + Add Video

            </button>

        </div>

        <div id="videoFormContainer"></div>

        <div id="videoTableContainer">
            <div class="loading">
                Loading videos...
            </div>
        </div>
    `;

    await refreshVideoTable();
}


// ======================================================
// VIDEO TABLE
// ======================================================

async function refreshVideoTable() {

    const container =
        document.getElementById("videoTableContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            Loading videos...
        </div>
    `;

    try {

        const videos =
            await apiRequest("/api/videos");

        if (!videos || videos.length === 0) {

            container.innerHTML = `

                <div class="data-card text-center py-5">

                    <h5>No videos yet</h5>

                    <p class="text-muted">
                        Add your first video to start tracking performance.
                    </p>

                    <button
                        class="btn btn-primary"
                        onclick="showVideoForm()">

                        + Add Video

                    </button>

                </div>
            `;

            return;
        }

        container.innerHTML = `

            <div class="data-card">

                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Views</th>
                                <th>Likes</th>
                                <th>Comments</th>
                                <th>Shares</th>
                                <th>Watch Time</th>
                                <th>CTR</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${videos.map(video => `

                                <tr>

                                    <td>
                                        ${video.videoId}
                                    </td>

                                    <td>
                                        <strong>
                                            ${escapeHtml(video.title)}
                                        </strong>
                                    </td>

                                    <td>
                                        ${Number(video.views || 0).toLocaleString()}
                                    </td>

                                    <td>
                                        ${Number(video.likes || 0).toLocaleString()}
                                    </td>

                                    <td>
                                        ${Number(video.comments || 0).toLocaleString()}
                                    </td>

                                    <td>
                                        ${Number(video.shares || 0).toLocaleString()}
                                    </td>

                                    <td>
                                        ${Number(video.watchTime || 0)}
                                    </td>

                                    <td>
                                        ${Number(video.ctr || 0)}%
                                    </td>

                                    <td>

                                        <div class="btn-group">

                                            <button
                                                class="btn btn-sm btn-outline-primary"
                                                onclick="editVideo(${video.videoId})">

                                                Edit

                                            </button>

                                            <button
                                                class="btn btn-sm btn-outline-danger"
                                                onclick="deleteVideo(${video.videoId})">

                                                Delete

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        container.innerHTML = `
            <div class="error-message">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


// ======================================================
// VIDEO FORM
// ======================================================

function showVideoForm(video = null) {

    const container =
        document.getElementById("videoFormContainer");

    if (!container) return;

    const editing =
        video !== null;

    container.innerHTML = `

        <div class="data-card mb-4">

            <div class="d-flex justify-content-between align-items-center mb-3">

                <h5 class="mb-0">
                    ${editing ? "Edit Video" : "Add Video"}
                </h5>

                <button
                    class="btn btn-sm btn-outline-secondary"
                    onclick="closeVideoForm()">

                    Cancel

                </button>

            </div>

            <form id="videoForm">

                <div class="row g-3">

                    <div class="col-md-6">

                        <label class="form-label">
                            Video Title
                        </label>

                        <input
                            type="text"
                            id="videoTitle"
                            class="form-control"
                            value="${editing ? escapeAttribute(video.title) : ""}"
                            required>

                    </div>

                    <div class="col-md-3">

                        <label class="form-label">
                            Views
                        </label>

                        <input
                            type="number"
                            id="videoViews"
                            class="form-control"
                            min="0"
                            value="${editing ? video.views : 0}"
                            required>

                    </div>

                    <div class="col-md-3">

                        <label class="form-label">
                            Likes
                        </label>

                        <input
                            type="number"
                            id="videoLikes"
                            class="form-control"
                            min="0"
                            value="${editing ? video.likes : 0}"
                            required>

                    </div>

                    <div class="col-md-3">

                        <label class="form-label">
                            Comments
                        </label>

                        <input
                            type="number"
                            id="videoComments"
                            class="form-control"
                            min="0"
                            value="${editing ? video.comments : 0}"
                            required>

                    </div>

                    <div class="col-md-3">

                        <label class="form-label">
                            Shares
                        </label>

                        <input
                            type="number"
                            id="videoShares"
                            class="form-control"
                            min="0"
                            value="${editing ? video.shares : 0}"
                            required>

                    </div>

                    <div class="col-md-3">

                        <label class="form-label">
                            Watch Time
                        </label>

                        <input
                            type="number"
                            id="videoWatchTime"
                            class="form-control"
                            min="0"
                            step="0.1"
                            value="${editing ? video.watchTime : 0}"
                            required>

                    </div>

                    <div class="col-md-3">

                        <label class="form-label">
                            CTR (%)
                        </label>

                        <input
                            type="number"
                            id="videoCtr"
                            class="form-control"
                            min="0"
                            step="0.1"
                            value="${editing ? video.ctr : 0}"
                            required>

                    </div>

                </div>

                <div
                    id="videoFormError"
                    class="text-danger mt-3">
                </div>

                <button
                    type="submit"
                    class="btn btn-primary mt-3">

                    ${editing ? "Update Video" : "Save Video"}

                </button>

            </form>

        </div>
    `;

    document
        .getElementById("videoForm")
        .addEventListener("submit", async function(event) {

            event.preventDefault();

            await saveVideo(
                editing ? video.videoId : null
            );
        });
}


// ======================================================
// SAVE VIDEO
// ======================================================

async function saveVideo(videoId = null) {

    const errorContainer =
        document.getElementById("videoFormError");

    const title =
        document.getElementById("videoTitle").value.trim();

    const body = {

        title,

        views:
            Number(document.getElementById("videoViews").value),

        likes:
            Number(document.getElementById("videoLikes").value),

        comments:
            Number(document.getElementById("videoComments").value),

        shares:
            Number(document.getElementById("videoShares").value),

        watchTime:
            Number(document.getElementById("videoWatchTime").value),

        ctr:
            Number(document.getElementById("videoCtr").value)
    };

    try {

        await apiRequest(
            videoId
                ? `/api/videos/${videoId}`
                : "/api/videos",

            {
                method:
                    videoId ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body:
                    JSON.stringify(body)
            }
        );

        closeVideoForm();

        await refreshVideoTable();

        await loadDashboard();

    } catch (error) {

        if (errorContainer) {
            errorContainer.textContent =
                error.message;
        }
    }
}


// ======================================================
// EDIT VIDEO
// ======================================================

async function editVideo(videoId) {

    try {

        const video =
            await apiRequest(
                `/api/videos/${videoId}`
            );

        showVideoForm(video);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        alert(error.message);
    }
}


// ======================================================
// DELETE VIDEO
// ======================================================

async function deleteVideo(videoId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this video?"
        );

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(
            `/api/videos/${videoId}`,
            {
                method: "DELETE"
            }
        );

        await refreshVideoTable();

        await loadDashboard();

    } catch (error) {

        alert(error.message);
    }
}


// ======================================================
// CLOSE VIDEO FORM
// ======================================================

function closeVideoForm() {

    const container =
        document.getElementById("videoFormContainer");

    if (container) {
        container.innerHTML = "";
    }
}


// ======================================================
// CONTENT IDEAS
// ======================================================

async function loadContent() {
    console.log("LOAD CONTENT STARTED");

    const container = document.getElementById("contentContainer");

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Content Ideas</h4>
                <p class="text-muted mb-0">Manage your content ideas</p>
            </div>

            <button class="btn btn-primary" onclick="showContentForm()">
                + Add Idea
            </button>
        </div>

        <div id="contentFormContainer"></div>

        <div id="contentTableContainer">
            <div class="loading">Loading content ideas...</div>
        </div>
    `;

    await refreshContentTable();
}


async function refreshContentTable() {

    const container = document.getElementById("contentTableContainer");

    if (!container) return;

    container.innerHTML =
        `<div class="loading">Loading content ideas...</div>`;

    try {

        const content = await apiRequest("/api/content");

        if (!content || content.length === 0) {

            container.innerHTML = `
                <div class="data-card text-center py-5">
                    <h5>No content ideas yet</h5>
                    <p class="text-muted">
                        Create your first content idea.
                    </p>

                    <button class="btn btn-primary"
                            onclick="showContentForm()">
                        + Add Idea
                    </button>
                </div>
            `;

            return;
        }

        container.innerHTML = `
            <div class="data-card">

                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            ${content.map(item => `
                                <tr>

                                    <td>${item.ideaId}</td>

                                    <td>
                                        <strong>${escapeHtml(item.title)}</strong>
                                    </td>

                                    <td>
                                        ${escapeHtml(item.category)}
                                    </td>

                                    <td>
                                        ${escapeHtml(item.status)}
                                    </td>

                                    <td>
                                        <button
                                            class="btn btn-sm btn-outline-primary"
                                            onclick="editContent(${item.ideaId})">
                                            Edit
                                        </button>

                                        <button
                                            class="btn btn-sm btn-outline-danger"
                                            onclick="deleteContent(${item.ideaId})">
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        container.innerHTML =
            `<div class="error-message">${escapeHtml(error.message)}</div>`;
    }
}


function showContentForm(idea = null) {

    const container =
        document.getElementById("contentFormContainer");

    if (!container) return;

    const editing = idea !== null;

    container.innerHTML = `

        <div class="data-card mb-4">

            <div class="d-flex justify-content-between align-items-center mb-3">

                <h5 class="mb-0">
                    ${editing ? "Edit Content Idea" : "Add Content Idea"}
                </h5>

                <button
                    class="btn btn-sm btn-outline-secondary"
                    onclick="closeContentForm()">
                    Cancel
                </button>

            </div>

            <form id="contentForm">

                <div class="mb-3">

                    <label class="form-label">
                        Title
                    </label>

                    <input
                        type="text"
                        id="contentTitle"
                        class="form-control"
                        value="${editing ? escapeHtml(idea.title) : ""}"
                        required>

                </div>

                <div class="row g-3">

                    <div class="col-md-6">

                        <label class="form-label">
                            Category
                        </label>

                        <input
                            type="text"
                            id="contentCategory"
                            class="form-control"
                            value="${editing ? escapeHtml(idea.category) : ""}"
                            required>

                    </div>

                    <div class="col-md-6">

                        <label class="form-label">
                            Status
                        </label>

                        <select
                            id="contentStatus"
                            class="form-select"
                            required>

                            <option value="IDEA">IDEA</option>
                            <option value="PLANNED">PLANNED</option>
                            <option value="PUBLISHED">PUBLISHED</option>

                        </select>

                    </div>

                </div>

                <div id="contentFormError"
                     class="text-danger mt-3">
                </div>

                <button
                    type="submit"
                    class="btn btn-primary mt-3">

                    ${editing ? "Update Idea" : "Save Idea"}

                </button>

            </form>

        </div>
    `;

    if (editing && idea.status) {
        document.getElementById("contentStatus").value =
            idea.status;
    }

    document
        .getElementById("contentForm")
        .addEventListener("submit", async function(event) {

            event.preventDefault();

            await saveContent(
                editing ? idea.ideaId : null
            );

        });
}


async function saveContent(ideaId = null) {

    const errorContainer =
        document.getElementById("contentFormError");

    const body = {

        title:
            document.getElementById("contentTitle").value.trim(),

        category:
            document.getElementById("contentCategory").value.trim(),

        status:
            document.getElementById("contentStatus").value

    };

    try {

        await apiRequest(
            ideaId
                ? `/api/content/${ideaId}`
                : "/api/content",
            {
                method: ideaId ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(body)
            }
        );

        closeContentForm();

        await refreshContentTable();

        await loadDashboard();

    } catch (error) {

        if (errorContainer) {
            errorContainer.textContent =
                error.message;
        }
    }
}


async function editContent(ideaId) {

    try {

        const idea =
            await apiRequest(`/api/content/${ideaId}`);

        showContentForm(idea);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        alert(error.message);
    }
}


async function deleteContent(ideaId) {

    if (!confirm("Are you sure you want to delete this content idea?")) {
        return;
    }

    try {

        await apiRequest(`/api/content/${ideaId}`, {
            method: "DELETE"
        });

        await refreshContentTable();

        await loadDashboard();

    } catch (error) {

        alert(error.message);
    }
}


function closeContentForm() {

    const container =
        document.getElementById("contentFormContainer");

    if (container) {
        container.innerHTML = "";
    }
}

async function loadCalendar() {

    const container =
        document.getElementById("calendarContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            Loading calendar...
        </div>
    `;

    try {

        const events =
            await apiRequest("/api/calendar");

        if (!events || events.length === 0) {

            container.innerHTML = `
                <div class="data-card">
                    No calendar events found.
                </div>
            `;

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

                                    <td>${escapeHtml(event.eventDate)}</td>

                                    <td>${escapeHtml(event.eventType)}</td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        container.innerHTML = `
            <div class="error-message">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


async function handleCalendarSubmit(event) {

    event.preventDefault();

    const message =
        document.getElementById("calendarFormMessage");

    const contentIdValue =
        document.getElementById("calendarContentId").value;

    const eventDate =
        document.getElementById("calendarEventDate").value;

    const eventType =
        document.getElementById("calendarEventType").value;

    if (!eventDate || !eventType) {
        message.innerHTML = `
            <div class="error-message">
                Date and event type are required.
            </div>
        `;
        return;
    }

    const eventBody = {
        contentId: contentIdValue
            ? Number(contentIdValue)
            : null,
        eventDate: eventDate,
        eventType: eventType
    };

    try {

        message.innerHTML = `
            <div class="loading">
                Creating event...
            </div>
        `;

        await apiRequest("/api/calendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventBody)
        });

        message.innerHTML = `
            <div class="success-message">
                Calendar event created successfully.
            </div>
        `;

        document.getElementById("calendarForm").reset();

        await loadCalendar();

    } catch (error) {

        message.innerHTML = `
            <div class="error-message">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}

const calendarForm =
    document.getElementById("calendarForm");

if (calendarForm) {
    calendarForm.addEventListener(
        "submit",
        handleCalendarSubmit
    );
}
// ======================================================
// SEO
// ======================================================

async function loadSeo() {

    const container =
        document.getElementById("seoContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            Loading SEO data...
        </div>
    `;

    try {

        const seo =
            await apiRequest("/api/seo");

        if (!seo || seo.length === 0) {

            container.innerHTML = `
                <div class="data-card">
                    No SEO records found.
                </div>
            `;

            return;
        }

        container.innerHTML =
            seo.map(item => `

                <div class="data-card mb-3">

                    <h5>
                        SEO #${item.seoId}
                    </h5>

                    <p>
                        <strong>Content ID:</strong>
                        ${item.contentId}
                    </p>

                    <p>
                        <strong>Keywords:</strong>
                        ${escapeHtml(item.keywords)}
                    </p>

                    <p>
                        <strong>Hashtags:</strong>
                        ${escapeHtml(item.hashtags)}
                    </p>

                    <p class="mb-0">
                        <strong>Description:</strong>
                        ${escapeHtml(item.description)}
                    </p>

                </div>

            `).join("");

    } catch (error) {

        container.innerHTML = `
            <div class="error-message">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


// ======================================================
// REPORTS
// ======================================================

async function loadReports() {

    const container =
        document.getElementById("reportsContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            Loading reports...
        </div>
    `;

    try {

        const reports =
            await apiRequest("/api/reports");

        if (!reports || reports.length === 0) {

            container.innerHTML = `
                <div class="data-card">
                    No reports found.
                </div>
            `;

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

                                    <td>
                                        ${escapeHtml(report.reportMonth)}
                                    </td>

                                    <td>
                                        ${Number(report.totalViews || 0).toLocaleString()}
                                    </td>

                                    <td>
                                        ${Number(report.averageEngagement || 0).toFixed(1)}%
                                    </td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        container.innerHTML = `
            <div class="error-message">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


// ======================================================
// NAVIGATION
// ======================================================

document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener("click", async () => {

            const page =
                button.dataset.page;

            document
                .querySelectorAll(".nav-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            document
                .querySelectorAll(".page")
                .forEach(section =>
                    section.classList.add("d-none")
                );

            const target =
                document.getElementById(
                    `page-${page}`
                );

            if (target) {
                target.classList.remove("d-none");
            }

            if (page === "dashboard") {
                await loadDashboard();
            }

            if (page === "videos") {
                await loadVideos();
            }

            if (page === "content") {
                await loadContent();
            }

            if (page === "calendar") {
                await loadCalendar();
            }

            if (page === "seo") {
                await loadSeo();
            }

            if (page === "reports") {
                await loadReports();
            }

        });

    });


// ======================================================
// HTML SAFETY
// ======================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


function escapeAttribute(value) {

    return escapeHtml(value)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================================
// AUTO LOGIN
// ======================================================

if (token) {

    showApp();

    loadDashboard();

}
