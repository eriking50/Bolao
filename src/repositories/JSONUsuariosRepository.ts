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
  public async findAll(): Promise<Usuario[]> {
    const usuariosContent = await readFile(this.usuariosFilePath);
    const usuariosFile = JSON.parse(usuariosContent.toString()) as UsuarioFile[];
    return usuariosFile.map(
      ({ nome, email, senha }) => new Usuario(nome, email, senha)
    );
  }

  // --- Encontra um usuario pelo seu email
  public async findByEmail(email: string): Promise<Usuario> {
    try {
      const usuarios = await this.findAll();

      const usuarioBD = usuarios.find(usuario => usuario.getEmail() === email);
      
      if (usuarioBD) {
        return usuarioBD;
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
      const usuarioIndex = usuarios.findIndex(usuarioFind => usuarioFind.getEmail() === email);

      if (usuarioIndex >= 0) {
        usuarios.splice(usuarioIndex, 1);
        await this.save(usuarios);
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
      const usuarioIndex = usuarios.findIndex(usuarioFind => usuarioFind.getEmail() === usuario.getEmail());

      if (usuarioIndex >= 0) {
        usuarios.splice(usuarioIndex, 1, usuario);
        await this.save(usuarios);
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