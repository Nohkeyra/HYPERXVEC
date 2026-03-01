import { ModuleStrategy } from "./types";
import { VectorizeModule } from "./VectorizeModule";
import { LetteringModule } from "./LetteringModule";
import { AnalyzerModule } from "./AnalyzerModule";
import { LogoModule } from "./LogoModule";

const modules: Record<string, ModuleStrategy> = {
  [VectorizeModule.id]: VectorizeModule,
  [LetteringModule.id]: LetteringModule,
  [AnalyzerModule.id]: AnalyzerModule,
  [LogoModule.id]: LogoModule,
};

export const getModule = (id: string): ModuleStrategy => {
  return modules[id] || VectorizeModule; // Default to Vectorize
};
