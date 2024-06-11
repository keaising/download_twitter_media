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
    let fetchs = await Promise.all(ps);
    console.log("promise done", fetchs.length);
    var zip = new JSZip();
    var img = zip.folder("media");

    console.log(1);
    fetchs.forEach((data) => {
      img!.file(`${data.name}.${data.format}`, data.data);
    });
    console.log(2, img);
    // console.log(3, zip.generateAsync({ type: "blob" }));
    zip
      .generateAsync({ type: "blob" })
      .then((blob) => {
        console.log(3);
        saveAs(blob, `${window.location.pathname.split("/")[1]}.zip`);
        console.log("blob size", blob.size);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        console.log("done");
      });
  }

  async function downloadURL(urlStr: string): Promise<{
    name: String;
    format: String;
    data: Blob;
  }> {
    // https://pbs.twimg.com/media/GGw-LBGasAAtoMP?format=jpg&name=4096x4096
    let url = new URL(urlStr);
    let pathnames = url.pathname.split("/");
    let name = pathnames[pathnames.length - 1];
    let format = url.searchParams.get("format")!;
    url.searchParams.set("name", "large");
    console.log("fetch data begin: ");
    let f = await fetch(url.toString());
    console.log("fetch data end: ");
    let data = await f.blob();
    console.log("data size: ", data.size);
    return {
      name: name,
      format: format,
      data: data,
    };
  }

  function shouldDisplay() {
    const urlPattern = /^https:\/\/x\.com\/[^\/]+\/media/;
    return urlPattern.test(window.location.href);
  }

  return (
    <>
      {shouldDisplay() && (
        <div className="fixed top-2 right-2 text-center">
          <button
            className="bg-black text-white font-bold py-2 px-4 rounded-full"
            onClick={download}
          >
            Download Media
          </button>
        </div>
      )}
    </>
  );
}

export default App;
