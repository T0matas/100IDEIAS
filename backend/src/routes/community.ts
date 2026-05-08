import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Get all shared ideas (public feed)
router.get("/", async (req: Request, res: Response) => {
  try {
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = payload.userId;
      } catch (e) {
        // Token inválido, continua como guest
      }
    }

    const ideas = await prisma.sharedIdea.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { name: true, email: true } },
        ideaLikes: true,
        comments: {
          include: { 
            user: { select: { name: true, email: true } },
            commentLikes: true
          },
          orderBy: { createdAt: "asc" }
        }
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
      isLiked: userId ? idea.ideaLikes.some((il: any) => il.userId === userId) : false,
      comments: idea.comments.length,
      commentList: idea.comments.map((c: any) => ({
        id: c.id,
        text: c.content,
        likes: c.likes || 0,
        isLiked: userId ? c.commentLikes.some((cl: any) => cl.userId === userId) : false,
        userName: c.user.name || c.user.email.split("@")[0],
        userInitials: (c.user.name || c.user.email).substring(0, 2).toUpperCase(),
        userId: c.userId,
        createdAt: c.createdAt
      })),
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
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
      comments: 0,
      commentList: [],
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
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
    const userId = req.userId!;

    const existingLike = await prisma.ideaLike.findUnique({
      where: { userId_ideaId: { userId, ideaId } }
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.ideaLike.delete({ where: { id: existingLike.id } }),
        prisma.sharedIdea.update({ where: { id: ideaId }, data: { likes: { decrement: 1 } } })
      ]);
      const updated = await prisma.sharedIdea.findUnique({ where: { id: ideaId } });
      return res.json({ likes: updated?.likes || 0, isLiked: false });
    } else {
      await prisma.$transaction([
        prisma.ideaLike.create({ data: { userId, ideaId } }),
        prisma.sharedIdea.update({ where: { id: ideaId }, data: { likes: { increment: 1 } } })
      ]);
      const updated = await prisma.sharedIdea.findUnique({ where: { id: ideaId } });
      return res.json({ likes: updated?.likes || 0, isLiked: true });
    }
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

    res.json({ 
      id: updated.id, 
      title: updated.title, 
      description: updated.description,
      updatedAt: updated.updatedAt 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao editar ideia." });
  }
});

// Add a comment to a shared idea (requires auth)
router.post("/:id/comment", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: "Conteúdo do comentário é obrigatório." });
      return;
    }

    const comment: any = await prisma.comment.create({
      data: {
        content,
        userId,
        ideaId: String(id),
      },
      include: { user: { select: { name: true, email: true } } }
    });

    res.status(201).json({
      id: comment.id,
      text: comment.content,
      likes: 0,
      userName: comment.user.name || comment.user.email.split("@")[0],
      userInitials: (comment.user.name || comment.user.email).substring(0, 2).toUpperCase(),
      userId: comment.userId,
      createdAt: comment.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar comentário." });
  }
});

// Like a comment (requires auth)
router.post("/comment/:id/like", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const commentId = String(id);
    const userId = req.userId!;

    const existingLike = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } }
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.commentLike.delete({ where: { id: existingLike.id } }),
        prisma.comment.update({ where: { id: commentId }, data: { likes: { decrement: 1 } } })
      ]);
      return res.json({ likes: (await prisma.comment.findUnique({ where: { id: commentId } }))?.likes || 0, isLiked: false });
    } else {
      await prisma.$transaction([
        prisma.commentLike.create({ data: { userId, commentId } }),
        prisma.comment.update({ where: { id: commentId }, data: { likes: { increment: 1 } } })
      ]);
      return res.json({ likes: (await prisma.comment.findUnique({ where: { id: commentId } }))?.likes || 0, isLiked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao curtir comentário." });
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

// Edit a comment (owner only)
router.patch("/comment/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.findUnique({ where: { id: String(id) } });
    if (!comment || comment.userId !== userId) {
      res.status(403).json({ error: "Sem permissão para editar este comentário." });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id: String(id) },
      data: { content }
    });

    res.json({ id: updated.id, text: updated.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao editar comentário." });
  }
});

// Delete a comment (owner only or post owner)
router.delete("/comment/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({ 
      where: { id: String(id) },
      include: { idea: true }
    });

    if (!comment) {
      res.status(404).json({ error: "Comentário não encontrado." });
      return;
    }

    // Permit delete only if user is comment author
    if (comment.userId !== userId) {
      res.status(403).json({ error: "Sem permissão para eliminar este comentário." });
      return;
    }

    await prisma.comment.delete({ where: { id: String(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao eliminar comentário." });
  }
});

// Get user profile and their ideas
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    
    // Check for current user if logged in to mark likes
    let currentUserId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        currentUserId = payload.userId;
      } catch (e) {}
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sharedIdeas: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            ideaLikes: true,
            comments: { select: { id: true } }
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    res.json({
      id: user.id,
      name: user.name || user.email.split("@")[0],
      initials: (user.name || user.email).substring(0, 2).toUpperCase(),
      ideas: user.sharedIdeas.map((idea: any) => ({
        id: idea.id,
        userId: idea.userId,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        tags: idea.tags ? JSON.parse(idea.tags) : [],
        likes: idea.likes,
        isLiked: currentUserId ? idea.ideaLikes.some((il: any) => il.userId === currentUserId) : false,
        comments: idea.comments.length,
        createdAt: idea.createdAt,
        authorName: user.name || user.email.split("@")[0]
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar perfil." });
  }
});

export default router;
