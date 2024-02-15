import "./App.css";
import SrcList from "./Src";

function App() {
  const divsWithTestId = document.querySelectorAll(
    '[data-testid="cellInnerDiv"]',
  );

  divsWithTestId.forEach((div) => {
    const img = div.querySelector("img");

    if (img) {
      console.log(img.src); // 这里可以对src进行任何你需要的处理
    }
  });
  return (
    <div className="App fixed">
      <h1>Vite + React</h1>
      <SrcList />
    </div>
  );
}

export default App;
