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
import { useMemo, useState } from "react";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { Area, Task } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const TaskList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectArea, setSelectArea] = useState("all");
  const SearchFilter = searchQuery ? [{field: 'search', operator: 'contains' as const, value: searchQuery}] : [];
  const AreaFilter = selectArea == 'all' ? [] : [
    {field: 'area', operator: 'eq' as const, value: selectArea}
  ];

  const { result: areasResult } = useList<Area>({ resource: "areas" });
  const areas = areasResult?.data ?? [];

  const taskTable = useTable<Task>({
    columns: useMemo<ColumnDef<Task>[]>(
      () => [
        {
          id: "code",
          accessorKey: "code",
          size: 100,
          header: () => <p className="column-title ml-2">Codigo</p>,
          cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
        },
        {
          id: "name",
          accessorKey: "name",
          size: 200,
          header: () => <p className="column-title ml-2">Nombre</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
          filterFn: "includesString",
        },
        {
          id: "area",
          accessorFn: (row) => row.area?.name ?? "",
          size: 150,
          header: () => <p className="column-title">Area</p>,
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          id: "description",
          accessorKey: "description",
          size: 300,
          header: () => <p className="column-title">Descripcion</p>,
          cell: ({ getValue }) => (
             <span className="truncate line-clamp-2">{getValue<string>()}</span>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "tasks",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [... AreaFilter, ...SearchFilter]
      },
      sorters: {
        initial: [
          {field: 'id', order: 'desc'}
        ]
      },
    },
  });

  const { tableQuery } = taskTable.refineCore;

  return (
    <ListView>
      <Breadcrumb />
      {tableQuery.isError ? (
        <p className="text-destructive text-sm mb-2" role="alert">
          No se pudieron cargar las tareas. Comprueba que el backend esté en ejecución
          y que la URL en{" "}
          <code className="rounded bg-muted px-1 py-0.5">VITE_BACKEND_BASE_URL</code>{" "}
          sea correcta.
        </p>
      ) : null}
      <div className="intro-row">
        <p>Acceso rapido para las herramintas de tareas y manejos!</p>
        <div className="actions-row">
          <div className="search-tasks">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Buscar por nombre"
              className="search-input pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectArea} onValueChange={setSelectArea}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las areas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={String(area.id)}>{area.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton></CreateButton>
          </div>
        </div>
      </div>
      <DataTable table={taskTable} />
    </ListView>
  );
};

export default TaskList;
