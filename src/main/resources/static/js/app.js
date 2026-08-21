// ======================================================
// CREATORHUB - APP.JS
// ======================================================

console.log("CREATORHUB APP.JS LOADED");


// ======================================================
// API REQUEST HELPER
// ======================================================

async function apiRequest(url, options = {}) {

    const token = localStorage.getItem("creatorhub_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.error ||
            data?.message ||
            "Request failed: " + response.status
        );
    }

    return data;
}


// ======================================================
// HTML HELPERS
// ======================================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {
    return escapeHtml(value);
}


// ======================================================
// STATUS BADGE
// ======================================================

function getStatusClass(status) {

    switch (
        String(status || "")
            .toUpperCase()
            .trim()
    ) {

        case "IDEA":
            return "bg-secondary";

        case "PLANNED":
            return "bg-warning text-dark";

        case "PUBLISHED":
            return "bg-success";

        default:
            return "bg-secondary";
    }
}

// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    console.log("LOAD DASHBOARD STARTED");

    const dashboardContainer =
        document.getElementById("dashboardCards");

    if (!dashboardContainer) {
        console.warn("dashboardCards not found");
        return;
    }

    try {

        // --------------------------------------------------
        // LOAD DASHBOARD DATA
        // --------------------------------------------------

        const dashboard =
            await apiRequest("/api/dashboard");

        console.log("DASHBOARD:", dashboard);


        // --------------------------------------------------
        // VALUES
        // --------------------------------------------------

        const totalContentIdeas =
            dashboard.totalContentIdeas ?? 0;

        const totalVideos =
            dashboard.totalVideos ?? 0;

        const totalReports =
            dashboard.totalReports ?? 0;

        const totalViews =
            dashboard.totalViews ?? 0;

        const totalLikes =
            dashboard.totalLikes ?? 0;

        const totalComments =
            dashboard.totalComments ?? 0;

        const totalShares =
            dashboard.totalShares ?? 0;

        const averageCtr =
            Number(dashboard.averageCtr ?? 0).toFixed(2);

        const averageEngagement =
            Number(
                dashboard.averageEngagement ?? 0
            ).toFixed(2);

        const totalCalendarEvents =
            dashboard.totalCalendarEvents ?? 0;


        // --------------------------------------------------
        // DASHBOARD CARDS
        // --------------------------------------------------

        dashboardContainer.innerHTML = `

            <!-- OVERVIEW -->

            <div class="row g-4 mb-4">

                <div class="col-md-4">

                    <div class="stat-card">

                        <h6>Content Ideas</h6>

                        <h3>
                            ${totalContentIdeas}
                        </h3>

                    </div>

                </div>


                <div class="col-md-4">

                    <div class="stat-card">

                        <h6>Videos</h6>

                        <h3>
                            ${totalVideos}
                        </h3>

                    </div>

                </div>


                <div class="col-md-4">

                    <div class="stat-card">

                        <h6>Reports</h6>

                        <h3>
                            ${totalReports}
                        </h3>

                    </div>

                </div>

            </div>


            <!-- PERFORMANCE -->

            <div class="row g-4 mb-4">

                <div class="col-md-4">

                    <div class="stat-card">

                        <h6>Total Views</h6>

                        <h3>
                            ${totalViews.toLocaleString()}
                        </h3>

                    </div>

                </div>


                <div class="col-md-4">

                    <div class="stat-card">

                        <h6>Total Likes</h6>

                        <h3>
                            ${totalLikes.toLocaleString()}
                        </h3>

                    </div>

                </div>


                <div class="col-md-4">

                    <div class="stat-card">

                        <h6>Total Comments</h6>

                        <h3>
                            ${totalComments.toLocaleString()}
                        </h3>

                    </div>

                </div>

            </div>


            <!-- ENGAGEMENT -->

            <div class="row g-4 mb-4">

                <div class="col-md-3">

                    <div class="stat-card">

                        <h6>Total Shares</h6>

                        <h3>
                            ${totalShares.toLocaleString()}
                        </h3>

                    </div>

                </div>


                <div class="col-md-3">

                    <div class="stat-card">

                        <h6>Average CTR</h6>

                        <h3>
                            ${averageCtr}%
                        </h3>

                    </div>

                </div>


                <div class="col-md-3">

                    <div class="stat-card">

                        <h6>Average Engagement</h6>

                        <h3>
                            ${averageEngagement}%
                        </h3>

                    </div>

                </div>


                <div class="col-md-3">

                    <div class="stat-card">

                        <h6>Calendar Events</h6>

                        <h3>
                            ${totalCalendarEvents}
                        </h3>

                    </div>

                </div>

            </div>


            <!-- WELCOME -->

            <div class="data-card mb-4">

                <h5 class="mb-3">
                    Welcome to CreatorHub
                </h5>

                <p class="text-muted mb-0">
                    Manage your content,
                    videos, analytics and SEO
                    from one place.
                </p>

            </div>

        `;


        // ==================================================
        // DASHBOARD CHARTS
        // ==================================================

        if (typeof Chart === "undefined") {

            console.error(
                "Chart.js is not loaded."
            );

            return;
        }


        const performanceCanvas =
            document.getElementById("performanceChart");

        const engagementCanvas =
            document.getElementById("engagementChart");


        console.log(
            "Performance canvas:",
            performanceCanvas
        );

        console.log(
            "Engagement canvas:",
            engagementCanvas
        );


        // ==================================================
        // PERFORMANCE CHART
        // ==================================================

        if (performanceCanvas) {

            const existingPerformance =
                Chart.getChart(performanceCanvas);

            if (existingPerformance) {
                existingPerformance.destroy();
            }


            window.performanceChart =
                new Chart(
                    performanceCanvas,
                    {

                        type: "bar",

                        data: {

                            labels: [
                                "Views",
                                "Likes",
                                "Comments"
                            ],

                            datasets: [

                                {

                                    label:
                                        "Video Performance",

                                    data: [
                                        totalViews,
                                        totalLikes,
                                        totalComments
                                    ],

                                    borderWidth: 1,

                                    borderRadius: 8,

                                    maxBarThickness: 70

                                }

                            ]

                        },


                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {
                                    display: false
                                }

                            },

                            scales: {

                                y: {

                                    type: "logarithmic",

                                    beginAtZero: false

                                },

                                x: {

                                    grid: {
                                        display: false
                                    }

                                }

                            }

                        }

                    }
                );

        }


        // ==================================================
        // ENGAGEMENT CHART
        // ==================================================

        if (engagementCanvas) {

            const existingEngagement =
                Chart.getChart(engagementCanvas);

            if (existingEngagement) {
                existingEngagement.destroy();
            }


            window.engagementChart =
                new Chart(
                    engagementCanvas,
                    {

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
                                    ],

                                    borderWidth: 3

                                }

                            ]

                        },


                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            cutout: "62%",

                            plugins: {

                                legend: {

                                    display: true,

                                    position: "bottom"

                                }

                            }

                        }

                    }
                );

        }


        console.log(
            "Performance chart created:",
            !!window.performanceChart
        );

        console.log(
            "Engagement chart created:",
            !!window.engagementChart
        );


    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );


        dashboardContainer.innerHTML = `

            <div class="alert alert-danger">

                ${escapeHtml(
                    error.message ||
                    "Failed to load dashboard."
                )}

            </div>

        `;

    }

}

