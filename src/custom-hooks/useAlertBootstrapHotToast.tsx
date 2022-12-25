import { useCallback } from "react";
import { Alert } from "react-bootstrap";
import { Toast, toast } from "react-hot-toast";
import { BootstrapIcon, BootstrapVariant } from "../utils/types";

type Args = {
  title?: ((toast: Toast) => React.ReactNode) | React.ReactNode,
  content?: ((toast: Toast) => React.ReactNode) | React.ReactNode,
  icon?: BootstrapIcon,
  variant?: BootstrapVariant,
  duration?: number,
}

const useAlert = () => {
  const launch = useCallback(({ title, content, icon, variant, duration }: Args) => {
    toast.custom(t => (
      <Alert show={t.visible} variant={variant} dismissible onClose={() => toast.dismiss(t.id)}>
        <Alert.Heading>
          {
            icon
              ? <i className={"bi bi-" + icon} />
              : undefined
          } {title && typeof title === "function" ? title(t) : title}
        </Alert.Heading>
        {content && typeof content === "function" ? content(t) : content}
      </Alert>
    ), { duration: duration || 3000, className: "toast-alert", position: "top-center" });
  }, []);

  return launch;
};

export default useAlert;
