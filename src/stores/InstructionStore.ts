import { makeAutoObservable } from "mobx";
import { Instruction } from "models/instruction/Instruction";
import { AppStore } from "stores/AppStore";

export class InstructionStore {
    private store: AppStore;

    isShowInstruction: boolean = false;

    instruction: Instruction | null = null;

    setShowInstruction(value: boolean) {
        this.isShowInstruction = value;
    }

    setInstruction(value: Instruction) {
        this.instruction = value;
    }

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);
    }
}
