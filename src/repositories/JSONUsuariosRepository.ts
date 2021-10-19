import Usuario from "../models/Usuario";
import UsuariosRepository from "./UsuariosRepository";
import * as fs from "fs"; 
const { readFile, writeFile } = fs.promises;

const USUARIOS_FILE_PATH = "./files/usuarios.json";

export type UsuarioFile = {
  nome: string;
  email: string;
  senha: string;
};

export default class JSONUsuariosRepository implements UsuariosRepository {

  private usuariosFilePath: string;

  constructor(outrosUsuarios?: string) {
    this.usuariosFilePath = outrosUsuarios || USUARIOS_FILE_PATH;
  }

  // --- Recupera todos
  public findAll(): Promise<Usuario[]> {
    return readFile(this.usuariosFilePath)
      .then( (usuariosContent) => {
        const usuariosFile = JSON.parse(usuariosContent.toString()) as UsuarioFile[];
        return usuariosFile.map(
          ({ nome, email, senha }) => new Usuario( nome, email, senha)
        );
      })
  }

  // --- Encontra um usuario pelo seu email
  public async findByEmail(email: string): Promise<Usuario> {
    try {
      const usuarios = await this.findAll();
      for (const usuario of usuarios) {
        if (usuario.getEmail() === email) {
          return usuario;
        }
      }
      throw new Error(`Email não encontrado na base de dados`);
    } catch (error) {
      throw new Error(`Falha ao encontrar usuário. Motivo: ${error.message}.`);
    }
  }

  // --- Remove um usuario pelo seu email
  public async remove(email: string): Promise<void> {
    try {
      const usuarios = await this.findAll();
      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].getEmail() === email) {
          usuarios.splice(i, 1);
          await this.save(usuarios);
          console.log("Usuário removido com sucesso!");
          return;
        }
      }
      throw new Error(`Email não encontrado na base de dados`);
    } catch (error) {
      throw new Error(`Falha ao remover usuário. Motivo: ${error.message}.`);
    }
  }

  // --- Atualiza um usuario
  public async update(usuario: Usuario): Promise<void> {
    try {
      const usuarios = await this.findAll();
      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].getEmail() === usuario.getEmail()) {
          usuarios[i].setNome(usuario.getNome());
          usuarios[i].setSenha(usuario.getSenha());
          await this.save(usuarios);
          console.log("Usuário alterado com sucesso!");
          return;
        }
      }
      throw new Error(`Email não encontrado na base de dados`);
    } catch (error) {
      throw new Error(`Falha ao alterar usuário. Motivo: ${error.message}.`);
    }
  }

  public async save(usuarios: Usuario[]): Promise<void> {
    try {
      return writeFile(this.usuariosFilePath, JSON.stringify(usuarios, null, 2));
    } catch (erro) {
      throw new Error(`Falha ao salvar os usuários. Motivo: ${erro.message}.`);
    }
  }
}