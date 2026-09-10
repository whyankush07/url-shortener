export class IdGenerator {
    private currentId: number = 1;

    public generate(): number {
        return this.currentId++;
    }
}