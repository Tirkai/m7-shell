interface IInstructionOptions {
    notificationId: string;
    notificationTitle: string;
    notificationContent: string;

    instructionContent: string;
}

export class Instruction {
    notificationId: string;
    notificationTitle: string;
    notificationContent: string;

    instructionContent: string;

    constructor(options: IInstructionOptions) {
        this.notificationId = options.notificationId;
        this.notificationTitle = options.notificationTitle;
        this.notificationContent = options.notificationContent;
        this.instructionContent = options.instructionContent;
    }
}