// ======================================================
// CONTENT IDEAS
// ======================================================

async function loadContent() {

    console.log("LOAD CONTENT STARTED");

    const container =
        document.getElementById("contentContainer");

    if (!container) {
        console.error("contentContainer not found");
        return;
    }

    container.innerHTML = `
        <div id="contentFormContainer"></div>
        <div id="contentTableContainer" class="mt-4"></div>
    `;

    await refreshContentTable();
}
// ======================================================
// CONTENT TABLE
// ======================================================

async function refreshContentTable() {

    const container =
        document.getElementById(
            "contentTableContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="loading">
            Loading content ideas...
        </div>
    `;

    try {

        const content =
            await apiRequest("/api/content");

        console.log("CONTENT:", content);

        if (
            !Array.isArray(content) ||
            content.length === 0
        ) {

            container.innerHTML = `

                <div class="data-card text-center py-5">

                    <h5>
                        No content ideas yet
                    </h5>

                    <p class="text-muted">
                        Create your first content idea.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary"
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
                                <th>Planned Date</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${content.map(idea => `

                                <tr>

                                    <td>
                                        ${idea.ideaId ?? "-"}
                                    </td>

                                    <td>

                                        <strong>
                                            ${escapeHtml(
                                                idea.title || ""
                                            )}
                                        </strong>

                                        ${
                                            idea.hook
                                            ? `
                                                <div class="small text-muted mt-1">
                                                    ${escapeHtml(
                                                        idea.hook
                                                    )}
                                                </div>
                                            `
                                            : ""
                                        }

                                    </td>

                                    <td>
                                        ${escapeHtml(
                                            idea.category || ""
                                        )}
                                    </td>

                                    <td>

                                        <span class="badge ${
                                            getStatusClass(
                                                idea.status
                                            )
                                        }">

                                            ${escapeHtml(
                                                idea.status || "IDEA"
                                            )}

                                        </span>

                                    </td>

                                    <td>
                                        ${
                                            idea.plannedDate
                                            ? escapeHtml(
                                                idea.plannedDate
                                            )
                                            : "-"
                                        }
                                    </td>

                                    <td>

                                        <div class="btn-group">

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-primary"
                                                onclick="editContent(${idea.ideaId})">

                                                Edit

                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-danger"
                                                onclick="deleteContent(${idea.ideaId})">

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

        console.error(
            "CONTENT TABLE ERROR:",
            error
        );

        container.innerHTML = `

            <div class="alert alert-danger">

                ${escapeHtml(
                    error.message ||
                    "Failed to load content ideas."
                )}

            </div>
        `;
    }
}


// ======================================================
// CONTENT FORM
// ======================================================

function showContentForm(idea = null) {

    const container =
        document.getElementById(
            "contentFormContainer"
        );

    if (!container) {
        return;
    }

    const editing =
        idea !== null;

    container.innerHTML = `

        <div class="data-card mb-4">

            <div class="d-flex justify-content-between
                        align-items-center mb-3">

                <h5 class="mb-0">

                    ${
                        editing
                        ? "Edit Content Idea"
                        : "Add Content Idea"
                    }

                </h5>

                <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    onclick="closeContentForm()">

                    Cancel

                </button>

            </div>

            <form id="contentForm">

                <div class="mb-3">

                    <label
                        for="contentTitle"
                        class="form-label">

                        Title

                    </label>

                    <input
                        type="text"
                        id="contentTitle"
                        class="form-control"
                        maxlength="255"
                        value="${
                            editing
                            ? escapeAttribute(
                                idea.title || ""
                            )
                            : ""
                        }"
                        required>

                </div>

                <div class="mb-3">

                    <label
                        for="contentHook"
                        class="form-label">

                        Hook

                    </label>

                    <textarea
                        id="contentHook"
                        class="form-control"
                        rows="3"
                        maxlength="1000">${
                            editing
                            ? escapeHtml(
                                idea.hook || ""
                            )
                            : ""
                        }</textarea>

                </div>

                <div class="row g-3">

                    <div class="col-md-6">

                        <label
                            for="contentCategory"
                            class="form-label">

                            Category

                        </label>

                        <input
                            type="text"
                            id="contentCategory"
                            class="form-control"
                            value="${
                                editing
                                ? escapeAttribute(
                                    idea.category || ""
                                )
                                : ""
                            }"
                            required>

                    </div>

                    <div class="col-md-6">

                        <label
                            for="contentStatus"
                            class="form-label">

                            Status

                        </label>

                        <select
                            id="contentStatus"
                            class="form-select"
                            required>

                            <option value="IDEA">
                                IDEA
                            </option>

                            <option value="PLANNED">
                                PLANNED
                            </option>

                            <option value="PUBLISHED">
                                PUBLISHED
                            </option>

                        </select>

                    </div>

                </div>

                <div class="mt-3">

                    <label
                        for="contentPlannedDate"
                        class="form-label">

                        Planned Date

                    </label>

                    <input
                        type="date"
                        id="contentPlannedDate"
                        class="form-control"
                        value="${
                            editing &&
                            idea.plannedDate
                            ? escapeAttribute(
                                idea.plannedDate
                            )
                            : ""
                        }">

                </div>

                <div
                    id="contentFormError"
                    class="text-danger mt-3">
                </div>

                <button
                    type="submit"
                    class="btn btn-primary mt-3">

                    ${
                        editing
                        ? "Update Idea"
                        : "Save Idea"
                    }

                </button>

            </form>

        </div>
    `;

    if (
        editing &&
        idea.status
    ) {

        document.getElementById(
            "contentStatus"
        ).value = idea.status;
    }

    const form =
        document.getElementById(
            "contentForm"
        );

    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveContent(
                    editing
                    ? idea.ideaId
                    : null
                );
            }
        );
    }
}


// ======================================================
// SAVE CONTENT
// ======================================================

async function saveContent(ideaId = null) {

    const errorContainer =
        document.getElementById(
            "contentFormError"
        );

    const title =
        document.getElementById(
            "contentTitle"
        ).value.trim();

    const hook =
        document.getElementById(
            "contentHook"
        ).value.trim();

    const category =
        document.getElementById(
            "contentCategory"
        ).value.trim();

    const status =
        document.getElementById(
            "contentStatus"
        ).value;

    const plannedDate =
        document.getElementById(
            "contentPlannedDate"
        ).value;

    if (!title) {

        errorContainer.textContent =
            "Title is required.";

        return;
    }

    if (!category) {

        errorContainer.textContent =
            "Category is required.";

        return;
    }

    try {

        errorContainer.textContent =
            "Saving...";

        await apiRequest(
            ideaId
                ? `/api/content/${ideaId}`
                : "/api/content",
            {
                method: ideaId
                    ? "PUT"
                    : "POST",

                body: JSON.stringify({
                    title,
                    hook: hook || null,
                    category,
                    status,
                    plannedDate:
                        plannedDate || null
                })
            }
        );

        console.log(
            "CONTENT SAVED SUCCESSFULLY"
        );

        closeContentForm();

        await refreshContentTable();

    } catch (error) {

        console.error(
            "SAVE CONTENT ERROR:",
            error
        );

        errorContainer.textContent =
            error.message;
    }
}


// ======================================================
// EDIT CONTENT
// ======================================================

async function editContent(ideaId) {

    try {

        const idea =
            await apiRequest(
                `/api/content/${ideaId}`
            );

        showContentForm(idea);

    } catch (error) {

        console.error(
            "EDIT CONTENT ERROR:",
            error
        );

        alert(error.message);
    }
}


// ======================================================
// DELETE CONTENT
// ======================================================

async function deleteContent(ideaId) {

    if (
        !confirm(
            "Are you sure you want to delete this content idea?"
        )
    ) {
        return;
    }

    try {

        await apiRequest(
            `/api/content/${ideaId}`,
            {
                method: "DELETE"
            }
        );

        await refreshContentTable();

    } catch (error) {

        console.error(
            "DELETE CONTENT ERROR:",
            error
        );

        alert(error.message);
    }
}


// ======================================================
// CLOSE CONTENT FORM
// ======================================================

function closeContentForm() {

    const container =
        document.getElementById(
            "contentFormContainer"
        );

    if (container) {
        container.innerHTML = "";
    }
}


// ======================================================
// LOGIN
// ======================================================

function setupLogin() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    if (!loginForm) {
        console.warn(
            "loginForm not found"
        );
        return;
    }

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;

            const loginError =
                document.getElementById(
                    "loginError"
                );

            if (loginError) {
                loginError.textContent =
                    "Logging in...";
            }

            try {

                const response =
                    await fetch(
                        "/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );

                let data = null;

                try {
                    data = await response.json();
                } catch {
                    data = null;
                }

                console.log(
                    "LOGIN RESPONSE:",
                    data
                );

                if (!response.ok) {

                    throw new Error(
                        data?.error ||
                        data?.message ||
                        "Login failed"
                    );
                }

                if (!data?.token) {

                    throw new Error(
                        "Server did not return a token."
                    );
                }

                localStorage.setItem(
                    "creatorhub_token",
                    data.token
                );

                localStorage.setItem(
                    "creatorhub_user",
                    JSON.stringify({
                        userId:
                            data.userId,
                        name:
                            data.name,
                        email:
                            data.email
                    })
                );

                console.log(
                    "LOGIN SUCCESS"
                );

                window.location.reload();

            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );

                if (loginError) {
                    loginError.textContent =
                        error.message;
                }
            }
        }
    );

    console.log(
        "LOGIN HANDLER READY"
    );
}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem(
        "creatorhub_token"
    );

    localStorage.removeItem(
        "creatorhub_user"
    );

    window.location.reload();
}


// ======================================================
// NAVIGATION
// ======================================================

function showPage(page) {

    console.log("SHOW PAGE:", page);

    const pages = document.querySelectorAll(".page");

    console.log("TOTAL PAGES:", pages.length);

    // Hide every page
    pages.forEach(section => {
        section.classList.add("d-none");
    });

    // Find requested page
    const target = document.getElementById(`page-${page}`);

    if (!target) {
        console.error(`PAGE NOT FOUND: page-${page}`);
        return;
    }

    // Show ONLY the requested page
    target.classList.remove("d-none");

    console.log(
        "VISIBLE PAGE:",
        target.id,
        target.className
    );

    switch (page) {

        case "dashboard":
            loadDashboard();
            break;

        case "videos":
            loadVideos();
            break;

        case "content":
            loadContent();
            break;

        case "calendar":
            loadCalendar();
            break;

        case "seo":
            loadSeo();
            break;

        case "reports":
            loadReports();
            break;

        default:
            console.warn("UNKNOWN PAGE:", page);
    }
}
// ======================================================
// NAVIGATION EVENT LISTENERS
// ======================================================

function setupNavigation() {

    console.log(
        "SETTING UP NAVIGATION"
    );

    const buttons =
        document.querySelectorAll(".nav-btn");

    console.log(
        "NAV BUTTON COUNT:",
        buttons.length
    );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const page =
                    button.dataset.page;

                console.log(
                    "NAV CLICK:",
                    page
                );

                if (page) {

                    // Update active navigation button
                    buttons.forEach(btn => {
                        btn.classList.remove("active");
                    });

                    button.classList.add("active");

                    // Show selected page
                    showPage(page);
                }
            }
        );
    });
}


// ======================================================
// PLACEHOLDER PAGE LOADERS
// ======================================================

async function loadVideos() {

    console.log("LOAD VIDEOS STARTED");

    const container = document.getElementById("videosContainer");

    if (!container) {
        console.warn("videosContainer not found");
        return;
    }

    container.innerHTML = `
        <div class="data-card text-center py-4">
            Loading videos...
        </div>
    `;

    try {

        const videos = await apiRequest("/api/videos");

        console.log("VIDEOS:", videos);

        const header = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 class="mb-1">Videos</h4>
                    <p class="text-muted mb-0">
                        Track and manage your video performance.
                    </p>
                </div>

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="showVideoForm()">
                    + Add Video
                </button>
            </div>

            <div id="videoFormContainer"></div>
        `;

        if (!Array.isArray(videos) || videos.length === 0) {

            container.innerHTML = header + `
                <div class="data-card text-center py-5">
                    <h4 class="mb-2">No videos yet</h4>
                    <p class="text-muted mb-0">
                        Add your first video to start tracking performance.
                    </p>
                </div>
            `;

            return;
        }

        container.innerHTML = header + `

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
                                <th>Subscribers</th>
                                <th>Revenue</th>
                                <th>Impressions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            ${videos.map(video => `

                                <tr>

                                    <td>${video.videoId ?? "-"}</td>

                                    <td>
                                        <strong>
                                            ${escapeHtml(video.title || "")}
                                        </strong>
                                    </td>

                                    <td>${Number(video.views ?? 0).toLocaleString()}</td>
                                    <td>${Number(video.likes ?? 0).toLocaleString()}</td>
                                    <td>${Number(video.comments ?? 0).toLocaleString()}</td>
                                    <td>${Number(video.shares ?? 0).toLocaleString()}</td>
                                    <td>${video.watchTime ?? 0}</td>
                                    <td>${video.ctr ?? 0}%</td>
                                    <td>${Number(video.subscribers ?? 0).toLocaleString()}</td>
                                    <td>₹${Number(video.revenue ?? 0).toFixed(2)}</td>
                                    <td>${Number(video.impressions ?? 0).toLocaleString()}</td>

                                    <td>

                                        <div class="btn-group">

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-primary"
                                                onclick="editVideo(${video.videoId})">
                                                Edit
                                            </button>

                                            <button
                                                type="button"
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

        console.error("VIDEOS LOAD ERROR:", error);

        container.innerHTML = `
            <div class="alert alert-danger">
                ${escapeHtml(
                    error.message ||
                    "Failed to load videos."
                )}
            </div>
        `;
    }
}
        // ======================================================
