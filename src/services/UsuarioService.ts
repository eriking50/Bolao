import JSONUsuariosRepository from "../repositories/JSONUsuariosRepository";
import UsuarioRepository from "../repositories/UsuariosRepository";
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
    protected usuariosRepository: UsuarioRepository;
    protected usuarioLogado: string;

    constructor() {
        this.usuariosRepository = new JSONUsuariosRepository();
        this.usuarioLogado = "";
    }

    public async adcionarUsuario(usuario: Usuario): Promise<void> {
        try {
            if (!EmailHelper.validarEmail(usuario.getEmail())) {
                throw new Error(`Email inválido, tente outro.`);
            }
            const usuarios = await this.usuariosRepository.findAll();
            if (!this.isUnico(usuario.getEmail(), usuarios)) {
                throw new Error("Email já cadastrado no sistema, tente outro");
            }
            usuarios.push(usuario);
            return await this.usuariosRepository.save(usuarios);
        } catch (error) {
            throw new Error(`Não foi possível adicionar usuário. motivo: ${error.message}`);
        }
    }

    public async getUsuarios(): Promise<Usuario[]> {
        const usuarios = await this.usuariosRepository.findAll();
        return usuarios;
    }

    public async realizarLogin(login: LoginDTO): Promise<void> {
        try {
            const usuarios = await this.usuariosRepository.findAll();
            const usuarioBD = usuarios.find(usuarioFind => {
                return usuarioFind.getEmail() === login.email;
            })

            if (usuarioBD) {
                if (usuarioBD.getSenha() === HashHelper.hash(login.senha)) {
                    this.usuarioLogado = usuarioBD.getEmail();
                    return;
                }
            }
            throw new Error("O usuário não existe ou os dados estão incorretos");
        } catch (error) {
            throw new Error(`Não foi possível fazer login. motivo: ${error.message}`);
        }
    }

    public deslogar() {
        this.usuarioLogado = "";
    }

    public async alterarCadastro(dados: AlterarCadastroDTO): Promise<void> {
        try {
            const usuarios = await this.usuariosRepository.findAll();
            if (!this.usuarioLogado) {
                throw new Error("Você precisa estar logado para poder fazer essas alterações.");
            }
            if (this.usuarioLogado !== dados.email) {
                throw new Error("Você não pode alterar uma conta que não seja a sua.");
            }
            if (!dados.nome && !dados.senha) {
                throw new Error("Não há dados para serem alterados");
            }
            const usuarioBD = usuarios.find((usuario) => {
                return usuario.getEmail() === dados.email;
            })
            if (!usuarioBD.getStatus()) {
                throw new Error("O usuário não está ativo, ative para poder alterar os dados.");
            }
            if (dados.nome) usuarioBD.setNome(dados.nome);
            if (dados.senha) usuarioBD.setNome(dados.senha);

            return await this.usuariosRepository.update(usuarioBD);
        } catch (error) {
            throw new Error(`Não foi possível alterar os dados do usuario. motivo: ${error.message}`);
        }
    }

    public async alterarStatusUsuario(dados: AlterarStatus): Promise<void> {
        try {
            const usuarios = await this.usuariosRepository.findAll();
            if (!this.usuarioLogado) {
                throw new Error("Você precisa estar logado para poder fazer essas alterações.");
            }
            if (this.usuarioLogado !== dados.email) {
                throw new Error("Você não pode alterar uma conta que não seja a sua.");
            }
            const usuarioBD = usuarios.find((usuario) => {
                return usuario.getEmail() === dados.email;
            })
            usuarioBD.setStatus(dados.status);

            return await this.usuariosRepository.update(usuarioBD);
        } catch (error) {
            throw new Error(`Não foi possível alterar status do usuário. motivo: ${error.message}`);
        }
    }

    public getUsuarioLogado(): string {
        return this.usuarioLogado;
    }

    public isUnico(email: string, usuarios: Usuario[]): boolean {
        if (!usuarios.length) {
            return true;
        }
        for (const usuario of usuarios) {
            if (usuario.getEmail() === email) {
                return false;
            }
        }
        return true;
    }
}