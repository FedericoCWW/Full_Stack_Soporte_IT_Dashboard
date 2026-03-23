import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select.tsx";
import React, { useMemo, useState } from "react";
import { LISTA_OPCIONES } from "../../const/const";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { Task } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const TaskList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectTask, setSelectTask] = useState("all");
  const TaskTable = useTable<Task>({
    columns: useMemo<ColumnDef<Task>[]>(() => [
      {
        id: 'code', 
        accessorKey: 'code',
        size:100,
        header: () => <p className="column-title ml-2">Peneee</p>,
        cell: ({getValue}) => <Badge>{getValue<string>()}</Badge>
      }
    ], []),
    refineCoreProps: {
      resource: "tasks",
      pagination: { pageSize: 10, mode: "server" },
      filters: {},
      sorters: {},
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <div className="intro-row">
        <p>Acceso rapido para las herramintas de tareas y manejos!</p>
        <div className="actions-row">
          <div className="search-task">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Buscar por nombre"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectTask} onValueChange={setSelectTask}>
              {/* Aca irian las tareas de las areas a mostrar */}
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tarea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las areas</SelectItem>
                {LISTA_OPCIONES.map((l) => (
                  <SelectItem value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton></CreateButton>
          </div>
        </div>
      </div>
      <DataTable table={TaskTable} />
    </ListView>
  );
};

export default TaskList;
