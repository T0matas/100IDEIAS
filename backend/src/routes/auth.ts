import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import crypto from "crypto";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email e senha são obrigatórios." });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email já cadastrado." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email e senha são obrigatórios." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: "Credenciais inválidas." });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ error: "Credenciais inválidas." });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});


router.post("/forgot-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email é obrigatório." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Por segurança, não confirmamos se o email existe ou não
      res.json({ message: "Se o email existir, um link de recuperação foi enviado." });
      return;
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hora de validade

    // Guardar token na DB
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    const resetLink = `${FRONTEND_URL}/?reset-token=${token}`;

    // Enviar email
    await resend.emails.send({
      from: "100Ideias <onboarding@resend.dev>", // Usar o domínio padrão do Resend para testes
      to: email,
      subject: "Recuperação de Senha - 100Ideias",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Recuperação de Senha</h2>
          <p>Olá,</p>
          <p>Recebemos um pedido para recuperar a senha da sua conta no 100Ideias.</p>
          <p>Clique no botão abaixo para definir uma nova senha. Este link expira em 1 hora.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Recuperar Senha</a>
          </div>
          <p>Se não pediu esta recuperação, pode ignorar este email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Equipa 100Ideias</p>
        </div>
      `,
    });

    res.json({ message: "Se o email existir, um link de recuperação foi enviado." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Erro ao enviar email de recuperação." });
  }
});

router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ error: "Token e nova senha são obrigatórios." });
      return;
    }

    // Verificar se o token existe e é válido
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      res.status(400).json({ error: "Token inválido ou expirado." });
      return;
    }

    // Buscar o utilizador para comparar a senha
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      res.status(404).json({ error: "Utilizador não encontrado." });
      return;
    }

    // Verificar se a nova senha é igual à antiga
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      res.status(400).json({ error: "A nova senha não pode ser igual à senha atual." });
      return;
    }

    // Atualizar senha do utilizador
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Apagar o token usado
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Erro ao atualizar senha." });
  }
});

export default router;
