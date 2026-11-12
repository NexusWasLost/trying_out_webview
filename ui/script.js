function formatMB(mb) {
    if (mb >= 1024) {
        const gb = (mb / 1024).toFixed(1);
        return `${gb} GB`;
    }
    return `${mb} MB`;
}

function formatUptime(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(" ");
}

function getUsageLevel(percent) {
    if (percent >= 90) return "level-danger";
    if (percent >= 75) return "level-warn";
    return "level-ok";
}

function createElement(tag, className, textContent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent !== undefined) el.textContent = textContent;
    return el;
}

function renderSystemInfo(info) {
    // Top Header Identity
    document.querySelector("#host-user").textContent = `${info.host}@${info.username}`;
    document.querySelector("#locale-badge").textContent = info.locale;
    document.querySelector("#uptime-value").textContent = formatUptime(info.uptime);

    // CPU
    document.querySelector("#cpu-name").textContent = info.cpu;
    document.querySelector("#cpu-arch").textContent = info.cpu_architecture;

    // Operating System (Handles OSProductName, optional OS_Version / OSVersion, and OS_BuildNumber)
    document.querySelector("#os-name").textContent = info.OSProductName;
    const osVersion = info.OS_Version || info.OSVersion || info.OS_ReleaseId || "";
    const versionBadge = document.querySelector("#os-version-badge");
    if (osVersion) {
        versionBadge.textContent = `${osVersion}`;
    } else {
        versionBadge.textContent = `Build ${info.OS_BuildNumber}`;
    }
    document.querySelector("#os-build-detail").textContent = `OS Build ${info.OS_BuildNumber}`;

    // Memory
    document.querySelector("#ram-percent").textContent = `${info.RAMload}%`;
    document.querySelector("#ram-bar").style.width = `${info.RAMload}%`;
    document.querySelector("#ram-bar").className = `progress-fill ${getUsageLevel(info.RAMload)}`;
    document.querySelector("#ram-used").textContent = `${formatMB(info.usedRAM)} (${info.usedRAM} MB)`;
    document.querySelector("#ram-avail").textContent = `${formatMB(info.availableRAM)} (${info.availableRAM} MB)`;
    document.querySelector("#ram-total").textContent = `${formatMB(info.totalRAM)} (${info.totalRAM} MB)`;

    // Graphics
    const gpuList = document.querySelector("#gpu-list");
    gpuList.innerHTML = "";
    info.Graphics.forEach(function (gpu) {
        const item = createElement("div", "list-item");
        const main = createElement("div", "item-main");
        const title = createElement("span", "item-title", gpu.GPU_Name);
        const badge = createElement("span", "badge mono", `${formatMB(gpu.GPU_VRAM)} VRAM`);

        main.appendChild(title);
        item.appendChild(main);
        item.appendChild(badge);
        gpuList.appendChild(item);
    });

    // Displays
    const displayList = document.querySelector("#display-list");
    displayList.innerHTML = "";
    info.display.forEach(function (disp, idx) {
        const item = createElement("div", "list-item");
        const main = createElement("div", "item-main");
        const title = createElement("span", "item-title", `Display ${idx + 1}`);
        const sub = createElement("span", "item-sub mono", `${disp.width} × ${disp.height}`);
        const badge = createElement("span", "badge mono", `${disp.refreshRate} Hz`);

        main.appendChild(title);
        main.appendChild(sub);
        item.appendChild(main);
        item.appendChild(badge);
        displayList.appendChild(item);
    });

    // Disks
    const diskList = document.querySelector("#disk-list");
    diskList.innerHTML = "";
    info.disks.forEach(function (disk) {
        const usedPercent = disk.totalSpace > 0
            ? Math.round((disk.usedSpace / disk.totalSpace) * 100)
            : 0;

        const diskCard = createElement("div", "disk-item");

        const top = createElement("div", "disk-top");
        const label = disk.volumeLabel ? `${disk.diskLetter} (${disk.volumeLabel})` : disk.diskLetter;
        const name = createElement("span", "disk-name", label);
        const fsBadge = createElement("span", "badge mono", disk.fileSystemName);
        top.appendChild(name);
        top.appendChild(fsBadge);

        const track = createElement("div", "progress-track");
        const fill = createElement("div", `progress-fill ${getUsageLevel(usedPercent)}`);
        fill.style.width = `${usedPercent}%`;
        track.appendChild(fill);

        const meta = createElement("div", "disk-meta mono");
        const usedText = createElement("span", "", `${formatMB(disk.usedSpace)} / ${formatMB(disk.totalSpace)}`);
        const freeText = createElement("span", "", `${formatMB(disk.freeSpace)} free`);
        meta.appendChild(usedText);
        meta.appendChild(freeText);

        diskCard.appendChild(top);
        diskCard.appendChild(track);
        diskCard.appendChild(meta);
        diskList.appendChild(diskCard);
    });

    // Network
    const networkList = document.querySelector("#network-list");
    networkList.innerHTML = "";
    info.network.forEach(function (net) {
        const item = createElement("div", "list-item");
        const main = createElement("div", "item-main");
        const title = createElement("span", "item-title", net.networkAdapterName);
        const sub = createElement("span", "item-sub", net.networkAdapterDesc);

        main.appendChild(title);
        main.appendChild(sub);
        item.appendChild(main);
        networkList.appendChild(item);
    });
}

async function fetchAndRender() {
    try {
        let info;
        if (typeof window.getSystemInfo === "function") {
            info = await window.getSystemInfo();
        }
        else{
            alert("Failed to get system information");
        }

        renderSystemInfo(info);
    } catch (err) {
        console.error("Failed to fetch system info:", err);
    }
}

window.addEventListener("DOMContentLoaded", async function () {
    await fetchAndRender();

    const refreshBtn = document.querySelector("#refresh-btn");
    refreshBtn.addEventListener("click", async function () {
        await fetchAndRender();
    });

    const allCards = document.querySelectorAll(".card");
    allCards.forEach(function (card) {
        card.addEventListener("mousemove", function (event) {
            const cardRect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${event.clientX - cardRect.left}px`);
            card.style.setProperty("--my", `${event.clientY - cardRect.top}px`);
        });
    });
});
