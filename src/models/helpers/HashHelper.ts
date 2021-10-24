import crypto from "crypto";

export abstract class HashHelper {
    public static hash(senha: string): string {
        const secret = "secret_bem_incomum_da_galera_montar_tabelas";
        return crypto.createHmac("sha256", secret).update(senha).digest("hex");
    }
}