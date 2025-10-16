import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import {
  Stock,
  Transfer,
  transferSchema,
  transfersSchema,
} from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transfersFilePath = path.join(process.cwd(), "data", "transfers.json");
  const transfersJsonData = fs.readFileSync(transfersFilePath);
  let transfers: Transfer[] = JSON.parse(transfersJsonData.toString());

  const stockssFilePath = path.join(process.cwd(), "data", "stock.json");
  const stocksJsonData = fs.readFileSync(stockssFilePath);
  let stocks: Stock[] = JSON.parse(stocksJsonData.toString());

  if (req.method === "GET") {
    const parsed = transfersSchema.safeParse(transfers);

    if (!parsed.success)
      return res.status(500).json({ message: "Invalid data" });

    res.status(200).json(parsed.data);
  } else if (req.method === "POST") {
    const inputParsed = transferSchema.omit({ id: true }).safeParse(req.body);

    if (!inputParsed.success)
      return res.status(400).json({ message: "Invalid body" });

    const sendingWarehouseStock = stocks.find(
      (stock) =>
        stock.productId === inputParsed.data.productId &&
        stock.warehouseId === inputParsed.data.sendingWarehouseId
    );

    if (!sendingWarehouseStock)
      return res
        .status(404)
        .json({
          message:
            "Could not found a warehouse with the specified product in it",
        });

    if (inputParsed.data.quantity > sendingWarehouseStock.quantity)
      return res
        .status(400)
        .json({
          message:
            "Required Transfer Quantity is more than what the sending warehouse holds",
        });

    const newTransfer = {
      ...inputParsed.data,
      id: transfers.length ? Math.max(...transfers.map((p) => p.id)) + 1 : 1,
    };

    transfers.push(newTransfer);

    fs.writeFileSync(transfersFilePath, JSON.stringify(transfers, null, 2));

    const outParsed = transferSchema.safeParse(newTransfer);

    if (!outParsed.success)
      return res.status(500).json({ message: "Invalid output" });

    res.status(201).json(outParsed.data);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
