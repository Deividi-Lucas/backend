import { EmpresaController } from "./empresa.controller";
import { EmpresaService } from "./empresa.service";

describe("EmpresaController", () => {
  let empresaController: EmpresaController;
  let empresaService: EmpresaService;

  beforeEach(() => {
    empresaService = new EmpresaService();
    empresaController = new EmpresaController(empresaService);
  });

    describe("getAll", () => {
    it("should return an array of empresas", async () => {
      const result = [{ id: 1, name: "Empresa 1" }, { id: 2, name: "Empresa 2" }];
      jest.spyOn(empresaService, "findAll").mockResolvedValue(result);

      expect(await empresaController.findAll()).toBe(result);
     });
    });
  });
