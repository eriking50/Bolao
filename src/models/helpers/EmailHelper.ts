import Usuario from "../Usuario";

const REGEX_EMAIL = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export abstract class EmailHelper {
    public static validarEmail(email: string): boolean {
        return !!email.match(REGEX_EMAIL);
    }

    public static isUnico(email: string, usuarios: Usuario[]) {
        for (const usuario of usuarios) {
            if (usuario.getEmail() === email) {
                throw new Error("Este email já está cadastrado no sistema.");
            }
        }
        return true;
    }
}