import WorkflowCanvas from "./components/Canvas/WorkflowCanvas";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return(
  <>
  <WorkflowCanvas />;
   <ToastContainer />
   </>)
}

export default App;