// APPLICATION START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "APP.JS INITIALIZED"
        );

        setupLogin();
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}
setupNavigation();

setupCalendarForm();

        const token =
            localStorage.getItem(
                "creatorhub_token"
            );

        const loginPage =
            document.getElementById(
                "loginPage"
            );

        const dashboardApp =
            document.getElementById(
                "dashboardApp"
            );

        if (token) {

            if (loginPage) {
                loginPage.classList.add(
                    "d-none"
                );
            }

            if (dashboardApp) {
                dashboardApp.classList.remove(
                    "d-none"
                );
            }

            showPage("dashboard");

        } else {

            if (loginPage) {
                loginPage.classList.remove(
                    "d-none"
                );
            }

            if (dashboardApp) {
                dashboardApp.classList.add(
                    "d-none"
                );
            }
        }
    }
);
// ======================================================
// VIDEO FORM
// ======================================================

function showVideoForm(video = null) {

    const container =
        document.getElementById("videoFormContainer");

    if (!container) {
        console.warn("videoFormContainer not found");
        return;
    }

    const editing = video !== null;

    container.innerHTML = `

        <div class="data-card mb-4">

            <div class="d-flex justify-content-between
                        align-items-center mb-3">

                <div>
                    <h5 class="mb-1">
                        ${editing ? "Edit Video" : "Add Video"}
                    </h5>

                    <p class="text-muted mb-0">
                        Enter your video performance data.
                    </p>
                </div>

                <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    onclick="closeVideoForm()">

                    Cancel

                </button>

            </div>

            <form id="videoForm">

                <!-- TITLE -->

                <div class="mb-3">

                    <label
                        for="videoTitle"
                        class="form-label">

                        Video Title

                    </label>

                    <input
                        type="text"
                        id="videoTitle"
                        class="form-control"
                        maxlength="255"
                        value="${
                            editing
                                ? escapeAttribute(video.title || "")
                                : ""
                        }"
                        required>

                </div>


                <!-- VIEWS / LIKES -->

                <div class="row g-3">

                    <div class="col-md-6">

                        <label
                            for="videoViews"
                            class="form-label">

                            Views

                        </label>

                        <input
                            type="number"
                            id="videoViews"
                            class="form-control"
                            min="0"
                            value="${
                                editing
                                    ? video.views ?? 0
                                    : 0
                            }"
                            required>

                    </div>


                    <div class="col-md-6">

                        <label
                            for="videoLikes"
                            class="form-label">

                            Likes

                        </label>

                        <input
                            type="number"
                            id="videoLikes"
                            class="form-control"
                            min="0"
                            value="${
                                editing
                                    ? video.likes ?? 0
                                    : 0
                            }"
                            required>

                    </div>


                    <!-- COMMENTS / SHARES -->

                    <div class="col-md-6">

                        <label
                            for="videoComments"
                            class="form-label">

                            Comments

                        </label>

                        <input
                            type="number"
                            id="videoComments"
                            class="form-control"
                            min="0"
                            value="${
                                editing
                                    ? video.comments ?? 0
                                    : 0
                            }"
                            required>

                    </div>


                    <div class="col-md-6">

                        <label
                            for="videoShares"
                            class="form-label">

                            Shares

                        </label>

                        <input
                            type="number"
                            id="videoShares"
                            class="form-control"
                            min="0"
                            value="${
                                editing
                                    ? video.shares ?? 0
                                    : 0
                            }"
                            required>

                    </div>


                    <!-- WATCH TIME / CTR -->

                    <div class="col-md-6">

                        <label
                            for="videoWatchTime"
                            class="form-label">

                            Watch Time

                        </label>

                        <input
                            type="number"
                            id="videoWatchTime"
                            class="form-control"
                            min="0"
                            step="0.01"
                            value="${
                                editing
                                    ? video.watchTime ?? 0
                                    : 0
                            }"
                            required>

                    </div>


                    <div class="col-md-6">

                        <label
                            for="videoCtr"
                            class="form-label">

                            CTR (%)

                        </label>

                        <input
                            type="number"
                            id="videoCtr"
                            class="form-control"
                            min="0"
                            step="0.01"
                            value="${
                                editing
                                    ? video.ctr ?? 0
                                    : 0
                            }"
                            required>

                    </div>


                    <!-- SUBSCRIBERS -->

                    <div class="col-md-6">

                        <label
                            for="videoSubscribers"
                            class="form-label">

                            Subscribers Gained

                        </label>

                        <input
                            type="number"
                            id="videoSubscribers"
                            class="form-control"
                            min="0"
                            value="${
                                editing
                                    ? video.subscribers ?? 0
                                    : 0
                            }"
                            required>

                    </div>


                    <!-- REVENUE -->

                    <div class="col-md-6">

                        <label
                            for="videoRevenue"
                            class="form-label">

                            Revenue (â‚¹)

                        </label>

                        <input
                            type="number"
                            id="videoRevenue"
                            class="form-control"
                            min="0"
                            step="0.01"
                            value="${
                                editing
                                    ? video.revenue ?? 0
                                    : 0
                            }"
                            required>

                    </div>


                    <!-- IMPRESSIONS -->

                    <div class="col-md-6">

                        <label
                            for="videoImpressions"
                            class="form-label">

                            Impressions

                        </label>

                        <input
                            type="number"
                            id="videoImpressions"
                            class="form-control"
                            min="0"
                            value="${
                                editing
                                    ? video.impressions ?? 0
                                    : 0
                            }"
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

    const form =
        document.getElementById("videoForm");

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await saveVideo(
                editing
                    ? video.videoId
                    : null
            );
        }
    );
}


// ======================================================
// SAVE VIDEO
// ======================================================

async function saveVideo(videoId = null) {

    const errorContainer =
        document.getElementById("videoFormError");

    const title =
        document.getElementById("videoTitle")
            .value
            .trim();

    const views =
        Number(
            document.getElementById("videoViews").value
        );

    const likes =
        Number(
            document.getElementById("videoLikes").value
        );

    const comments =
        Number(
            document.getElementById("videoComments").value
        );

    const shares =
        Number(
            document.getElementById("videoShares").value
        );

    const watchTime =
        Number(
            document.getElementById("videoWatchTime").value
        );

    const ctr =
        Number(
            document.getElementById("videoCtr").value
        );

    const subscribers =
        Number(
            document.getElementById("videoSubscribers").value
        );

    const revenue =
        Number(
            document.getElementById("videoRevenue").value
        );

    const impressions =
        Number(
            document.getElementById("videoImpressions").value
        );


    // ==================================================
    // VALIDATION
    // ==================================================

    if (!title) {

        errorContainer.textContent =
            "Video title is required.";

        return;
    }

    if (
        [
            views,
            likes,
            comments,
            shares,
            watchTime,
            ctr,
            subscribers,
            revenue,
            impressions
        ].some(
            value =>
                !Number.isFinite(value) ||
                value < 0
        )
    ) {

        errorContainer.textContent =
            "All numeric values must be zero or greater.";

        return;
    }


    try {

        errorContainer.textContent =
            "Saving...";


        // ==================================================
        // API REQUEST
        // ==================================================

        await apiRequest(
            videoId
                ? `/api/videos/${videoId}`
                : "/api/videos",
            {

                method:
                    videoId
                        ? "PUT"
                        : "POST",

                body:
                    JSON.stringify({

                        title,

                        views,

                        likes,

                        comments,

                        shares,

                        watchTime,

                        ctr,

                        subscribers,

                        revenue,

                        impressions

                    })

            }
        );


        console.log(
            "VIDEO SAVED SUCCESSFULLY"
        );


        closeVideoForm();

        await loadVideos();


    } catch (error) {

        console.error(
            "SAVE VIDEO ERROR:",
            error
        );

        errorContainer.textContent =
            error.message ||
            "Failed to save video.";

    }
}
// ======================================================
// EDIT VIDEO
// ======================================================

async function editVideo(videoId) {

    console.log("EDIT VIDEO:", videoId);

    try {

        const video =
            await apiRequest(
                `/api/videos/${videoId}`
            );

        console.log("VIDEO TO EDIT:", video);

        showVideoForm(video);

    } catch (error) {

        console.error(
            "EDIT VIDEO ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to load video."
        );
    }
}


// ======================================================
// DELETE VIDEO
// ======================================================

async function deleteVideo(videoId) {

    console.log("DELETE VIDEO:", videoId);

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

        console.log(
            "VIDEO DELETED SUCCESSFULLY"
        );

        await loadVideos();

    } catch (error) {

        console.error(
            "DELETE VIDEO ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to delete video."
        );
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
// CALENDAR
// ======================================================

async function loadCalendar() {

    console.log("LOAD CALENDAR STARTED");

    const container =
        document.getElementById("calendarContainer");

    if (!container) {
        console.warn("calendarContainer not found");
        return;
    }

    container.innerHTML = `
        <div class="data-card text-center py-4">
            Loading calendar events...
        </div>
    `;

    try {

        const events =
            await apiRequest("/api/calendar");

        console.log("CALENDAR EVENTS:", events);

        if (!Array.isArray(events) || events.length === 0) {

            container.innerHTML = `
                <div class="data-card text-center py-5">

                    <h5 class="mb-2">
                        No calendar events yet
                    </h5>

                    <p class="text-muted mb-0">
                        Create an event using the form above.
                    </p>

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
                                <th>Content ID</th>
                                <th>Date & Time</th>
                                <th>Event Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            ${events.map(event => `

                                <tr>

                                    <td>
                                        ${event.eventId ?? "-"}
                                    </td>

                                    <td>
                                        ${event.contentId ?? "-"}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                                            formatCalendarDate(
                                                event.eventDate
                                            )
                                        )}
                                    </td>

                                    <td>
                                        <span class="badge bg-primary">
                                            ${escapeHtml(
                                                event.eventType || ""
                                            )}
                                        </span>
                                    </td>

                                    <td>

                                        <div class="btn-group">

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-primary"
                                                onclick="editCalendarEvent(${event.eventId})">

                                                Edit

                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-danger"
                                                onclick="deleteCalendarEvent(${event.eventId})">

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

        console.error(
            "LOAD CALENDAR ERROR:",
            error
        );

        container.innerHTML = `
            <div class="alert alert-danger">
                ${escapeHtml(
                    error.message ||
                    "Failed to load calendar events."
                )}
            </div>
        `;
    }
}


// ======================================================
// FORMAT CALENDAR DATE
// ======================================================

function formatCalendarDate(value) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}


// ======================================================
// SAVE CALENDAR EVENT
// ======================================================

async function saveCalendar(eventId = null) {

    const message =
        document.getElementById(
            "calendarFormMessage"
        );

    const contentIdInput =
        document.getElementById(
            "calendarContentId"
        );

    const eventDateInput =
        document.getElementById(
            "calendarEventDate"
        );

    const eventTypeInput =
        document.getElementById(
            "calendarEventType"
        );

    if (
        !message ||
        !contentIdInput ||
        !eventDateInput ||
        !eventTypeInput
    ) {
        console.error(
            "Calendar form elements not found."
        );
        return;
    }

    const contentIdValue =
        contentIdInput.value.trim();

    const eventDate =
        eventDateInput.value;

    const eventType =
        eventTypeInput.value.trim();

    if (!eventDate) {

        message.textContent =
            "Event date is required.";

        return;
    }

    if (!eventType) {

        message.textContent =
            "Event type is required.";

        return;
    }

    const contentId =
        contentIdValue
            ? Number(contentIdValue)
            : null;

    if (
        contentIdValue &&
        (!Number.isInteger(contentId) || contentId <= 0)
    ) {

        message.textContent =
            "Content ID must be a valid positive number.";

        return;
    }

    try {

        message.textContent =
            "Saving...";

        await apiRequest(
            eventId
                ? `/api/calendar/${eventId}`
                : "/api/calendar",
            {
                method: eventId
                    ? "PUT"
                    : "POST",

                body: JSON.stringify({

                    contentId,

                    eventDate:

                        eventDate.length === 16
                            ? `${eventDate}:00`
                            : eventDate,

                    eventType
                })
            }
        );

        console.log(
            "CALENDAR EVENT SAVED"
        );

        message.textContent =
            "Event saved successfully.";

        document
            .getElementById("calendarForm")
            .reset();

        await loadCalendar();

    } catch (error) {

        console.error(
            "SAVE CALENDAR ERROR:",
            error
        );

        message.textContent =
            error.message ||
            "Failed to save calendar event.";
    }
}


// ======================================================
// EDIT CALENDAR EVENT
// ======================================================

async function editCalendarEvent(eventId) {

    console.log(
        "EDIT CALENDAR EVENT:",
        eventId
    );

    try {

        const event =
            await apiRequest(
                `/api/calendar/${eventId}`
            );

        console.log(
            "CALENDAR EVENT TO EDIT:",
            event
        );

        const contentIdInput =
            document.getElementById(
                "calendarContentId"
            );

        const eventDateInput =
            document.getElementById(
                "calendarEventDate"
            );

        const eventTypeInput =
            document.getElementById(
                "calendarEventType"
            );

        if (!contentIdInput ||
            !eventDateInput ||
            !eventTypeInput) {

            throw new Error(
                "Calendar form elements not found."
            );
        }

        contentIdInput.value =
            event.contentId ?? "";

        eventDateInput.value =
            formatDateTimeLocal(
                event.eventDate
            );

        eventTypeInput.value =
            event.eventType ?? "";

        const form =
            document.getElementById(
                "calendarForm"
            );

        if (form) {

            form.dataset.editingId =
                String(eventId);
        }

        const message =
            document.getElementById(
                "calendarFormMessage"
            );

        if (message) {

            message.textContent =
                `Editing event #${eventId}`;
        }

    } catch (error) {

        console.error(
            "EDIT CALENDAR ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to load calendar event."
        );
    }
}


