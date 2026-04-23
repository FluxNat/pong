const NotificationProvider = require("./notification-provider");
const axios = require("axios");

const defaultNotificationService = "notify";

class HomeAssistant extends NotificationProvider {
    name = "HomeAssistant";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        const notificationService = notification?.notificationService || defaultNotificationService;

        try {
            let config = {
                headers: {
                    Authorization: `Bearer ${notification.longLivedAccessToken}`,
                    "Content-Type": "application/json",
                },
            };
            config = this.getAxiosConfigWithProxy(config);
            await axios.post(
                `${notification.homeAssistantUrl.trim().replace(/\/*$/, "")}/api/services/notify/${notificationService}`,
                {
                    title: "Pong",
                    message: msg,
                    ...(notificationService !== "persistent_notification" && {
                        data: {
                            name: monitorJSON?.name,
                            status: heartbeatJSON?.status,
                            channel: "Pong",
                            icon_url: "https://github.com/k4ran909/pong/blob/master/public/icon.png?raw=true",
                        },
                    }),
                },
                config
            );

            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = HomeAssistant;
