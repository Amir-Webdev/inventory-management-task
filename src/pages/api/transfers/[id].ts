import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Stock, Transfer } from "../../../types";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const filePath = path.join(process.cwd(), "data", "transfers.json");
  const jsonData = fs.readFileSync(filePath);
  let transfers: Transfer[] = JSON.parse(jsonData.toString());

  const stocksFilePath = path.join(process.cwd(), "data", "stock.json");
  const stocksJsonData = fs.readFileSync(stocksFilePath);
  let stocks: Stock[] = JSON.parse(stocksJsonData.toString());

  if (req.method === "DELETE") {
    const transferIndex = transfers.findIndex(
      (p) => p.id === parseInt(id as string)
    );

    if (transferIndex === -1) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    // Remove transfer and extract details
    const { productId, sendingWarehouseId, receivingWarehouseId, quantity } =
      transfers.splice(transferIndex, 1)[0];

    // 1. Subtract from receiving warehouse (reverse the transfer)
    const receivingWarehouseStock = stocks.find(
      (stock) =>
        stock.productId === productId &&
        stock.warehouseId === receivingWarehouseId
    );

    if (!receivingWarehouseStock)
      return res.status(404).json({
        message: "Could not find receiving warehouse stock to reverse transfer",
      });

    const receivingIndex = stocks.findIndex(
      (s) => s.id === receivingWarehouseStock.id
    );
    stocks[receivingIndex] = {
      ...stocks[receivingIndex],
      quantity: stocks[receivingIndex].quantity - quantity,
    };

    // Remove if now zero
    if (stocks[receivingIndex].quantity <= 0) {
      stocks.splice(receivingIndex, 1);
    }

    // 2. Add back to sending warehouse
    let sendingWarehouseStock = stocks.find(
      (stock) =>
        stock.productId === productId &&
        stock.warehouseId === sendingWarehouseId
    );

    if (!sendingWarehouseStock) {
      const newStock: Stock = {
        productId,
        quantity,
        warehouseId: sendingWarehouseId,
        id: stocks.length ? Math.max(...stocks.map((s) => s.id)) + 1 : 1,
      };
      stocks.push(newStock);
    } else {
      const sendIndex = stocks.findIndex(
        (s) => s.id === sendingWarehouseStock.id
      );
      stocks[sendIndex] = {
        ...stocks[sendIndex],
        quantity: stocks[sendIndex].quantity + quantity,
      };
    }
    fs.writeFileSync(stocksFilePath, JSON.stringify(stocks, null, 2));
    fs.writeFileSync(filePath, JSON.stringify(transfers, null, 2));

    return res.status(204).end();
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