// ======================================================
// DELETE CALENDAR EVENT
// ======================================================

async function deleteCalendarEvent(eventId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this calendar event?"
        );

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(
            `/api/calendar/${eventId}`,
            {
                method: "DELETE"
            }
        );

        console.log(
            "CALENDAR EVENT DELETED"
        );

        await loadCalendar();

    } catch (error) {

        console.error(
            "DELETE CALENDAR ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to delete calendar event."
        );
    }
}


// ======================================================
// FORMAT DATETIME FOR INPUT
// ======================================================

function formatDateTimeLocal(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}


// ======================================================
// CALENDAR FORM SUBMIT
// ======================================================

function setupCalendarForm() {

    const form =
        document.getElementById(
            "calendarForm"
        );

    if (!form) {

        console.warn(
            "calendarForm not found."
        );

        return;
    }

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const editingId =
                form.dataset.editingId;

            await saveCalendar(
                editingId
                    ? Number(editingId)
                    : null
            );

            delete form.dataset.editingId;
        }
    );

    console.log(
        "CALENDAR FORM READY"
    );
}
// ======================================================
// SEO ASSISTANT
// ======================================================

async function loadSeo() {

    console.log("LOAD SEO STARTED");

    const container =
        document.getElementById("seoContainer");

    if (!container) {
        console.warn("seoContainer not found");
        return;
    }

    container.innerHTML = `
        <div class="data-card text-center py-4">
            Loading SEO data...
        </div>
    `;

    try {

        const seoData =
            await apiRequest("/api/seo");

        console.log("SEO DATA:", seoData);

        if (!Array.isArray(seoData) || seoData.length === 0) {

            container.innerHTML = `
                <div class="data-card text-center py-5">

                    <h4 class="mb-2">
                        No SEO data yet
                    </h4>

                    <p class="text-muted mb-4">
                        Create SEO data for your content ideas.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary"
                        onclick="showSeoForm()">

                        + Add SEO Data

                    </button>

                                </div>

                <div id="seoFormContainer"></div>
            `;

            return;
        }

        container.innerHTML = `

            <div class="d-flex justify-content-between
                        align-items-center mb-4">

                <div>
                    <h4 class="mb-1">
                        SEO Data
                    </h4>

                    <p class="text-muted mb-0">
                        Manage keywords, hashtags and descriptions.
                    </p>
                </div>

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="showSeoForm()">

                    + Add SEO Data

                </button>

            </div>

            <div id="seoFormContainer"></div>

            <div class="data-card">

                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Content ID</th>
                                <th>Keywords</th>
                                <th>Hashtags</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            ${seoData.map(seo => `

                                <tr>

                                    <td>
                                        ${seo.seoId ?? "-"}
                                    </td>

                                    <td>
                                        ${seo.contentId ?? "-"}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                                            seo.keywords || ""
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                                            seo.hashtags || ""
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                                            seo.description || ""
                                        )}
                                    </td>

                                    <td>

                                        <div class="btn-group">

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-primary"
                                                onclick="editSeo(${seo.seoId})">

                                                Edit

                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-danger"
                                                onclick="deleteSeo(${seo.seoId})">

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

        console.error(
            "SEO LOAD ERROR:",
            error
        );

        container.innerHTML = `
            <div class="alert alert-danger">
                ${escapeHtml(
                    error.message ||
                    "Failed to load SEO data."
                )}
            </div>
        `;
    }
}


