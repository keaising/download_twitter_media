import { useEffect, useState } from "react";
import { GM_xmlhttpRequest } from "$";

const SrcList = () => {
  const [imgSrcList, setImgSrcList] = useState<string[]>([]);
  const [imgList, setImgList] = useState<any[]>([]);

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

    observer.observe(
      // document.querySelector("div[style*='position: relative']")!,
      document.body,
      { childList: true, subtree: true },
    );

    return () => {
      observer.disconnect();
    };
  }, [imgSrcList]);

  async function download() {
    let ps = imgSrcList.map((url, _) => downloadURL(url));
    console.log(ps);
    await Promise.all(ps).then((values) => {
      console.log(values);
    });
    console.log(imgList.length);
  }

  async function downloadURL(url: string) {
    return fetch(url).then((resp) => {
      return resp.blob();
    });
  }

  return (
    <div>
      <button onClick={download}>download</button>
    </div>
  );
};

export default SrcList;
