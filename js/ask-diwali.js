// ============================================================
// ASK DIWALI AI - FRONTEND JAVASCRIPT
// File: js/ask-diwali.js
// Backend: FastAPI running on http://127.0.0.1:8001
// ============================================================

const ASK_API_BASE = "http://127.0.0.1:8001";

// DOM elements
const form = document.getElementById("ask-form");
const input = document.getElementById("question");
const messages = document.getElementById("messages");
const button = document.getElementById("send-button");
const errorBox = document.getElementById("error");

// Conversation history
const history = [];

// ============================================================
// CREATE HTML ELEMENTS SAFELY
// ============================================================

function el(parent, tag, text, cls) {
    const element = document.createElement(tag);

    if (cls) {
        element.className = cls;
    }

    if (text !== undefined && text !== null) {
        element.textContent = text;
    }

    parent.appendChild(element);
    return element;
}

// ============================================================
// DISPLAY CHAT MESSAGES AND SOURCES
// ============================================================

function addMessage(role, text, data = null) {
    const article = document.createElement("article");
    article.className = `message ${role}`;

    el(
        article,
        "div",
        role === "user" ? "You" : "Ask Diwali AI",
        "message-label"
    );

    el(article, "p", text);

    // Display sources returned by the backend.
    if (data && Array.isArray(data.sources) && data.sources.length > 0) {
        const section = document.createElement("section");
        section.className = "sources";

        el(section, "h3", "Sources to explore");

        const list = document.createElement("ol");

        data.sources.forEach((source) => {
            if (!source || typeof source.url !== "string") {
                return;
            }

            // Only allow HTTP and HTTPS source links.
            let parsedUrl;

            try {
                parsedUrl = new URL(source.url);
            } catch {
                return;
            }

            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                return;
            }

            const item = document.createElement("li");
            const link = document.createElement("a");

            link.href = parsedUrl.href;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = source.title || parsedUrl.href;

            item.appendChild(link);

            if (source.snippet) {
                el(item, "span", source.snippet, "source-snippet");
            }

            list.appendChild(item);
        });

        if (list.children.length > 0) {
            section.appendChild(list);
            article.appendChild(section);
        }
    }

    // Display an optional note returned by the backend.
    if (data && data.note) {
        el(article, "p", data.note, "note");
    }

    messages.appendChild(article);
    messages.scrollTop = messages.scrollHeight;
}

// ============================================================
// DISPLAY ERRORS
// ============================================================

function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
}

function hideError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
}

// ============================================================
// SEND A QUESTION TO THE FASTAPI BACKEND
// ============================================================

async function askQuestion(question) {
    hideError();

    addMessage("user", question);

    // Save the user question in conversation history.
    history.push({
        role: "user",
        content: question
    });

    button.disabled = true;
    button.querySelector("span").textContent = "Searching…";

    // Show a loading message while the API responds.
    const loading = document.createElement("article");
    loading.className = "message assistant";
    loading.id = "loading-message";

    el(loading, "div", "Ask Diwali AI", "message-label");

    el(
        loading,
        "p",
        "Searching the web and preparing an answer…"
    );

    messages.appendChild(loading);
    messages.scrollTop = messages.scrollHeight;

    try {
        const apiUrl = `${ASK_API_BASE.replace(/\/+$/, "")}/ask`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question,
                history: history.slice(-7, -1)
            })
        });

        // Read the API response.
        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "The assistant service returned an invalid response."
            );
        }

        if (!response.ok) {
            const detail =
                typeof data.detail === "string"
                    ? data.detail
                    : `The assistant service returned HTTP ${response.status}.`;

            throw new Error(detail);
        }

        if (!data || typeof data.answer !== "string" || !data.answer.trim()) {
            throw new Error(
                "No answer was returned. Please try another question."
            );
        }

        // Save the assistant response.
        history.push({
            role: "assistant",
            content: data.answer
        });

        // Display the answer and its sources.
        addMessage("assistant", data.answer, data);

    } catch (error) {
        console.error("Ask Diwali API error:", error);

        let message;

        if (error instanceof TypeError) {
            message =
                "Cannot connect to the Ask Diwali service. " +
                "Check that FastAPI is running at " +
                ASK_API_BASE +
                " and that CORS allows this website.";
        } else {
            message =
                error.message ||
                "Something went wrong. Please try again.";
        }

        showError(message);

        addMessage(
            "assistant",
            "Sorry, I couldn't complete that search. " +
            "Please check the service connection and try again."
        );

    } finally {
        document.getElementById("loading-message")?.remove();

        button.disabled = false;
        button.querySelector("span").textContent = "Ask";

        input.focus();
    }
}

// ============================================================
// HANDLE FORM SUBMISSION
// ============================================================

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = input.value.trim();

    if (question.length < 2) {
        showError("Please enter a question with at least two characters.");
        return;
    }

    if (question.length > 600) {
        showError("Please keep your question under 600 characters.");
        return;
    }

    input.value = "";

    await askQuestion(question);
});

// ============================================================
// HANDLE SUGGESTED QUESTIONS
// ============================================================

document.querySelectorAll(".suggestion").forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
        input.value = suggestion.textContent.trim();
        input.focus();
    });
});

// ============================================================
// INITIALIZE
// ============================================================

if (!form || !input || !messages || !button || !errorBox) {
    console.error(
        "Ask Diwali initialization failed. " +
        "Check the HTML element IDs."
    );
} else {
    console.log("Ask Diwali frontend initialized.");
    console.log("Configured API:", ASK_API_BASE);
}