// ======================================================
// ======================================================
// SHOW SEO FORM
// ======================================================

async function showSeoForm(seo = null) {

    const container =
        document.getElementById("seoFormContainer");

    if (!container) {
        console.warn("seoFormContainer not found");
        return;
    }

    const editing =
        seo !== null;

    container.innerHTML = `

        <div class="data-card mb-4">

            <h5 class="mb-3">
                ${editing ? "Edit SEO Data" : "Add SEO Data"}
            </h5>

            <form id="seoForm">

                <div class="mb-3">

                    <label class="form-label">
                        Content Idea
                    </label>

                    <select
                        id="seoContentId"
                        class="form-select"
                        required
                    >

                        <option value="">
                            Loading content ideas...
                        </option>

                    </select>

                </div>

                <div class="mb-3">

                    <label class="form-label">
                        Keywords
                    </label>

                    <input
                        type="text"
                        id="seoKeywords"
                        class="form-control"
                        value="${escapeHtml(seo?.keywords || "")}"
                        placeholder="youtube, creator, content"
                    >

                </div>

                <div class="mb-3">

                    <label class="form-label">
                        Hashtags
                    </label>

                    <input
                        type="text"
                        id="seoHashtags"
                        class="form-control"
                        value="${escapeHtml(seo?.hashtags || "")}"
                        placeholder="#youtube #creator #content"
                    >

                </div>

                <div class="mb-3">

                    <label class="form-label">
                        Description
                    </label>

                    <textarea
                        id="seoDescription"
                        class="form-control"
                        rows="4"
                        placeholder="Enter SEO optimized description"
                    >${escapeHtml(seo?.description || "")}</textarea>

                </div>

                <div
                    id="seoFormMessage"
                    class="text-danger mb-3">
                </div>

                <button
                    type="submit"
                    class="btn btn-primary">

                    ${editing ? "Update SEO" : "Save SEO"}

                </button>

                <button
                    type="button"
                    class="btn btn-secondary ms-2"
                    onclick="closeSeoForm()">

                    Cancel

                </button>

            </form>

        </div>
    `;

    // ==================================================
    // LOAD CONTENT IDEAS
    // ==================================================

    try {

        const contentIdeas =
            await apiRequest("/api/content");

        const select =
            document.getElementById("seoContentId");

        if (!select) {
            return;
        }

        if (
            !Array.isArray(contentIdeas) ||
            contentIdeas.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No content ideas available
                </option>
            `;

        } else {

            select.innerHTML = `
                <option value="">
                    Select content idea
                </option>

                ${contentIdeas.map(idea => `

                    <option
                        value="${idea.ideaId}"
                        ${
                            editing &&
                            Number(idea.ideaId) ===
                            Number(seo.contentId)
                                ? "selected"
                                : ""
                        }
                    >
                        ${escapeHtml(
                            idea.title ||
                            `Content Idea #${idea.ideaId}`
                        )}
                    </option>

                `).join("")}
            `;

        }

    } catch (error) {

        console.error(
            "LOAD CONTENT IDEAS ERROR:",
            error
        );

        const select =
            document.getElementById("seoContentId");

        if (select) {

            select.innerHTML = `
                <option value="">
                    Failed to load content ideas
                </option>
            `;

        }
    }

    // ==================================================
    // FORM SUBMIT
    // ==================================================

    const form =
        document.getElementById("seoForm");

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await saveSeo(
                editing
                    ? seo.seoId
                    : null
            );

        }
    );
}


