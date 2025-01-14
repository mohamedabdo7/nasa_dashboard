import { toast } from "react-toastify";
import i18n from "./i18n";
import type { ToastContainerProps } from "react-toastify";

export const toastOptions: ToastContainerProps = {
  position: i18n.language === "ar" ? "top-left" : "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: i18n.language === "ar" ? true : false,
  pauseOnFocusLoss: false,
  draggable: false,
  bodyStyle: {
    direction: i18n.language === "ar" ? "rtl" : "ltr",
    fontSize: "0.8rem",
    textAlign: "start",
  },
};
// toast.configure();

export const showToast = (
  msg: string,
  type: "success" | "error" | "info" | "warning" = "success"
) => {
  switch (type) {
    case "success": {
      return toast.success(msg);
    }
    case "error": {
      return toast.error(msg);
    }
    case "info": {
      return toast.info(msg);
    }
    case "warning": {
      return toast.warning(msg);
    }
  }
};
