import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toaster = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={false}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      theme="light"
    />
  );
};
