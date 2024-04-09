export class AlreadyCheckedInError extends Error {
    constructor() {
        super('Already checked in')
    }
}
