"use client";

import { SWRConfig } from "swr";

import Playground from "./playground";

export default function Home() {
  return (
    <main className="flex flex-col items-center py-8 w-1/2 m-auto">
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <Playground />
      </SWRConfig>
    </main>
  );
}
