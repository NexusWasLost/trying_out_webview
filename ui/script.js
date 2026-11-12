window.addEventListener("DOMContentLoaded", async function () {
    const info = await window.getSystemInfo();
    console.log(``);

    console.log(`PC: ${info.host}@${info.username} [${info.locale}]`);
    console.log(`CPU: ${info.cpu} (${info.cpu_architecture})`);
    console.log(`OS: ${info.OSProductName} ${info.OS_BuildNumber} (Build ${info.OS_BuildNumber})`);
    console.log(`Memory: ${info.availableRAM}MB / ${info.totalRAM}MB (${info.usedRAM}MB used)`);
    console.log(`Memory Load: ${info.RAMload}%`);
    console.log(`Uptime: ${info.uptime} seconds`);
    console.log();

    console.log("Display:\n");
    info.display.forEach(function (disp, idx) {
        console.log(`Display ${idx + 1}: ${disp.width} x ${disp.height} @ ${disp.refreshRate}Hz`);
    });

    console.log("Graphics:\n");
    info.Graphics.forEach(function (gpu, idx) {
        console.log(`Graphics ${idx + 1}: ${gpu.GPU_Name} (${gpu.GPU_VRAM}MB)`);
    });

    console.log("Disks:\n");
    info.disks.forEach(function (disk){
        console.log(`${disk.diskLetter} ${disk.volumeLabel}: ${disk.freeSpace}MB free of ${disk.totalSpace}MB (${disk.usedSpace}MB used)[${disk.fileSystemName}]`);
    })

    console.log("Network:\n");
    info.network.forEach(function(net, idx){
        console.log(`Network adapter ${idx + 1}: ${net.networkAdapterName} (${net.networkAdapterDesc})`);
    });
})
