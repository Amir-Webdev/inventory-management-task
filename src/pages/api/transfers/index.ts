import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { Transfer, transferSchema } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filePath = path.join(process.cwd(), "data", "transfers.json");
  const jsonData = fs.readFileSync(filePath);
  let transfers: Transfer[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    const parsed = transferSchema.safeParse(transfers);

    if (!parsed.success)
      return res.status(500).json({ message: "Invalid data" });

    res.status(200).json(parsed.data);
  } else if (req.method === "POST") {
    const inputParsed = transferSchema.omit({ id: true }).safeParse(req.body);

    if (!inputParsed.success)
      return res.status(400).json({ message: "Invalid body" });

    const newTransfer = {
      ...inputParsed.data,
      id: transfers.length ? Math.max(...transfers.map((p) => p.id)) + 1 : 1,
    };

    transfers.push(newTransfer);

    fs.writeFileSync(filePath, JSON.stringify(transfers, null, 2));

    const outParsed = transferSchema.safeParse(newTransfer);

    if (!outParsed.success)
      return res.status(500).json({ message: "Invalid output" });

    res.status(201).json(outParsed.data);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
