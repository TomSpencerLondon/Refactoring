import fs from "fs";
import path from "path";
import readline from "readline";

export const readCustomersFromCsv = async (): Promise<Record<string, string | undefined>[]> => {
  const fileReader = fs.createReadStream(path.resolve(__dirname + "/customerData.csv"));
  const lineReader = readline.createInterface({
    input: fileReader,
    crlfDelay: Infinity,
  });
  let lineCounter = 0;
  const customerLines: string[] = [];
  const customerProperties = [];

  for await (const l of lineReader) {
    if (lineCounter === 0) {
      customerProperties.push(...l.split(","));
    }else {
      customerLines.push(l);
    }

    lineCounter++;
  }

  const customers = [];

  for (const line of customerLines) {
    const customer: { [index: string]: string | undefined } = {};
    const customerData = line.split(",");

    for (let i = 0; i < customerProperties.length; i++) {
      customer[customerProperties[i]] = Boolean(customerData[i]) ? customerData[i] : undefined;
    }

    customers.push(customer);
  }

  return customers;
};
