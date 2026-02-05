// controllers/room.controller.ts
import { Request, Response } from "express";
import Room from "../models/room.model";

export const createRoom = async (req: Request, res: Response) => {
  const room = await Room.create({
    userId: req.user!.id,
    type: req.body.type,
  });
  res.status(201).json(room);
};

export const getRooms = async (req: Request, res: Response) => {
  const rooms = await Room.find({ userId: req.user!.id })
    .sort({ updatedAt: -1 });
  res.json(rooms);
};

export const updateRoom = async (req: Request, res: Response) => {
  const room = await Room.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    {
      title: req.body.title,
      content: req.body.content,
    },
    { new: true }
  );
  res.json(room);
};
