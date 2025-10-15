// pages/api/warehouses/index.ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { warehouseSchema, warehousesSchema } from "../../../types";
import { z } from "zod";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "data", "warehouses.json");
  const jsonData = fs.readFileSync(filePath);
  let warehouses: any[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    const parsed = warehousesSchema.safeParse(warehouses);
    if (!parsed.success)
      return res.status(500).json({ message: "Invalid data" });
    res.status(200).json(parsed.data);
  } else if (req.method === "POST") {
    const bodyParsed = warehouseSchema.omit({ id: true }).safeParse(req.body);
    if (!bodyParsed.success)
      return res.status(400).json({ message: "Invalid body" });
    type WarehouseInput = Omit<z.infer<typeof warehouseSchema>, "id"> & {
      id?: number;
    };
    const newWarehouse = bodyParsed.data as WarehouseInput;
    newWarehouse.id = warehouses.length
      ? Math.max(...warehouses.map((w) => w.id)) + 1
      : 1;
    warehouses.push(newWarehouse);
    fs.writeFileSync(filePath, JSON.stringify(warehouses, null, 2));
    const outParsed = warehouseSchema.safeParse(newWarehouse);
    if (!outParsed.success)
      return res.status(500).json({ message: "Invalid output" });
    res.status(201).json(outParsed.data);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
