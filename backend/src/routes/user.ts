import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get user's liked and favorite ideas
router.get("/data", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const [likes, favorites] = await Promise.all([
      prisma.likedIdea.findMany({ where: { userId } }),
      prisma.favoriteIdea.findMany({ where: { userId } })
    ]);

    res.json({
      likedIdeas: likes.map(l => JSON.parse(l.ideaData)),
      favoriteIdeas: favorites.map(f => JSON.parse(f.ideaData))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar dados." });
  }
});

router.post("/sync", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { likedIdeas, favoriteIdeas } = req.body;
    
    // Simplest way: delete all and recreate
    await prisma.$transaction([
      prisma.likedIdea.deleteMany({ where: { userId } }),
      prisma.favoriteIdea.deleteMany({ where: { userId } }),
      
      ...likedIdeas.map((idea: any) => 
        prisma.likedIdea.create({ data: { userId, ideaId: idea.id.toString(), ideaData: JSON.stringify(idea) } })
      ),
      ...favoriteIdeas.map((idea: any) => 
        prisma.favoriteIdea.create({ data: { userId, ideaId: idea.id.toString(), ideaData: JSON.stringify(idea) } })
      )
    ]);
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao sincronizar." });
  }
});

// Like an idea
router.post("/likes", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { idea } = req.body;
    
    await prisma.likedIdea.create({
      data: {
        userId,
        ideaId: idea.id.toString(),
        ideaData: JSON.stringify(idea)
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: "Ideia já curtida." });
    console.error(error);
    res.status(500).json({ error: "Erro interno." });
  }
});

// Remove a liked idea
router.delete("/likes/:ideaId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { ideaId } = req.params;
    
    await prisma.likedIdea.deleteMany({
      where: { userId, ideaId: String(ideaId) }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno." });
  }
});

// Favorite an idea
router.post("/favorites", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { idea } = req.body;
    
    await prisma.favoriteIdea.create({
      data: {
        userId,
        ideaId: idea.id.toString(),
        ideaData: JSON.stringify(idea)
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: "Ideia já favoritada." });
    console.error(error);
    res.status(500).json({ error: "Erro interno." });
  }
});

// Remove a favorite idea
router.delete("/favorites/:ideaId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { ideaId } = req.params;
    
    await prisma.favoriteIdea.deleteMany({
      where: { userId, ideaId: String(ideaId) }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno." });
  }
});

export default router;
