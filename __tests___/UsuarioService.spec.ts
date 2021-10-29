import Usuario from "../src/models/Usuario";
import UsuarioService from "../src/services/UsuarioService";
import JSONUsuariosRepository from "../src/repositories/JSONUsuariosRepository";
import { HashHelper } from "../src/models/helpers/HashHelper"
import { EmailHelper } from "../src/models/helpers/EmailHelper"

describe("Testes da classe service: UsuarioService", () => {
    describe("Testa a criação de uma instância da classe UsuarioService", () => {
        const usuarioService = new UsuarioService();

        expect(usuarioService).toBeDefined();
    })
    describe("Testa a função que cria um usuário", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar erro caso não consiga recuperar dados do banco", () => {
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockRejectedValue(new Error("Não foi possivel recuperar dados do banco"));
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();

            expect(usuarioService.adcionarUsuario(usuario)).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso não consiga salvar dados do banco", () => {
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([]);
            jest.spyOn(JSONUsuariosRepository.prototype, "save").mockRejectedValue(new Error("Não foi possivel salvar dados do banco"));
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();

            expect(usuarioService.adcionarUsuario(usuario)).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso o email já esteja registrado no banco de dados", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);

            expect(usuarioService.adcionarUsuario(usuario)).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso o email seja inválido", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(false);
            const usuario = new Usuario("Erik", "erik", "123456");
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([]);
            const usuarioService = new UsuarioService();

            expect(usuarioService.adcionarUsuario(usuario)).rejects.toThrow(Error);
        })
        it("Deve criar um usuário no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValueOnce([]);
            jest.spyOn(JSONUsuariosRepository.prototype, "save").mockResolvedValueOnce();
            const result = usuarioService.adcionarUsuario(usuario);

            expect(result).resolves.not.toBeDefined();
        })
    })
    describe("Testa a função que faz login no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar erro caso não seja possível recuperar os dados do banco", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockRejectedValue(new Error("Erro ao recuperar dados do banco"));
            
            expect(usuarioService.realizarLogin({email: "joao@email.com", senha: "321"})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso não seja possível fazer o login", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            
            expect(usuarioService.realizarLogin({email: "joao@email.com", senha: "321"})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso a senha esteja errada", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("outro_hash");
            
            expect(usuarioService.realizarLogin({email: "erik@email.com", senha: "1"})).rejects.toThrow(Error);
        })
        it("Deve logar corretamente no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            
            expect(usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"})).resolves.not.toBeDefined();
        })
    })
    describe("Testa a função que faz alteração dos dados do usuario no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar erro caso não consiga recuperar os dados do banco", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockRejectedValue(new Error("Não foi possivel recuperar os dados do banco"));
            
            expect(usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso o usuário não esteja logado", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            
            expect(usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso um usuário esteja tentado alterar o dado de outro usuario", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuario2 = new Usuario("Patrick", "patrick@email.com", "123456");
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario, usuario2]);
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockResolvedValue();
            const usuarioService = new UsuarioService();
            usuarioService.realizarLogin({email: "patrick@email.com", senha: "123456"});
            
            expect(usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso o usuário não esteja com status ativo", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            usuario.setStatus(false);
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockResolvedValue();
            const usuarioService = new UsuarioService();
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            
            expect(usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso o usuário não esteja logado", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockResolvedValue();
            const usuarioService = new UsuarioService();
            
            expect(usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso o usuário não tenha mandados dados além do email", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockResolvedValue();
            const usuarioService = new UsuarioService();
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            
            expect(usuarioService.alterarCadastro({email: "erik@email.com"})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso não consiga salvar os dados alterados", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockRejectedValue(new Error("Falha ao salvar dados no banco"));
            const usuarioService = new UsuarioService();
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});

            expect(usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"})).rejects.toThrow(Error);
        })
        it("Deve alterar o cadastro corretamente no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockResolvedValue();
            const usuarioService = new UsuarioService();
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});

            expect(usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp", senha: "321"})).resolves.not.toBeDefined();
        })
        it("Deve alterar o cadastro corretamente no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockResolvedValue();
            const usuarioService = new UsuarioService();
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});

            expect(usuarioService.alterarCadastro({email: "erik@email.com", senha: "321"})).resolves.not.toBeDefined();
        })
    })
    describe("Testa a função que faz alteração do status de um usuário no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar um erro caso não consiga recuperar os dados do banco", async () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValueOnce([usuario]);
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockRejectedValueOnce(new Error("Erro ao ler usuários do banco de dados"));
            
            expect(usuarioService.alterarStatusUsuario({email: "erik@email.com", status: true})).rejects.toThrow();
        })
        it("Deve alterar corretamente o status de um usuário do sistema", async () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            await usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockResolvedValue();
            
            expect(usuarioService.alterarStatusUsuario({email: "erik@email.com", status: false})).resolves.not.toBeDefined();
        })
        it("Deve retornar um erro caso não consiga salvar os dados no banco", async () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            await usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            jest.spyOn(JSONUsuariosRepository.prototype, "update").mockRejectedValue(new Error("Erro ao salvar no banco de dados"));
            
            expect(usuarioService.alterarStatusUsuario({email: "erik@email.com", status: false})).rejects.toThrow();
        })
        it("Deve retornar erro caso não consiga salvar as alterações no banco de dados", async () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);
            await usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            jest.spyOn(JSONUsuariosRepository.prototype, "save").mockRejectedValue(new Error("Erro ao salvar no banco de dados"));
            
            expect(usuarioService.alterarStatusUsuario({email: "erik@email.com", status: false})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso um usuário esteja tentado alterar o dado de outro", async () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuario2 = new Usuario("Patrick", "patrick@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario, usuario2]);
            await usuarioService.realizarLogin({email: "patrick@email.com", senha: "123456"});
            
            expect(usuarioService.alterarStatusUsuario({email: "erik@email.com", status: false})).rejects.toThrow(Error);
        })
        it("Deve retornar erro caso um usuário esteja tentando alterar um dado mas não esteja logado", async () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValue([usuario]);

            expect(usuarioService.alterarStatusUsuario({email: "erik@email.com", status: false})).rejects.toThrow(Error);
        })
    })
    describe("Testa a função que desloga usuários do sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve deslogar corretamente um usuário do sistema", async () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValueOnce([usuario]);
            await usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            usuarioService.deslogar();
            
            expect(usuarioService.getUsuarioLogado()).toBeFalsy();
        })
    })
    describe("Testa a função que retorna usuários do sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar um erro caso não consiga retornar usuários do banco de dados", async () => {
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockRejectedValueOnce(new Error("Erro ao ler usuários do banco de dados"));
            const usuarioService = new UsuarioService();

            expect(usuarioService.getUsuarios()).rejects.toThrow();
        })
        it("Deve retornar corretamente os usuários do sistema", async () => {
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValueOnce([usuario]);

            expect(usuarioService.getUsuarios()).resolves.toEqual([usuario]);
        })
    })
    describe("Testa a função que retorna o usuário logado no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar corretamente o usuário logado", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(UsuarioService.prototype, "realizarLogin").mockResolvedValue();
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            jest.spyOn(JSONUsuariosRepository.prototype, "findAll").mockResolvedValueOnce([usuario]);
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});

            expect(usuarioService.getUsuarioLogado()).toBe("erik@email.com");
        })
        it("Deve retornar '' caso não tenha usuário logado ", () => {
            const usuarioService = new UsuarioService();

            expect(usuarioService.getUsuarioLogado()).toBe("");
        })
    })
    describe("Testa a função que retorna se o email é único no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar erro caso o email já esteja no sistema", () => {
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();

            expect(usuarioService.isUnico("erik@email.com", [usuario])).toBeFalsy();
        })
        it("Deve aceitar a adição de usuários caso o banco de dados esteja vazio", () => {
            const usuarioService = new UsuarioService();

            expect(usuarioService.isUnico("erik@email.com", [])).toBeTruthy();
        })
        it("Deve aceitar a adição de usuários com o email único no sistema", () => {
            const usuarioService = new UsuarioService();
            const usuario = new Usuario("Patrick", "patrick@email.com", "123456");

            expect(usuarioService.isUnico("erik@email.com", [usuario])).toBeTruthy();
        })
    })
})
