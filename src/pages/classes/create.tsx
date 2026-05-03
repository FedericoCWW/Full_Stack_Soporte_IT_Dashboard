import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { useBack, type BaseRecord, type HttpError } from "@refinedev/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { classSchema } from "@/lib/schema";
import { mockTasks } from "@/providers/mockData";

const AREAS = [
  { id: 1, name: "Networking" },
  { id: 2, name: "Hardware" },
  { id: 3, name: "Software" },
] as const;
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type ClassFormValues = z.infer<typeof classSchema>;

const Create = () => {
  const back = useBack();

  const form = useForm<BaseRecord, HttpError, ClassFormValues>({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "create",
    },
    defaultValues: {
      status: "Activo",
    },
  });

  const { control } = form;

  const users = [
    { id: "1", name: "Juan Pérez" },
    { id: "2", name: "Ana García" },
  ];

  const onSubmit = (values: ClassFormValues) => {
    console.log(values);
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Crear Clase</h1>
      <div className="page-row">
        <p>Proveer la información necesaria para crear una nueva clase.</p>
        <Button onClick={back}>Ir atras</Button>
      </div>

      <Separator />

      <div className="my-4 flex justify-center">
        <Card className="w-full max-w-3xl gap-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-lg">
          <CardHeader className="rounded-none border-b bg-gray-100 px-6 py-6">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Información de la clase
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1 text-gray-700 font-medium">
                          Nombre de la clase
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nombre de la clase"
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                          />
                        </FormControl>
                        <FormDescription className="mt-1 text-xs text-gray-500">
                          El nombre de la clase es obligatorio.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1 text-gray-700 font-medium">
                          Descripción
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Descripción de la clase"
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                          />
                        </FormControl>
                        <FormDescription className="mt-1 text-xs text-gray-500">
                          Describe el contenido u objetivos de la clase.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={control}
                    name="areaId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1 text-gray-700 font-medium">
                          Área
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value != null
                              ? String(field.value)
                              : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md">
                              <SelectValue placeholder="Selecciona un área" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AREAS.map((area) => (
                              <SelectItem
                                key={area.id}
                                value={String(area.id)}
                              >
                                {area.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="mt-1 text-xs text-gray-500">
                          Área organizacional de la clase.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1 text-gray-700 font-medium">
                          Estado{" "}
                          <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md">
                              <SelectValue placeholder="Estado de la clase" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="mt-1 text-xs text-gray-500">
                          Activo o inactiva en el sistema.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={control}
                    name="taskId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1 text-gray-700 font-medium">
                          Tarea asociada
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value != null
                              ? String(field.value)
                              : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md">
                              <SelectValue placeholder="Selecciona una tarea" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockTasks.map((task) => (
                              <SelectItem
                                key={task.id}
                                value={String(task.id)}
                              >
                                {task.code} — {task.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="mt-1 text-xs text-gray-500">
                          Tarea de soporte vinculada a esta clase.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1 text-gray-700 font-medium">
                          Usuario asignado
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md">
                              <SelectValue placeholder="Selecciona un usuario" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id}
                                  className="hover:bg-indigo-50"
                                >
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="mt-1 text-xs text-gray-500">
                          Docente o responsable asignado.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Enviar</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default Create;