// ======================================================
// SAVE SEO
// ======================================================

async function saveSeo(seoId = null) {

    const message =
        document.getElementById("seoFormMessage");

    const contentSelect =
        document.getElementById("seoContentId");

    const keywordsInput =
        document.getElementById("seoKeywords");

    const hashtagsInput =
        document.getElementById("seoHashtags");

    const descriptionInput =
        document.getElementById("seoDescription");

    if (!message ||
        !contentSelect ||
        !keywordsInput ||
        !hashtagsInput ||
        !descriptionInput) {

        console.error(
            "SEO FORM ELEMENTS NOT FOUND"
        );

        return;
    }

    const contentId =
        Number(contentSelect.value);

    const keywords =
        keywordsInput.value.trim();

    const hashtags =
        hashtagsInput.value.trim();

    const description =
        descriptionInput.value.trim();

    // ==================================================
    // VALIDATE CONTENT IDEA
    // ==================================================

    if (
        !Number.isInteger(contentId) ||
        contentId <= 0
    ) {

        message.textContent =
            "Please select a valid content idea.";

        return;
    }

    try {

        message.textContent =
            "Saving...";

        await apiRequest(
            seoId
                ? `/api/seo/${seoId}`
                : "/api/seo",
            {

                method:
                    seoId
                        ? "PUT"
                        : "POST",

                body:
                    JSON.stringify({

                        contentId,

                        keywords,

                        hashtags,

                        description

                    })

            }
        );

        console.log(
            "SEO SAVED SUCCESSFULLY"
        );

        closeSeoForm();

        await loadSeo();

    } catch (error) {

        console.error(
            "SAVE SEO ERROR:",
            error
        );

        message.textContent =
            error.message ||
            "Failed to save SEO data.";

    }
}
// ======================================================
// EDIT SEO
// ======================================================

