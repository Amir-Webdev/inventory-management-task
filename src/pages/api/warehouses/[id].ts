// pages/api/warehouses/[id].ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { warehouseSchema } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), "data", "warehouses.json");
  const jsonData = fs.readFileSync(filePath);
  let warehouses: any[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    const warehouse = warehouses.find((w) => w.id === parseInt(id as string));
    if (warehouse) {
      const parsed = warehouseSchema.safeParse(warehouse);
      if (!parsed.success)
        return res.status(500).json({ message: "Invalid data" });
      res.status(200).json(parsed.data);
    } else {
      res.status(404).json({ message: "Warehouse not found" });
    }
  } else if (req.method === "PUT") {
    const index = warehouses.findIndex((w) => w.id === parseInt(id as string));
    if (index !== -1) {
      const bodyParsed = warehouseSchema
        .partial()
        .omit({ id: true })
        .safeParse(req.body);
      if (!bodyParsed.success)
        return res.status(400).json({ message: "Invalid body" });
      warehouses[index] = {
        ...warehouses[index],
        ...bodyParsed.data,
        id: parseInt(id as string),
      };
      fs.writeFileSync(filePath, JSON.stringify(warehouses, null, 2));
      const outParsed = warehouseSchema.safeParse(warehouses[index]);
      if (!outParsed.success)
        return res.status(500).json({ message: "Invalid output" });
      res.status(200).json(outParsed.data);
    } else {
      res.status(404).json({ message: "Warehouse not found" });
    }
  } else if (req.method === "DELETE") {
    const index = warehouses.findIndex((w) => w.id === parseInt(id as string));
    if (index !== -1) {
      warehouses.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(warehouses, null, 2));
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Warehouse not found" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
