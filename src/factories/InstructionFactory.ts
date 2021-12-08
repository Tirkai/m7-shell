import { Instruction } from "models/instruction/Instruction";
import { NotificationModel } from "models/notification/NotificationModel";

interface ICreateInstructionOptions {
    notification: NotificationModel;
}

export class InstructionFactory {
    static createInstruction(options: ICreateInstructionOptions) {
        return new Instruction({
            notificationId: options.notification.id,
            notificationTitle: options.notification.title,
            notificationContent: options.notification.text,
            instructionContent: options.notification.instruction,
            applicationId: options.notification.applicationId,
        });
    }
}
