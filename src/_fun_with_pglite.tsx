import "./main.css";
import { createRoot } from "react-dom/client";

import { PGlite } from "@electric-sql/pglite";
import { useEffect } from "react";

const root = createRoot(document.getElementById("app")!);
root.render(<ReactRoot />);

async function makePg(data: {
  users: User[];
  companies: Company[];
  companySites: CompanySite[];
  reports: Report[];
}) {
  const db = new PGlite(); // in memory
  // const db = new PGlite('idb://my-pgdata') // persist

  // generate tables
  await db.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      address JSONB,
      language TEXT,
      role TEXT,
      avatar TEXT
    );
  `);

  await db.query(`
    CREATE TABLE companies (
      id SERIAL PRIMARY KEY,
      name TEXT,
      address JSONB,
      logo TEXT
    );
  `);

  await db.query(`
    CREATE TABLE company_sites (
      id SERIAL PRIMARY KEY,
      company_id INT,
      url TEXT,
      name TEXT,
      address JSONB,
      coordinates JSONB,
      contact JSONB
    );
  `);

  await db.query(`
    CREATE TABLE reports (
      site_id TEXT,
      generator_version TEXT,
      inputs JSONB,
      status TEXT,
      result JSONB,
      error JSONB
    );
  `);

  // insert data
  await db.query(
    `INSERT INTO users (id, name, email, address, language, role, avatar) VALUES ${data.users
      .map(
        (u) =>
          `(${u.id}, '${u.name}', '${u.email}', '${JSON.stringify(u.address)}', '${u.language}', '${u.role}', '${u.avatar}')`,
      )
      .join(", ")};`,
  );

  await db.query(
    `INSERT INTO companies (id, name, address, logo) VALUES ${data.companies
      .map(
        (c) =>
          `(${c.id}, '${c.name}', '${JSON.stringify(c.address)}', '${c.logo}')`,
      )
      .join(", ")};`,
  );

  await db.query(
    `INSERT INTO company_sites (id, company_id, url, name, address, coordinates, contact) VALUES ${data.companySites
      .map(
        (cs) =>
          `(${cs.id}, ${cs.company_id}, '${cs.url}', '${cs.name}', '${JSON.stringify(cs.address)}', '${JSON.stringify(cs.coordinates)}', '${JSON.stringify(cs.contact)}')`,
      )
      .join(", ")};`,
  );

  await db.query(
    `INSERT INTO reports (site_id, generator_version, inputs, status, result, error) VALUES ${data.reports
      .map(
        (r) =>
          `('${r.site_id}', '${r.generator_version}', '${JSON.stringify(r.inputs)}', '${r.status}', '${JSON.stringify(r.result)}', '${JSON.stringify(r.error)}')`,
      )
      .join(", ")};`,
  );

  return db;
}

function jsonToMbSize(data: any) {
  return new Blob([JSON.stringify(data)]).size / 1024 / 1024;
}

function ReactRoot() {
  let { users, companies, companySites, reports } = generateMockData({
    users_count: 100,
    company_count: 200,
    sites_per_company: 10, // up to
    reports_per_company: 100, // up to
  });

  let preStyle = {
    overflow: "auto",
    whiteSpace: "pre-wrap",
    height: "500px",
    background: "#fff",
    margin: "0 30px",
  };

  useEffect(() => {
    makePg({
      users,
      companies,
      companySites,
      reports,
    }).then(async (DB) => {
      console.log(DB);

      // DB.
    });
  }, []);

  return (
    <div
      style={{
        background: "#eee",
      }}
    >
      <h1>Data playground</h1>
      <p>
        size: {jsonToMbSize({ users, companies, companySites, reports })}
        {"Mb"}
      </p>
      <p>users cnt: {users.length}</p>
      <p>companies cnt: {companies.length}</p>
      <p>company sites cnt: {companySites.length}</p>
      <p>reports cnt: {reports.length}</p>

      <h2>Users</h2>
      <pre style={preStyle}>${JSON.stringify(users, null, 2)}</pre>

      <h2>Companies</h2>
      <pre style={preStyle}>${JSON.stringify(companies, null, 2)}</pre>

      <h2>Company sites</h2>
      <pre style={preStyle}>${JSON.stringify(companySites, null, 2)}</pre>

      <h2>Reports</h2>
      <pre style={preStyle}>${JSON.stringify(reports, null, 2)}</pre>
    </div>
  );
}

function generateMockData(params: {
  //
  users_count: number;
  company_count: number;
  sites_per_company: number;
  reports_per_company: number;
}): {
  users: User[];
  companies: Company[];
  companySites: CompanySite[];
  reports: Report[];
} {
  let { users_count, company_count, sites_per_company, reports_per_company } =
    params;

  let users: User[] = [];
  let companies: Company[] = [];
  let companySites: CompanySite[] = [];
  let reports: Report[] = [];

  for (let i = 0; i < users_count; i++) {
    users.push({
      id: i,
      name: returnRandomString(2),
      email: `${returnRandomString(1)}@${returnRandomString(1)}.com`,
      address: {
        street: returnRandomString(2),
        city: returnRandomString(1),
        zip: returnRandomString(1),
        country: returnRandomString(1),
      },
      language: returnRandomString(1),
      role: returnRandomString(1),
      avatar: returnRandomUrl(),
    });
  }

  for (let i = 0; i < company_count; i++) {
    companies.push({
      id: i,
      name: returnRandomString(2),
      address: {
        street: returnRandomString(2),
        city: returnRandomString(1),
        zip: returnRandomString(1),
        country: returnRandomString(1),
      },
      logo: returnRandomUrl(),
    });
  }

  for (let i = 0; i < company_count; i++) {
    for (let j = 0; j < getRandomInt(sites_per_company); j++) {
      companySites.push({
        id: i * sites_per_company + j,
        company_id: i,
        url: returnRandomUrl(),
        name: returnRandomString(2),
        address: {
          street: returnRandomString(2),
          city: returnRandomString(1),
          zip: returnRandomString(1),
          country: returnRandomString(1),
        },
        coordinates: {
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180,
        },
        contact: {
          name: returnRandomString(2),
          phone: returnRandomString(1),
          email: `${returnRandomString(1)}@${returnRandomString(1)}.com`,
        },
      });
    }
  }

  for (let i = 0; i < company_count; i++) {
    for (let j = 0; j < getRandomInt(reports_per_company); j++) {
      reports.push({
        site_id: `${i * sites_per_company + j}`,
        generator_version: returnRandomString(1),
        inputs: JSON.stringify(randomJson()) as any as JSON,
        status: (["in a queue", "processing", "success", "error"] as const)[
          Math.floor(Math.random() * 4)
        ],
        result: JSON.stringify({
          data1: randomJson(),
          data2: randomJson(),
          data3: randomJson(),
        }) as any as JSON,
        error: null,
      });
    }
  }

  return { users, companies, companySites, reports };
}

function randomJson() {
  return Object.fromEntries(
    Array.from({ length: Math.floor(Math.random() * 10) + 30 }, () => [
      (
        returnRandomString(1) +
        returnRandomString(1) +
        returnRandomString(1)
      ).replaceAll(" ", ""),
      Math.random() > 0.9
        ? returnRandomString(4)
        : +(Math.random() * 10000).toFixed(2),
    ]),
  );
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function returnRandomString(words_count: number) {
  let lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  let words = lorem.split(" ");

  let result = "";
  for (let i = 0; i < words_count; i++) {
    result += words[Math.floor(Math.random() * words.length)] + " ";
  }

  return result;
}

function returnRandomColor() {
  return (
    `#` +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

function returnRandomUrl() {
  return [
    `https://`,
    `${returnRandomString(1)}.${returnRandomString(1)}.${returnRandomString(1)}`,
    `/${returnRandomString(1)}`,
    `/${returnRandomString(1)}-${returnRandomString(1)}`,
    `/${returnRandomString(1)}`,
  ]
    .join("")
    .replaceAll(" ", "");
}

type User = {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  language: string;
  role: string;
  avatar: string;
};

type Company = {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  logo: string;
};

type CompanySite = {
  id: number;
  company_id: number;
  url: string;
  name: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
};

type JSON = Record<string, any>;

type Report = {
  //
  site_id: string;
  generator_version: string;
  inputs: JSON;
  status: "in a queue" | "processing" | "success" | "error";
  result: JSON | null;
  error: JSON | null;
};
