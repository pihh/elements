export class PihhController {
    static instance;
    constructor(params) {
        if(PihhController.instance) return PihhController.instance;
        PihhController.instance = this;
    }
}

