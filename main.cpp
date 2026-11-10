#include "webview/webview.h"
#include "lumi.h"
#include "lumi_functions.h"

#include <iostream>
#include <string>
#include <filesystem>

std::string greet(const std::string& req) {
    return "\"Hello Nexus\"";
}

std::string lumiVersion(const std::string& req){
    return "\"" LUMI_VERSION_STRING "\"";
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

    //register a global JS function
    w.bind("greet", greet);
    w.bind("lumiVersion", lumiVersion);

    w.run();
  }
  catch (const webview::exception &e) {
    MessageBoxA(nullptr, e.what(), "webview error", MB_OK);
    return 1;
  }

  return 0;
}
