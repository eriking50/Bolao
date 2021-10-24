import { HashHelper } from "../src/models/helpers/HashHelper";
import { EmailHelper } from "../src/models/helpers/EmailHelper";
import Usuario from "../src/models/Usuario";

describe("Testes da classe model: Usuário", () => {
    describe("Testa a criação de um usuário", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve criar um usuário corretamente", ()=> {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");

            expect(usuario.getEmail()).toEqual("erik@email.com");
            expect(usuario.getNome()).toEqual("Erik");
            expect(usuario.getSenha()).toEqual("algum_hash");
        })
        it("Deve retornar um erro caso o email seja inválido", ()=> {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(false);
            const wrapper = () => {
                const usuario = new Usuario("Erik", "erik@email.com", "123456");
            }

            expect(wrapper).toThrow(Error);
        })
    })

    describe("Função que retorna o nome do Usuário", () =>{
        it("Deve retornar o nome Erik quando chamado a função", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            
            expect(usuario.getNome()).toBe("Erik");
        });
    });

    describe("Função que retorna o email de um Usuário", () => {
        it("Deve retornar o email erik@email.com quando chamado a função", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            
            expect(usuario.getEmail()).toBe("erik@email.com");
        });
    });
    
    describe("Função que retorna a senha de um Usuário", () =>{
        it("Deve retornar a senha de um Usuário com hash", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            
            expect(usuario.getSenha()).toEqual("algum_hash");
        });
    });

    // describe("Função que altera o nome de um Usuário", () =>{
    //     it("Deve alterar o nome do usuário para Erin quando chamado a função", () => {
    //         const usuario = new Usuario("Erik", "erik@email.com", "123456");
    //         usuario.setNome("Erin");
            
    //         expect(usuario.getNome()).toBe("Erin");
    //     });
    // });
    
    // describe("Função que altera a senha de um Usuário", () =>{
    //     it("Deve alterar a senha do usuário para 654321", () => {
    //         const usuario = new Usuario("Erik", "erik@email.com", "123456");
    //         usuario.setSenha("654321");
    //         const hashSenha = HashSenha.hash("654321");
            
    //         expect(usuario.getSenha()).toBe(hashSenha);
    //     });
    // });
})