const CPP_BINDING = document.querySelector(".CPP_BINDING");
CPP_BINDING.addEventListener("click", async function(){
    const message = await window.greet();
    alert(`Called C++ function, message recieved: ${ message }`);
    const version = await window.lumiVersion();
    console.log(version);
});

const toast = document.getElementById("toast");

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// Navigation

document.querySelectorAll("[data-page]").forEach(item => {
    item.addEventListener("click", event => {
        event.preventDefault();

        const page = item.dataset.page;

        document.querySelectorAll(".nav-item").forEach(nav => {
            nav.classList.remove("active");
        });

        const matchingNav = document.querySelector(
            `.nav-item[data-page="${page}"]`
        );

        if (matchingNav) {
            matchingNav.classList.add("active");
        }

        document.getElementById("pageTitle").textContent = page;

        if (page !== "Overview") {
            showToast(`${page} section selected`);
        }

        document.getElementById("sidebar").classList.remove("open");
    });
});


// Mobile sidebar

document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
});


// Theme toggle

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");

    localStorage.setItem("forma-theme", isLight ? "light" : "dark");

    showToast(`${isLight ? "Light" : "Dark"} theme enabled`);
});

if (localStorage.getItem("forma-theme") === "light") {
    document.body.classList.add("light");
}


// Task creation

const taskList = document.getElementById("taskList");

function createTask() {
    const taskName = prompt("What needs to be done?");

    if (!taskName || !taskName.trim()) return;

    const task = document.createElement("label");
    task.className = "task-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const check = document.createElement("span");
    check.className = "custom-check";

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = taskName.trim();

    const priority = document.createElement("span");
    priority.className = "task-priority low";
    priority.textContent = "New";

    task.append(checkbox, check, name, priority);
    taskList.appendChild(task);

    showToast("Task added successfully");
}

document.getElementById("newTask").addEventListener("click", createTask);
document.getElementById("addTask").addEventListener("click", createTask);


// Search

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    document.querySelectorAll(".project-row").forEach(project => {
        project.style.display = project.textContent
            .toLowerCase()
            .includes(query) ? "" : "none";
    });

    document.querySelectorAll(".task-row").forEach(task => {
        task.style.display = task.textContent
            .toLowerCase()
            .includes(query) ? "" : "none";
    });
});


// Keyboard shortcut

document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.focus();
    }

    if (event.key === "Escape") {
        searchInput.blur();
        document.getElementById("sidebar").classList.remove("open");
    }
});


// Chart period selector

document.getElementById("chartPeriod").addEventListener("change", event => {
    const values = event.target.value === "Last 30 days"
        ? [65, 48, 85, 72, 92, 60, 78]
        : [42, 68, 55, 85, 62, 95, 38];

    document.querySelectorAll(".bar").forEach((bar, index) => {
        bar.style.setProperty("--height", `${values[index]}%`);
    });

    showToast(`Showing ${event.target.value.toLowerCase()}`);
});


// Initialisation

console.log("Forma workspace initialized.");
