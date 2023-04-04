type CsvObject = {
  headers: string;
  lines: string[];
};

const convertRecordsToCsvObject = (records: Record<string, string | undefined>[]): CsvObject => ({
    headers: Object.keys(records[0] || {}).join(",").slice(0, -1),
    lines: records.map(record => Object.values(record).join(",").slice(0, -1))
});

console.log(
  convertRecordsToCsvObject([
    {
      name: "John",
      dateOfBirth: "1990-01-01",
      email: "john@example.com",
    },
    {
      name: "Jane",
      dateOfBirth: "1992-01-01",
      email: "jane@example.com",
    },
  ])
);

console.log(convertRecordsToCsvObject([]))

export {};
