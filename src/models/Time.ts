export default class Time {
  private static idTimeAtual = 1;
  protected id: number;
  protected nome: string;
  protected estado: string;

  public constructor(nome: string, id?: number) {
    this.nome = nome;
    if (id) {
      this.id = id;
      if (id > Time.idTimeAtual) {
        Time.idTimeAtual = ++id;
      }
    } else {
      this.id = Time.idTimeAtual;
      Time.idTimeAtual++;
    }
  }

  public getNome(): string {
    return this.nome;
  }

  public getId(): number {
    return this.id;
  }

}
