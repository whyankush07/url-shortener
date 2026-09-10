export class Base62Encoder {
    private static readonly ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    private static readonly base = Base62Encoder.ALPHABET.length;

    public static encode(num: number) : string {
        if (num === 0) return this.ALPHABET[0];

        let encoded = "";
        while (num > 0) {
            const remainder = num % this.base;
            encoded = this.ALPHABET[remainder] + encoded;
            num = Math.floor(num / this.base);
        }

        return encoded;
    }
}