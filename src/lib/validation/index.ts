import * as z from "zod";

// ============================================================
// USUÁRIO
// ============================================================
export const ValidacaoCadastro = z.object({
  nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  nomeDeUsuario: z.string().min(2, { message: "O nome de usuário deve ter pelo menos 2 caracteres." }),
  email: z.string().email(),
  senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
});

export const ValidacaoLogin = z.object({
  email: z.string().email(),
  senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
});

export const ValidacaoPerfil = z.object({
  arquivo: z.custom<File[]>(),
  nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  nomeDeUsuario: z.string().min(2, { message: "O nome de usuário deve ter pelo menos 2 caracteres." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POSTAGEM
// ============================================================
export const ValidacaoPostagem = z.object({
  legenda: z.string().min(5, { message: "Mínimo de 5 caracteres." }).max(2200, { message: "Máximo de 2.200 caracteres" }),
  arquivo: z.custom<File[]>(),
  localizacao: z.string().min(1, { message: "Este campo é obrigatório." }).max(1000, { message: "Máximo de 1000 caracteres." }),
  tags: z.string(),
});
