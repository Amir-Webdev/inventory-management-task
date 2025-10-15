// pages/api/products/index.ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { Product, productSchema, productsSchema } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const jsonData = fs.readFileSync(filePath);
  let products: Product[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    // Validate outgoing response
    const parsed = productsSchema.safeParse(products);
    if (!parsed.success)
      return res.status(500).json({ message: "Invalid data" });
    res.status(200).json(parsed.data);
  } else if (req.method === "POST") {
    const inputParsed = productSchema.omit({ id: true }).safeParse(req.body);
    if (!inputParsed.success)
      return res.status(400).json({ message: "Invalid body" });
    const newProduct = {
      ...inputParsed.data,
      id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    };
    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    const outParsed = productSchema.safeParse(newProduct);
    if (!outParsed.success)
      return res.status(500).json({ message: "Invalid output" });
    res.status(201).json(outParsed.data);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
