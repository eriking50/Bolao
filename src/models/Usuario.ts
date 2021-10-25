import { HashHelper } from "./helpers/HashHelper";

/** O usuário do sistema que fará as apostas */
export default class Usuario {
  protected nome: string;
  protected readonly email: string;
  protected senha: string;
  protected status: boolean;

  public constructor(nome: string, email: string, senha: string) {
    this.nome = nome;
    this.email = email;
    this.senha = HashHelper.hash(senha);
    this.status = true;
  }

  public getNome(): string {
    return this.nome;
  }

  public getEmail(): string {
    return this.email;
  }

  public getSenha(): string {
    return this.senha;
  }

  public setNome(nome: string): void {
    this.nome = nome;
  }

  public setSenha(senha: string): void {
    this.senha = HashHelper.hash(senha);
  }

  public getStatus(): boolean {
    return this.status;
  }

  public setStatus(status: boolean): void {
    this.status = status;
  }
}
