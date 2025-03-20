import { notification } from "antd";

export const useAntNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const antNotification = ({ type, customTitle, customMessage }) => {
    switch (type) {
      case "error":
        api[type]({
          message: customTitle || "Error",
          description: customMessage || "Something went wrong",
          className:
            "bg-[#1f1f20] [&_.ant-notification-notice-message]:!text-white [&_.ant-notification-notice-description]:!text-white",
          duration: 4,
        });
    }
  };

  return { antNotification, contextHolder };
};
