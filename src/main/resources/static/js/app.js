const $ = id => document.getElementById(id);

const num = value => {

    const n = Number(value || 0);

    if (n >= 1e9)
        return (n / 1e9).toFixed(2).replace(/\.00$/, "") + "B";

    if (n >= 1e6)
        return (n / 1e6).toFixed(2).replace(/\.00$/, "") + "M";

    if (n >= 1e3)
        return (n / 1e3).toFixed(2).replace(/\.00$/, "") + "K";

    return n.toLocaleString();
};


const esc = value =>
    String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");


const formatDate = value => {

    if (!value)
        return "\u2014";

    return new Date(value).toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
};


function calculateGrade(subscribers, views, videos) {

    const subs = Number(subscribers || 0);
    const totalViews = Number(views || 0);
    const videoCount = Number(videos || 0);

    if (subs >= 1000000)
        return "A+";

    if (subs >= 500000)
        return "A";

    if (subs >= 100000)
        return "A-";

    if (subs >= 50000)
        return "B+";

    if (subs >= 10000)
        return "B";

    if (subs >= 5000)
        return "B-";

    if (subs >= 1000)
        return "C+";

    if (videoCount > 0 && totalViews / videoCount >= 10000)
        return "C";

    return "C-";
}


function estimatedEarnings(views) {

    const monthlyViews = Number(views || 0) / 12;

    const low = monthlyViews * 0.5 / 1000;
    const high = monthlyViews * 4 / 1000;

    return "$" +
        Math.round(low).toLocaleString() + " \u2013 $" + Math.round(high).toLocaleString();
}


function calculateRank(value) {

    const n = Number(value || 0);

    if (n >= 10000000)
        return "Top 0.1%";

    if (n >= 1000000)
        return "Top 1%";

    if (n >= 100000)
        return "Top 5%";

    if (n >= 10000)
        return "Top 15%";

    if (n >= 1000)
        return "Top 30%";

    return "Growing";
}


async function analyze() {

    const query = $("query").value.trim();

    $("error").textContent = "";

    if (!query) {

        $("error").textContent =
            "Enter a YouTube channel name, URL, @handle or channel ID.";

        return;
    }

    const button = $("go");

    button.disabled = true;
    button.textContent = "Analyzing...";

    try {

        const response =
            await fetch(
                "/api/public/youtube/channel?query=" +
                encodeURIComponent(query)
            );

        const data = await response.json();

        if (!response.ok)
            throw new Error(
                data.message ||
                data.error ||
                "Unable to load channel."
            );

        const channel = data;

          if (!channel || !channel.channelId)
              throw new Error("Channel not found.");

          const channelId =
              channel.channelId;

          const subscribers =
              Number(channel.subscribers || 0);

          const views =
              Number(channel.views || 0);

          const videos =
              Number(channel.videos || 0);

          renderChannel({
              channelId: channel.channelId,
              title: channel.title,
              description: channel.description,
              thumbnail: channel.thumbnail || "",
              publishedAt: channel.publishedAt,
              country: channel.country || "",
              subscribers,
              views,
              videos
          });

          await loadVideos(channelId);

    } catch (error) {

        console.error(error);

        $("error").textContent =
            error.message ||
            "Something went wrong.";

    } finally {

        button.disabled = false;
        button.textContent = "Analyze";

    }
}


function renderChannel(channel) {

    $("empty").classList.add("hidden");
    $("dashboard").classList.remove("hidden");

    $("channelName").textContent =
        channel.title || "YouTube Channel";

    $("channelMeta").textContent =
        num(channel.subscribers) + " \u00B7 " + num(channel.videos) +
        " videos";

    $("avatar").src =
        channel.thumbnail || "";

    $("youtubeLink").href =
        "https://www.youtube.com/channel/" +
        encodeURIComponent(channel.channelId);

    $("subs").textContent =
        num(channel.subscribers);

    $("views").textContent =
        num(channel.views);

    $("videos").textContent =
        num(channel.videos);

    $("grade").textContent =
        calculateGrade(
            channel.subscribers,
            channel.views,
            channel.videos
        );

    $("subscriberRank").textContent =
        calculateRank(channel.subscribers);

    $("viewRank").textContent =
        calculateRank(channel.views);

    $("videoRank").textContent =
        calculateRank(channel.videos);

    $("earnings").textContent =
        estimatedEarnings(channel.views);

    $("averageViews").textContent =
        channel.videos
            ? num(
                Math.round(
                    channel.views /
                    channel.videos
                )
            )
            : "\u2014";

    $("created").textContent =
        formatDate(channel.publishedAt);

    $("country").textContent =
        channel.country || "Not public";

    $("channelId").textContent =
        channel.channelId;

    renderMilestones(channel.subscribers);
}


async function loadVideos(channelId) {

    try {

        const response =
            await fetch(
                "/api/public/youtube/videos?channelId=" +
                encodeURIComponent(channelId)
            );

        const data =
            await response.json();

        if (!response.ok)
            throw new Error(
                data.message ||
                "Unable to load videos."
            );

        const videos = data.videos || [];

        $("videoCount").textContent =
            videos.length +
            " recent videos";

        $("videosGrid").innerHTML =
            videos.map(video => {

                const id = video.id;

                const snippet = video;

                const title =
                    snippet.title ||
                    "Untitled";

                const thumbnail =
                    snippet.thumbnail ||
                    "" ||
                    "" ||
                    "";

                return `
                    <article class="video-card">

                        <img
                            src="${esc(thumbnail)}"
                            alt="${esc(title)}"
                            loading="lazy"
                        >

                        <div class="video-body">

                            <div class="video-title">
                                ${esc(title)}
                            </div>

                            <div class="video-meta">
                                ${formatDate(snippet.publishedAt)}
                            </div>

                            <a
                                class="watch"
                                href="https://www.youtube.com/watch?v=${encodeURIComponent(id || "")}"
                                target="_blank"
                                rel="noopener"
                            >
                                Watch video \u2197</a>

                        </div>

                    </article>
                `;

            }).join("");

    } catch (error) {

        console.error(error);

        $("videosGrid").innerHTML =
            `<p>${esc(error.message)}</p>`;
    }
}


function renderMilestones(subscribers) {

    const levels = [
        100,
        1000,
        5000,
        10000,
        50000,
        100000,
        500000,
        1000000
    ];

    $("milestones").innerHTML =
        levels.map(level => {

            const done =
                subscribers >= level;

            return `
                <div class="milestone ${done ? "\u2713" : "\u25CB"}">

                    <div class="check">
                        ${done ? "\u2713" : "\u25CB"}
                    </div>

                    <b>
                        ${num(level)}
                    </b>

                    <span>
                        subscribers
                    </span>

                </div>
            `;

        }).join("");
}


function focusSearch() {

    $("query").focus();

    $("query").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function toggleTheme() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "creatorhub_theme",
        dark ? "dark" : "light"
    );

    $("themeToggle").textContent =
        dark ? "\u2600\uFE0F" : "\u263E";
}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "creatorhub_theme"
        );

    if (theme === "dark") {

        document.body.classList.add("dark");

        $("themeToggle").textContent = "\u263E";

    } else {

        $("themeToggle").textContent = "\u263E";
    }
}


$("go").addEventListener(
    "click",
    analyze
);


$("query").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter")
            analyze();

    }
);


$("themeToggle").addEventListener(
    "click",
    toggleTheme
);


document.addEventListener(
    "keydown",
    event => {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            focusSearch();
        }

    }
);


loadTheme();



