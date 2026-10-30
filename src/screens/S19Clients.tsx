import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S19Clients: React.FC = () => {
  const { go, clients, setSelectedClientId } = useDemo();
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenLayout
      hasNav={true}
      headerChildren={
        <div className="flex items-center justify-between w-full">
          <span className="text-[26px] font-extrabold tracking-tight text-[var(--ink)]">
            Clients
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => go("20")}
          >
            Add
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Search Input */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-4 pointer-events-none text-[var(--muted)]">
            <Icon name="search" size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full h-[48px] pl-11 pr-4 rounded-[14px] text-[15px] outline-none"
            style={{
              backgroundColor: "var(--field)",
              color: "var(--ink)",
              border: "none",
            }}
          />
        </div>

        {/* Client List */}
        <div className="flex flex-col gap-2">
          {filteredClients.map((client) => {
            const initials = client.name
              .split(" ")
              .map((n) => n[0])
              .join("");

            return (
              <div
                key={client.id}
                onClick={() => {
                  setSelectedClientId(client.id);
                  go("21");
                }}
                className="h-[72px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0"
                    style={{
                      backgroundColor: "var(--accent-tint)",
                      color: "var(--accent)",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-semibold text-[var(--ink)] leading-snug truncate">
                      {client.name}
                    </span>
                    <span className="text-[13px] font-normal text-[var(--muted)] leading-tight mt-0.5 truncate">
                      {client.code}
                    </span>
                    <span className="text-[12px] font-normal text-[var(--placeholder)] leading-tight mt-0.5 truncate">
                      {client.city}
                    </span>
                  </div>
                </div>

                <Icon name="chevron-right" size={18} color="var(--muted)" />
              </div>
            );
          })}

          {filteredClients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-2 select-none">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                style={{ backgroundColor: "var(--accent-tint)" }}
              >
                <Icon name="user" size={22} color="var(--accent)" />
              </div>
              <span className="text-[15px] font-bold text-[var(--ink)]">No clients yet</span>
              <p className="text-[13px] text-[var(--muted)] max-w-[240px]">
                Create your first client record to assign incoming cargo
              </p>
              <Button variant="primary" size="sm" onClick={() => go("20")} className="mt-2">
                Add client
              </Button>
            </div>
          )}
        </div>
      </div>
    </ScreenLayout>
  );
};