async function editSeo(seoId) {

    console.log(
        "EDIT SEO:",
        seoId
    );

    try {

        const seo =
            await apiRequest(
                `/api/seo/${seoId}`
            );

        console.log(
            "SEO TO EDIT:",
            seo
        );

        showSeoForm(seo);

    } catch (error) {

        console.error(
            "EDIT SEO ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to load SEO data."
        );
    }
}


// ======================================================
// DELETE SEO
// ======================================================

async function deleteSeo(seoId) {

    console.log(
        "DELETE SEO:",
        seoId
    );

    const confirmed =
        confirm(
            "Are you sure you want to delete this SEO data?"
        );

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(
            `/api/seo/${seoId}`,
            {
                method: "DELETE"
            }
        );

        console.log(
            "SEO DELETED SUCCESSFULLY"
        );

        await loadSeo();

    } catch (error) {

        console.error(
            "DELETE SEO ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to delete SEO data."
        );
    }
}


// ======================================================
// CLOSE SEO FORM
// ======================================================

function closeSeoForm() {

    const container =
        document.getElementById("seoFormContainer");

    if (container) {
        container.innerHTML = "";
    }
}
// ======================================================
// REPORTS
// ======================================================

async function loadReports() {

    console.log("LOAD REPORTS STARTED");

    const container =
        document.getElementById("reportsContainer");

    if (!container) {
        console.warn("reportsContainer not found");
        return;
    }

    container.innerHTML = `
        <div class="data-card text-center py-4">
            Loading reports...
        </div>
    `;

    try {

        const reports =
            await apiRequest("/api/reports");

        console.log("REPORTS:", reports);

        if (!Array.isArray(reports) || reports.length === 0) {

            container.innerHTML = `
                <div class="d-flex justify-content-between
                            align-items-center mb-4">

                    <div>
                        <h4 class="mb-1">
                            Reports
                        </h4>

                        <p class="text-muted mb-0">
                            Track your monthly content performance.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="btn btn-primary"
                        onclick="showReportForm()">

                        + Add Report

                    </button>

                </div>

                <div id="reportFormContainer"></div>

                <div class="data-card text-center py-5">

                    <h4 class="mb-2">
                        No reports yet
                    </h4>

                    <p class="text-muted mb-0">
                        Add your first monthly report.
                    </p>

                </div>
            `;

            return;
        }

        container.innerHTML = `

            <div class="d-flex justify-content-between
                        align-items-center mb-4">

                <div>
                    <h4 class="mb-1">
                        Reports
                    </h4>

                    <p class="text-muted mb-0">
                        Track your monthly content performance.
                    </p>
                </div>

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="showReportForm()">

                    + Add Report

                </button>

            </div>

            <div id="reportFormContainer"></div>

            <div class="data-card">

                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Month</th>
                                <th>Total Views</th>
                                <th>Average Engagement</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${reports.map(report => `

                                <tr>

                                    <td>
                                        ${report.reportId ?? "-"}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                                            report.reportMonth || ""
                                        )}
                                    </td>

                                    <td>
                                        ${Number(
                                            report.totalViews ?? 0
                                        ).toLocaleString()}
                                    </td>

                                    <td>
                                        ${Number(
                                            report.averageEngagement ?? 0
                                        ).toFixed(2)}%
                                    </td>

                                    <td>

                                        <div class="btn-group">

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-primary"
                                                onclick="editReport(${report.reportId})">

                                                Edit

                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-outline-danger"
                                                onclick="deleteReport(${report.reportId})">

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

        console.error(
            "REPORTS LOAD ERROR:",
            error
        );

        container.innerHTML = `
            <div class="alert alert-danger">
                ${escapeHtml(
                    error.message ||
                    "Failed to load reports."
                )}
            </div>
        `;
    }
}


