import Usuario from "../models/Usuario";

export default interface UsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findByEmail(email: string): Promise<Usuario>;
  remove(email: string): Promise<void>;
  update(usuario: Usuario): Promise<void>;
}
