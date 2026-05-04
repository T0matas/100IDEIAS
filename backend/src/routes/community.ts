import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get all shared ideas (public feed)
router.get("/", async (req: Request, res: Response) => {
  try {
    const ideas = await prisma.sharedIdea.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    res.json(ideas.map((idea: any) => ({
      id: idea.id,
      userId: idea.userId,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      tags: idea.tags ? JSON.parse(idea.tags) : [],
      likes: idea.likes,
      createdAt: idea.createdAt,
      authorName: idea.user.name || idea.user.email.split("@")[0]
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar ideias." });
  }
});

// Share an idea (requires auth)
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, description, category, tags } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: "Título e descrição são obrigatórios." });
      return;
    }

    const idea = await prisma.sharedIdea.create({
      data: {
        userId,
        title,
        description,
        category: category || null,
        tags: tags ? JSON.stringify(tags) : null,
      },
      include: { user: { select: { name: true, email: true } } }
    });

    res.status(201).json({
      id: idea.id,
      userId: idea.userId,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      tags: idea.tags ? JSON.parse(idea.tags) : [],
      likes: idea.likes,
      createdAt: idea.createdAt,
      authorName: idea.user.name || idea.user.email.split("@")[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao partilhar ideia." });
  }
});

// Like a shared idea (requires auth)
router.post("/:id/like", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const ideaId = String(id);

    const idea = await prisma.sharedIdea.update({
      where: { id: ideaId },
      data: { likes: { increment: 1 } }
    });

    res.json({ likes: idea.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao reagir à ideia." });
  }
});

// Edit a shared idea (owner only)
router.patch("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const ideaId = String(id);
    const { title, description } = req.body;

    const idea = await prisma.sharedIdea.findUnique({ where: { id: ideaId } });
    if (!idea || idea.userId !== userId) {
      res.status(403).json({ error: "Sem permissão para editar esta ideia." });
      return;
    }

    const updated = await prisma.sharedIdea.update({
      where: { id: ideaId },
      data: { title: title || idea.title, description: description || idea.description }
    });

    res.json({ id: updated.id, title: updated.title, description: updated.description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao editar ideia." });
  }
});

// Delete a shared idea (owner only)
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const ideaId = String(id);

    const idea = await prisma.sharedIdea.findUnique({ where: { id: ideaId } });
    if (!idea || idea.userId !== userId) {
      res.status(403).json({ error: "Sem permissão para eliminar esta ideia." });
      return;
    }

    await prisma.sharedIdea.delete({ where: { id: ideaId } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao eliminar ideia." });
  }
});

export default router;