// ======================================================
// SHOW REPORT FORM
// ======================================================

function showReportForm(report = null) {

    const container =
        document.getElementById("reportFormContainer");

    if (!container) {
        console.warn("reportFormContainer not found");
        return;
    }

    const editing =
        report !== null;

    container.innerHTML = `

        <div class="data-card mb-4">

            <h5 class="mb-3">
                ${editing ? "Edit Report" : "Add Report"}
            </h5>

            <form id="reportForm">

                <div class="mb-3">

                    <label class="form-label">
                        Report Month
                    </label>

                    <input
                        type="date"
                        id="reportMonth"
                        class="form-control"
                        value="${editing ? report.reportMonth : ""}"
                        required
                    >

                </div>

                <div class="mb-3">

                    <label class="form-label">
                        Total Views
                    </label>

                    <input
                        type="number"
                        id="reportTotalViews"
                        class="form-control"
                        min="0"
                        value="${editing ? report.totalViews : 0}"
                        required
                    >

                </div>

                <div class="mb-3">

                    <label class="form-label">
                        Average Engagement (%)
                    </label>

                    <input
                        type="number"
                        id="reportAverageEngagement"
                        class="form-control"
                        min="0"
                        step="0.01"
                        value="${editing ? report.averageEngagement : 0}"
                        required
                    >

                </div>

                <div
                    id="reportFormMessage"
                    class="text-danger mb-3">
                </div>

                <button
                    type="submit"
                    class="btn btn-primary">

                    ${editing ? "Update Report" : "Save Report"}

                </button>

                <button
                    type="button"
                    class="btn btn-secondary ms-2"
                    onclick="closeReportForm()">

                    Cancel

                </button>

            </form>

        </div>
    `;

    document
        .getElementById("reportForm")
        .addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveReport(
                    editing
                        ? report.reportId
                        : null
                );
            }
        );
}


// ======================================================
// SAVE REPORT
// ======================================================

async function saveReport(reportId = null) {

    const message =
        document.getElementById("reportFormMessage");

    const reportMonth =
        document.getElementById("reportMonth")
            .value;

    const totalViews =
        Number(
            document.getElementById("reportTotalViews").value
        );

    const averageEngagement =
        Number(
            document.getElementById(
                "reportAverageEngagement"
            ).value
        );

    if (!reportMonth) {

        message.textContent =
            "Report month is required.";

        return;
    }

    if (
        !Number.isFinite(totalViews) ||
        totalViews < 0
    ) {

        message.textContent =
            "Total views must be zero or greater.";

        return;
    }

    if (
        !Number.isFinite(averageEngagement) ||
        averageEngagement < 0
    ) {

        message.textContent =
            "Average engagement must be zero or greater.";

        return;
    }

    try {

        message.textContent =
            "Saving...";

        await apiRequest(
            reportId
                ? `/api/reports/${reportId}`
                : "/api/reports",
            {
                method: reportId
                    ? "PUT"
                    : "POST",

                body: JSON.stringify({
                    reportMonth,
                    totalViews,
                    averageEngagement
                })
            }
        );

        console.log(
            "REPORT SAVED SUCCESSFULLY"
        );

        closeReportForm();

        await loadReports();

    } catch (error) {

        console.error(
            "SAVE REPORT ERROR:",
            error
        );

        message.textContent =
            error.message ||
            "Failed to save report.";
    }
}


// ======================================================
// EDIT REPORT
// ======================================================

async function editReport(reportId) {

    console.log(
        "EDIT REPORT:",
        reportId
    );

    try {

        const report =
            await apiRequest(
                `/api/reports/${reportId}`
            );

        console.log(
            "REPORT TO EDIT:",
            report
        );

        showReportForm(report);

    } catch (error) {

        console.error(
            "EDIT REPORT ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to load report."
        );
    }
}


// ======================================================
// DELETE REPORT
// ======================================================

async function deleteReport(reportId) {

    console.log(
        "DELETE REPORT:",
        reportId
    );

    const confirmed =
        confirm(
            "Are you sure you want to delete this report?"
        );

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(
            `/api/reports/${reportId}`,
            {
                method: "DELETE"
            }
        );

        console.log(
            "REPORT DELETED SUCCESSFULLY"
        );

        await loadReports();

    } catch (error) {

        console.error(
            "DELETE REPORT ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to delete report."
        );
    }
}


// ======================================================
// CLOSE REPORT FORM
// ======================================================

function closeReportForm() {

    const container =
        document.getElementById("reportFormContainer");

    if (container) {
        container.innerHTML = "";
    }
}




// ======================================================
// SIGNUP
// ======================================================

function showSignup() {

    const loginPage =
        document.getElementById("loginPage");

    const signupPage =
        document.getElementById("signupPage");

    if (!loginPage || !signupPage) {
        console.error("Signup elements not found.");
        return;
    }

    loginPage.classList.add("d-none");
    signupPage.classList.remove("d-none");

    console.log("SIGNUP PAGE SHOWN");
}


function showLogin() {

    const loginPage =
        document.getElementById("loginPage");

    const signupPage =
        document.getElementById("signupPage");

    if (!loginPage || !signupPage) {
        console.error("Login elements not found.");
        return;
    }

    signupPage.classList.add("d-none");
    loginPage.classList.remove("d-none");

    console.log("LOGIN PAGE SHOWN");
}

document.addEventListener("DOMContentLoaded", () => {

    const signupForm =
        document.getElementById("signupForm");

    if (!signupForm) {
        return;
    }

    signupForm.addEventListener("submit", async event => {

        event.preventDefault();

        const name =
            document.getElementById("signupName")
                .value.trim();

        const email =
            document.getElementById("signupEmail")
                .value.trim();

        const password =
            document.getElementById("signupPassword")
                .value;

        const confirmPassword =
            document.getElementById("signupConfirmPassword")
                .value;

        const error =
            document.getElementById("signupError");

        error.textContent = "";

        if (password !== confirmPassword) {
            error.textContent =
                "Passwords do not match.";
            return;
        }

        try {

            const response = await fetch(
                "/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data =
                await response.json();

            console.log(
                "SIGNUP RESPONSE:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Registration failed."
                );
            }

            localStorage.setItem(
                "creatorhub_token",
                data.token
            );

            localStorage.setItem(
                "creatorhub_user",
                JSON.stringify({
                    userId: data.userId,
                    name: data.name,
                    email: data.email
                })
            );

            window.location.reload();

        } catch (error) {

            console.error(
                "SIGNUP ERROR:",
                error
            );

            document.getElementById(
                "signupError"
            ).textContent =
                error.message ||
                "Registration failed.";
        }

    });

});
