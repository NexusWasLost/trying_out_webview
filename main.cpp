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

    getCPU(&lumi);
    getMemory(&lumi);
    getDisk(&lumi);

    json j;

    j["cpu"] = lumi.CPU_Architecture;
    j["totalRAM"] = lumi.totalMemory;
    j["availableRAM"] = lumi.availableMemory;
    j["usedRAM"] = lumi.usedMemory;

    for(int x = 0; x < lumi.diskCount; x++){
        json disk;
        disk["diskLetter"] = wideToUtf8(&lumi.disks[x].diskLetter);
        disk["fileSystemName"] = wideToUtf8(lumi.disks[x].fileSystemName);
        disk["volumeLabel"] = wideToUtf8(lumi.disks[x].volumeLabel) ;
        disk["totalSpace"] = lumi.disks[x].totalSpace;
        disk["freeSpace"] = lumi.disks[x].freeSpace;
        disk["usedSpace"] = lumi.disks[x].usedSpace;
        j["disks"].push_back(disk);
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
