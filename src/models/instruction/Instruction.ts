interface IInstructionOptions {
    notificationId: string;
    notificationTitle: string;
    notificationContent: string;
    applicationId: string;

    instructionContent: string;
}

export class Instruction {
    notificationId: string;
    notificationTitle: string;
    notificationContent: string;
    applicationId: string;

    instructionContent: string;

    constructor(options: IInstructionOptions) {
        this.notificationId = options.notificationId;
        this.notificationTitle = options.notificationTitle;
        this.notificationContent = options.notificationContent;
        this.applicationId = options.applicationId;
        this.instructionContent = options.instructionContent;
    }
}
