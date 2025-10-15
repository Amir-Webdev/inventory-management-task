// pages/api/stock/[id].ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { stockSchema } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), "data", "stock.json");
  const jsonData = fs.readFileSync(filePath);
  let stock: any[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    const stockItem = stock.find((s) => s.id === parseInt(id as string));
    if (stockItem) {
      const parsed = stockSchema.safeParse(stockItem);
      if (!parsed.success)
        return res.status(500).json({ message: "Invalid data" });
      res.status(200).json(parsed.data);
    } else {
      res.status(404).json({ message: "Stock item not found" });
    }
  } else if (req.method === "PUT") {
    const index = stock.findIndex((s) => s.id === parseInt(id as string));
    if (index !== -1) {
      const bodyParsed = stockSchema
        .partial()
        .omit({ id: true })
        .safeParse(req.body);
      if (!bodyParsed.success)
        return res.status(400).json({ message: "Invalid body" });
      stock[index] = {
        ...stock[index],
        ...bodyParsed.data,
        id: parseInt(id as string),
      };
      fs.writeFileSync(filePath, JSON.stringify(stock, null, 2));
      const outParsed = stockSchema.safeParse(stock[index]);
      if (!outParsed.success)
        return res.status(500).json({ message: "Invalid output" });
      res.status(200).json(outParsed.data);
    } else {
      res.status(404).json({ message: "Stock item not found" });
    }
  } else if (req.method === "DELETE") {
    const index = stock.findIndex((s) => s.id === parseInt(id as string));
    if (index !== -1) {
      stock.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(stock, null, 2));
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Stock item not found" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
