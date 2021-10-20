import Time from "../src/models/Time";

describe("Testes da classe model: Time", () =>{
    describe("Função que retorna o nome de um time", () => {
        it("Deve retornar o nome Barcelona quando a função for chamada", () => {
            const time = new Time("Barcelona");

            expect(time.getNome()).toBe("Barcelona");
        });
    });
    describe("Função que retorna o id de um time", () => {
        it("Deve retornar o id 1 quando a função for chamada", () => {
            const time = new Time("Barcelona", 1);

            expect(time.getId()).toBe(1);
        });
    });
    describe("Teste para quando o id informado é maior que o id estático", () => {
        it("Deve retornar o id 1 quando a função for chamada", () => {
            const time1 = new Time("Barcelona", 1);
            const time2 = new Time("Barcelona", 5);

            expect(time2.getId()).toBe(5);
        });
    });
});