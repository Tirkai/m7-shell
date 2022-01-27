// import { useStore } from "hooks/useStore";
// import { observer } from "mobx-react-lite";
// import { NotificationModel } from "models/notification/NotificationModel";
// import React from "react";
// import style from "./style.module.css";

// const className = style.confirmationNotificationsList;

// interface IConfirmationNotificationsListProps {
//     children?: React.ReactNode;
//     onCloseNotification: (notification: NotificationModel) => void;
//     onRunApplication: (appId: string, url: string) => void;
//     onConfirm: (notification: NotificationModel) => void;
//     onConfirmAndDrop: (notification: NotificationModel) => void;
// }

// export const ConfirmationNotificationsList = observer(
//     (props: IConfirmationNotificationsListProps) => {
//         const store = useStore();
//         return <div />;
//         // return (
//         //     <div className={classNames(className)}>
//         //         {store.notification.confirmationNotifications.map(
//         //             (notification) => (
//         //                 <NotificationCard
//         //                     key={notification.id}
//         //                     {...notification}
//         //                     onClick={() =>
//         //                         props.onRunApplication(
//         //                             notification.applicationId,
//         //                             notification.url,
//         //                         )
//         //                     }
//         //                     onConfirm={() => props.onConfirm(notification)}
//         //                     onConfirmAndDrop={() =>
//         //                         props.onConfirmAndDrop(notification)
//         //                     }
//         //                 />
//         //             ),
//         //         )}
//         //         {store.notification.confirmationNotifications.length <= 0 && (
//         //             <PlaceholderWithIcon
//         //                 icon={<SVGIcon source={empty} color="white" />}
//         //                 content={strings.notification.noMoreNotifications}
//         //             />
//         //         )}
//         //     </div>
//         // );
//     };
// // );

export default {};
