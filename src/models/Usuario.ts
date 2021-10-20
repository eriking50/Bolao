import { HashSenha } from "./HashSenha";

export default class Usuario {
  protected nome: string;
  protected readonly email: string;
  protected senha: string;

  public constructor(nome: string, email: string, senha: string) {
    this.nome = nome;
    this.email = email;
    this.senha = HashSenha.hash(senha);
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
    this.senha = HashSenha.hash(senha);
  }
}
