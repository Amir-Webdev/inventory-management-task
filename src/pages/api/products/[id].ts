// pages/api/products/[id].ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { productSchema } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), "data", "products.json");
  const jsonData = fs.readFileSync(filePath);
  let products: any[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    const product = products.find((p) => p.id === parseInt(id as string));
    if (product) {
      const parsed = productSchema.safeParse(product);
      if (!parsed.success)
        return res.status(500).json({ message: "Invalid data" });
      res.status(200).json(parsed.data);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } else if (req.method === "PUT") {
    const index = products.findIndex((p) => p.id === parseInt(id as string));
    if (index !== -1) {
      const bodyParsed = productSchema
        .partial()
        .omit({ id: true })
        .safeParse(req.body);
      if (!bodyParsed.success)
        return res.status(400).json({ message: "Invalid body" });
      products[index] = {
        ...products[index],
        ...bodyParsed.data,
        id: parseInt(id as string),
      };
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      const outParsed = productSchema.safeParse(products[index]);
      if (!outParsed.success)
        return res.status(500).json({ message: "Invalid output" });
      res.status(200).json(outParsed.data);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } else if (req.method === "DELETE") {
    const index = products.findIndex((p) => p.id === parseInt(id as string));
    if (index !== -1) {
      products.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
