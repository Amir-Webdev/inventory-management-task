// pages/api/stock/index.ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { Stock, stockSchema, stocksSchema } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "data", "stock.json");
  const jsonData = fs.readFileSync(filePath);
  let stock: Stock[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    const parsed = stocksSchema.safeParse(stock);
    if (!parsed.success)
      return res.status(500).json({ message: "Invalid data" });
    res.status(200).json(parsed.data);
  } else if (req.method === "POST") {
    const bodyParsed = stockSchema.omit({ id: true }).safeParse(req.body);
    if (!bodyParsed.success)
      return res.status(400).json({ message: "Invalid body" });
    const newStock = {
      ...bodyParsed.data,
      id: stock.length ? Math.max(...stock.map((s) => s.id)) + 1 : 1,
    };
    stock.push(newStock);
    fs.writeFileSync(filePath, JSON.stringify(stock, null, 2));
    const outParsed = stockSchema.safeParse(newStock);
    if (!outParsed.success)
      return res.status(500).json({ message: "Invalid output" });
    res.status(201).json(outParsed.data);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
