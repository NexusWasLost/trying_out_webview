#include "webview/webview.h"
#include "lumi.h"
#include "lumi_functions.h"
#include "json.hpp"

#include <iostream>
#include <string>
#include <filesystem>

using json = nlohmann::json;

std::string wideToUtf8(wchar_t* wideText) {
    if (wideText == nullptr) {
        return "";
    }

    int byteCount = WideCharToMultiByte(CP_UTF8, 0, wideText, -1, nullptr, 0, nullptr, nullptr);
    if (byteCount <= 1) {
        return "";
    }

    std::string utf8Text(byteCount - 1, '\0');
    WideCharToMultiByte(CP_UTF8, 0, wideText, -1, &utf8Text[0], byteCount, nullptr, nullptr);
    return utf8Text;
}

std::string lumi(const std::string& req){
    LUMI lumi;

    getMemory(&lumi);
    getCPU(&lumi);
    getGPU(&lumi);
    getOS(&lumi);
    getDisplay(&lumi);
    getCurrentUsername(&lumi);
    getHostName(&lumi);
    getUptime(&lumi);
    getLocale(&lumi);
    getNetwork(&lumi);
    getDisk(&lumi);

    json j;

    j["cpu_architecture"] = lumi.CPU_Architecture;
    j["cpu"] = lumi.CPU;
    j["totalRAM"] = lumi.totalMemory;
    j["availableRAM"] = lumi.availableMemory;
    j["usedRAM"] = lumi.usedMemory;
    j["RAMload"] = lumi.memoryLoad;
    j["OSProductName"] = lumi.OS_ProductName;
    j["OS_Version"] = lumi.OS_Version;
    j["OS_BuildNumber"] = lumi.OS_BuildNumber;
    j["host"] = lumi.host;
    j["username"] = lumi.currentUserName;
    j["locale"] = wideToUtf8(lumi.locale);
    j["uptime"] = lumi.uptime;

    for(int x = 0; x < lumi.diskCount; x++){
        json disk;
        disk["diskLetter"] = std::string(1, static_cast<char>(lumi.disks[x].diskLetter));
        disk["fileSystemName"] = wideToUtf8(lumi.disks[x].fileSystemName);
        disk["volumeLabel"] = wideToUtf8(lumi.disks[x].volumeLabel) ;
        disk["totalSpace"] = lumi.disks[x].totalSpace;
        disk["freeSpace"] = lumi.disks[x].freeSpace;
        disk["usedSpace"] = lumi.disks[x].usedSpace;
        j["disks"].push_back(disk);
    }

    for(int x = 0; x < lumi.networkAdapterCount; x++){
        json net;
        net["networkAdapterName"] = wideToUtf8(lumi.net_Adapters[x].networkAdapterName);
        net["networkAdapterDesc"] = wideToUtf8(lumi.net_Adapters[x].networkAdapterDesc);
        j["network"].push_back(net);
    }

    for(int x = 0; x < lumi.gpuCount; x++){
        json __gpu;
        __gpu["GPU_Name"] = wideToUtf8(lumi.gpu[x].GPU_Name);
        __gpu["GPU_VRAM"] = lumi.gpu[x].totalVRAM;
        j["Graphics"].push_back(__gpu);
    }

    for(int x = 0; x < lumi.displayCount; x++){
        json disp;
        disp["width"] = lumi.monitors[x].width;
        disp["height"] = lumi.monitors[x].height;
        disp["refreshRate"] = lumi.monitors[x].refreshRate;
        j["display"].push_back(disp);
    }

    return j.dump();
}

#ifdef _WIN32
int WINAPI WinMain(HINSTANCE /*hInst*/, HINSTANCE /*hPrevInst*/,
                   LPSTR /*lpCmdLine*/, int /*nCmdShow*/) {
#else
int main() {
#endif
  try {
    webview::webview w(true, nullptr);
    w.set_title("Basic Example");
    w.set_size(1280, 720, WEBVIEW_HINT_NONE);

    auto path = std::filesystem::absolute("./ui/index.html");
    w.navigate("file:///" + path.generic_string());

    w.bind("getSystemInfo", lumi);

    w.run();
  }
  catch (const webview::exception &e) {
    MessageBoxA(nullptr, e.what(), "webview error", MB_OK);
    return 1;
  }

  return 0;
}
