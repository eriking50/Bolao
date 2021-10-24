import Usuario from "../src/models/Usuario";
import UsuarioService from "../src/services/UsuarioService";
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
        it("Deve retornar erro caso não seja possível criar o usuário", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuario2 = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            const wrapper = () => {
                usuarioService.adcionarUsuario(usuario2);
            }

            expect(wrapper).toThrow(Error);
        })
        it("Deve criar um usuário no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);

            expect(usuarioService.getUsuarios().length).toBeGreaterThan(0);
        })
    })
    describe("Testa a função que faz login no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar erro caso não seja possível fazer o login", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            const wrapper = () => {
                usuarioService.realizarLogin({email: "joao@email.com", senha: "321"});
                jest.spyOn(HashHelper, "hash").mockReturnValueOnce("outro_hash");
            }
            
            expect(wrapper).toThrow(Error);
        })
        it("Deve logar corretamente no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            
            expect(usuarioService.getUsuarioLogado()).toBe("erik@email.com");
        })
    })
    describe("Testa a função que faz alteração dos dados do usuario no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar erro caso o usuário não esteja logado", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            const wrapper = () => {
                usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"});
            }
            
            expect(wrapper).toThrow(Error);
        })
        it("Deve retornar erro caso um usuário esteja tentado alterar o dado de outro", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuario2 = new Usuario("Patrick", "patrick@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            usuarioService.adcionarUsuario(usuario2);
            usuarioService.realizarLogin({email: "patrick@email.com", senha: "123456"});
            const wrapper = () => {
                usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"});
            }
            
            expect(wrapper).toThrow(Error);
        })
        it("Deve retornar erro caso o usuário não esteja com status ativo", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            usuario.setStatus(false);
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            const wrapper = () => {
                usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"});
            }
            
            expect(wrapper).toThrow(Error);
        })
        it("Deve retornar erro caso o usuário não esteja logado", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            const wrapper = () => {
                usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp"});
            }
            
            expect(wrapper).toThrow(Error);
        })
        it("Deve retornar erro caso o usuário não tenha mandados dados além do email", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            const wrapper = () => {
                usuarioService.alterarCadastro({email: "erik@email.com"});
            }
            
            expect(wrapper).toThrow(Error);
        })
        it("Deve alterar o cadastro corretamente no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("outro_hash");
            usuarioService.alterarCadastro({email: "erik@email.com", nome: "Bergkamp", senha: "998877"});

            expect(usuarioService.getUsuarios()[0].getNome()).toBe("Bergkamp");
            expect(usuarioService.getUsuarios()[0].getSenha()).toBe("outro_hash");
        })
    })
    describe("Testa a função que faz alteração do status de um usuário no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve alterar corretamente o status de um usuário do sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            usuarioService.alterarStatusUsuario({email: "erik@email.com", status: false});
            
            expect(usuarioService.getUsuarios()[0].getStatus()).toBe(false);
        })
        it("Deve retornar erro caso um usuário esteja tentado alterar o dado de outro", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuario2 = new Usuario("Patrick", "patrick@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            usuarioService.adcionarUsuario(usuario2);
            usuarioService.realizarLogin({email: "patrick@email.com", senha: "123456"});
            const wrapper = () => {
                usuarioService.alterarStatusUsuario({email: "erik@email.com", status: false});
            }
            
            expect(wrapper).toThrow(Error);
        })
        it("Deve retornar erro caso um usuário esteja tentando alterar um dado mas não esteja logado", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValue("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            const wrapper = () => {
                usuarioService.alterarStatusUsuario({email: "erik@email.com", status: false});
            }
            
            expect(wrapper).toThrow(Error);
        })
    })
    describe("Testa a função que desloga usuários do sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve deslogar corretamente um usuário do sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});
            usuarioService.deslogar();
            
            expect(usuarioService.getUsuarioLogado()).toBeFalsy();
        })
    })
    describe("Testa a função que retorna usuários do sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar corretamente os usuários do sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);

            expect(usuarioService.getUsuarios()).toEqual([usuario]);
        })
    })
    describe("Testa a função que retorna o usuário logado no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar corretamente o usuário logado", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            usuarioService.realizarLogin({email: "erik@email.com", senha: "123456"});

            expect(usuarioService.getUsuarioLogado()).toBe("erik@email.com");
        })
        it("Deve retornar '' caso não tenha usuário logado ", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);

            expect(usuarioService.getUsuarioLogado()).toBe("");
        })
    })
    describe("Testa a função que retorna se o email é único no sistema", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })
        it("Deve retornar erro caso o email já esteja no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);
            const wrapper = () => {
                usuarioService.isUnico("erik@email.com");
            }

            expect(wrapper).toThrow();
        })
        it("Deve retornar erro caso o email já esteja no sistema", () => {
            jest.spyOn(HashHelper, "hash").mockReturnValueOnce("algum_hash");
            jest.spyOn(EmailHelper, "validarEmail").mockReturnValue(true);
            const usuario = new Usuario("Erik", "erik@email.com", "123456");
            const usuarioService = new UsuarioService();
            usuarioService.adcionarUsuario(usuario);

            expect(usuarioService.isUnico("erik@trabalho.com")).toBe(true);
        })
    })
})