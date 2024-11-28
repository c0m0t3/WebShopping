import { toast } from "react-toastify";

export const showToast = (
  message: string,
  type: "success" | "error" | "warn",
) => {
  const options = {
    position: "top-right" as const,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warn":
      toast.warn(message, options);
      break;
    default:
      break;
  }
};
