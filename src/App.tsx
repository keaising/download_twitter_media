import "./App.css";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function App() {
  const [imgSrcList, setImgSrcList] = useState<string[]>([]);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      const newImgSrcList: string[] = [];
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLImageElement &&
              node.src.startsWith("https://pbs.twimg.com/media/")
            ) {
              newImgSrcList.push(node.src);
            }
          });
        }
      });
      setImgSrcList((pre) => {
        newImgSrcList.forEach((s) => {
          if (!pre.includes(s)) {
            pre.push(s);
          }
        });
        return [...pre];
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [imgSrcList]);

  async function download() {
    let ps = imgSrcList.map((url, _) => downloadURL(url));
    console.log(ps);
    await Promise.all(ps).then((values) => {
      // console.log(values);
      var zip = new JSZip();
      var img = zip.folder("media");

      values.forEach((data) => {
        img!.file(`${data.name}.${data.format}`, data.data);
      });
      zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, `${window.location.pathname.split("/")[1]}.zip`);
      });
    });
  }

  async function downloadURL(urlStr: string) {
    // https://pbs.twimg.com/media/GGw-LBGasAAtoMP?format=jpg&name=4096x4096
    let url = new URL(urlStr);
    let pathnames = url.pathname.split("/");
    let name = pathnames[pathnames.length - 1];
    let format = url.searchParams.get("format");
    url.searchParams.set("name", "large");
    return fetch(url.toString()).then((resp) => {
      return {
        name: name,
        format: format,
        data: resp.blob(),
      };
    });
  }

  return (
    <div className="App fixed">
      <button onClick={download}>download media</button>
    </div>
  );
}

export default App;
