import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Transfer } from "../../../types";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filePath = path.join(process.cwd(), "data", "transfers.json");
  const jsonData = fs.readFileSync(filePath);
  let transfers: Transfer[] = JSON.parse(jsonData.toString());
  const { id } = req.query;

  if (req.method === "DELETE") {
    const index = transfers.findIndex((p) => p.id === parseInt(id as string));
    if (index !== -1) {
      fs.writeFileSync(filePath, JSON.stringify(transfers, null, 2));
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Transfer not found" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
