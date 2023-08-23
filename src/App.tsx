import About from "./components/About";
import Carousel from "./components/Carousel";
import { Provider } from "./context/Context";

const App = () => {
  return (
    <Provider>
      <div className="App">
        <Carousel />
        <About />
      </div>
    </Provider>
  );
};

export default App;
