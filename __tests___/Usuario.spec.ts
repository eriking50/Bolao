import { HashSenha } from "../src/models/HashSenha";
import Usuario from "../src/models/Usuario";

describe("Testes da classe model: Usuário", () => {
    describe("Função que retorna o nome do Usuário", () =>{
        it("Deve retornar o nome Erik quando chamado a função", () => {
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            
            expect(usuario.getNome()).toBe("Erik");
        });
    });

    describe("Função que retorna o email de um Usuário", () => {
        it("Deve retornar o email erik@email.com quando chamado a função", () => {
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            
            expect(usuario.getEmail()).toBe("erik@email.com");
        });
    });
    
    describe("Função que retorna a senha de um Usuário", () =>{
        it("Deve retornar a senha de um Usuário com hash", () => {
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const hashSenha = HashSenha.hash("123456");
            
            expect(usuario.getSenha()).toBe(hashSenha);
        });
    });

    describe("Função que altera o nome de um Usuário", () =>{
        it("Deve alterar o nome do usuário para Erin quando chamado a função", () => {
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            usuario.setNome("Erin");
            
            expect(usuario.getNome()).toBe("Erin");
        });
    });
    
    describe("Função que altera a senha de um Usuário", () =>{
        it("Deve alterar a senha do usuário para 654321", () => {
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            usuario.setSenha("654321");
            const hashSenha = HashSenha.hash("654321");
            
            expect(usuario.getSenha()).toBe(hashSenha);
        });
    });
})