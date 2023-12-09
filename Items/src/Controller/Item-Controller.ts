import { NextFunction, Request, Response } from 'express';
import { Item } from '../Modal/Item';
import { CatchAsync } from '@codishrohan/common';
import { broker } from '../Utils';

export const registerItem = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.itemOwner = req.user?.id;
    const item = await Item.create(req.body);
    broker.PublishMessage({
      EXCHANGE_NAME: 'items',
      ROUTING_KEY: 'items',
      message: item,
    });
    res.status(201).json({
      message: 'Item registered successfully',
      item,
    });
  }
);

export const getSingleItem = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const item = await Item.findById(req.params.id);
    res.status(200).json(item);
  }
);
