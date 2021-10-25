import { EmailHelper } from "../models/helpers/EmailHelper";
import { HashHelper } from "../models/helpers/HashHelper";
import Usuario from "../models/Usuario";

export type LoginDTO = {
    email: string,
    senha: string
}

export type AlterarCadastroDTO = {
    email: string,
    nome?: string,
    senha?: string
}

export type AlterarStatus = {
    email: string,
    status: boolean
}

export default class UsuarioService {
    protected usuarios: Usuario[];
    protected usuarioLogado: string = "";

    constructor() {
        this.usuarios = [];
    }

    public adcionarUsuario(usuario: Usuario): void {
        try {
            if (!EmailHelper.validarEmail(usuario.getEmail())) {
                throw new Error(`Email inválido, tente outro.`);
            }
            if (this.isUnico(usuario.getEmail())) {
                this.usuarios.push(usuario);
                return;
            }
        } catch (error) {
            throw new Error(`Não foi possível cadastrar o usuário. Motivo: ${error.message}`);
        }
    }

    public getUsuarios(): Usuario[] {
        return this.usuarios;
    }

    public realizarLogin(login: LoginDTO): Usuario {
        const usuarioBD = this.usuarios.find(usuarioFind => {
            if (usuarioFind.getEmail() === login.email) {
                return true;
            }
        })
        if (usuarioBD) {
            if (usuarioBD.getSenha() === HashHelper.hash(login.senha)) {
                this.usuarioLogado = usuarioBD.getEmail();
                return;
            }
        }
        throw new Error("O usuário não existe ou os dados estão incorretos");
    }

    public deslogar() {
        this.usuarioLogado = "";
    }

    public alterarCadastro(dados: AlterarCadastroDTO): void {
        if (!this.usuarioLogado) {
            throw new Error("Você precisa estar logado para poder fazer essas alterações.");
        }
        if (this.usuarioLogado !== dados.email) {
            throw new Error("Você não pode alterar uma conta que não seja a sua.");
        }
        if (!dados.nome && !dados.senha) {
            throw new Error("Não há dados para serem alterados");
        }
        
        for (let i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].getEmail() === dados.email) {
                if (!this.usuarios[i].getStatus()) {
                    throw new Error("O usuário não está ativo, ative para poder alterar os dados.");
                }
                if (dados.nome && dados.nome.length > 0) {
                    this.usuarios[i].setNome(dados.nome);
                }
                if (dados.senha && dados.senha.length > 0) {
                    this.usuarios[i].setSenha(dados.senha);
                }
                return;
            }
        }
    }
    
    public alterarStatusUsuario(dados: AlterarStatus): void {
        if (!this.usuarioLogado) {
            throw new Error("Você precisa estar logado para poder fazer essas alterações.");
        }
        if (this.usuarioLogado !== dados.email) {
            throw new Error("Você não pode alterar uma conta que não seja a sua.");
        }
        this.usuarios.find((usuario, i) => {
            if (usuario.getEmail() === dados.email) {
                this.usuarios[i].setStatus(dados.status);
                return;
            }
        })
    }

    public getUsuarioLogado(): string {
        return this.usuarioLogado;
    }

    public isUnico(email: string): boolean {
        for (const usuario of this.usuarios) {
            if (usuario.getEmail() === email) {
                throw new Error("Este email já está cadastrado no sistema.");
            }
        }
        return true;
    }
}