import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calculator,
  CheckCircle2,
  Factory,
  Hammer,
  Info,
  PackageCheck,
  Percent,
  Ruler,
  Truck,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  colorOptions,
  glassOptions,
  openingTypes,
  PRICING_ASSUMPTIONS,
  qualityLines,
  shippingZones,
  taxProfiles,
} from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculateQuote,
  currency,
  getQuoteSelections,
  percentage,
  type QuoteFormValues,
} from "@/lib/pricing";

const quoteSchema = z.object({
  openingTypeId: z.string().min(1, "Seleccioná una abertura"),
  qualityLineId: z.string().min(1, "Seleccioná una línea"),
  colorId: z.string().min(1, "Seleccioná un color"),
  glassId: z.string().min(1, "Seleccioná un vidrio"),
  widthCm: z.coerce.number().min(30, "Mínimo 30 cm").max(500, "Máximo 500 cm"),
  heightCm: z.coerce.number().min(30, "Mínimo 30 cm").max(350, "Máximo 350 cm"),
  quantity: z.coerce
    .number()
    .int("Debe ser un número entero")
    .min(1, "Mínimo 1 unidad")
    .max(50, "Máximo 50 unidades"),
  shippingZoneId: z.string().min(1, "Seleccioná una zona"),
  includeInstallation: z.boolean(),
  taxProfileId: z.string().min(1, "Seleccioná un perfil impositivo"),
  marginPercent: z.coerce.number().min(0, "Mínimo 0%").max(60, "Máximo 60%"),
});

type QuoteSchemaValues = z.infer<typeof quoteSchema>;

const defaultValues: QuoteSchemaValues = {
  openingTypeId: "ventana-corrediza",
  qualityLineId: "modena",
  colorId: "negro",
  glassId: "dvh",
  widthCm: 150,
  heightCm: 120,
  quantity: 2,
  shippingZoneId: "amba",
  includeInstallation: true,
  taxProfileId: "consumidor-final",
  marginPercent: PRICING_ASSUMPTIONS.defaultMarginRate * 100,
};

function toQuoteInput(values: QuoteSchemaValues): QuoteFormValues {
  return {
    ...values,
    marginRate: values.marginPercent / 100,
  };
}

function FieldShell({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-slate-950/20 p-4">
      <div className="mb-3 flex items-center gap-2 text-primary">{icon}</div>
      {children}
    </div>
  );
}

export function QuotePage() {
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const form = useForm<QuoteSchemaValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues,
    mode: "onChange",
  });
  const watchedValues = useWatch({ control: form.control });

  const liveQuote = useMemo(() => {
    const parsed = quoteSchema.safeParse(watchedValues);

    if (!parsed.success) {
      return null;
    }

    const input = toQuoteInput(parsed.data);

    return {
      input,
      result: calculateQuote(input),
      selections: getQuoteSelections(input),
    };
  }, [watchedValues]);

  const onSubmit = (values: QuoteSchemaValues) => {
    setSubmittedAt(new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date()));
    form.reset(values);
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass-panel overflow-hidden rounded-3xl p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="accent" className="w-fit">
              Demo MVP sin base de datos
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Cotizador profesional para aberturas de aluminio en Argentina
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                Calculá fabricación, materiales, color, vidrio, envío, colocación,
                margen e impuestos con datos hardcodeados listos para una demo comercial.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricPill icon={<Factory />} label="Costo hora" value={currency(PRICING_ASSUMPTIONS.manufacturingHourCost)} />
              <MetricPill icon={<PackageCheck />} label="Merma" value={percentage(PRICING_ASSUMPTIONS.wasteRate)} />
              <MetricPill icon={<Percent />} label="Margen base" value={percentage(PRICING_ASSUMPTIONS.defaultMarginRate)} />
            </div>
          </div>
          <Card className="border-cyan-400/20 bg-cyan-950/20">
            <CardHeader>
              <CardDescription>Resultado estimado</CardDescription>
              <CardTitle className="text-4xl text-white">
                {liveQuote ? currency(liveQuote.result.totals.total) : "Completá el formulario"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <SummaryStat
                  label="Costo directo"
                  value={liveQuote ? currency(liveQuote.result.totals.directCost) : "-"}
                />
                <SummaryStat
                  label="Impuestos"
                  value={liveQuote ? currency(liveQuote.result.totals.taxes) : "-"}
                />
                <SummaryStat
                  label="Horas taller"
                  value={liveQuote ? `${liveQuote.result.laborHours.toFixed(1)} h` : "-"}
                />
                <SummaryStat
                  label="Área cotizada"
                  value={liveQuote ? `${liveQuote.result.dimensions.quotedAreaM2.toFixed(2)} m2` : "-"}
                />
              </div>
              {submittedAt ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                  <CheckCircle2 className="size-4" />
                  Cotización generada el {submittedAt}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="size-5 text-primary" />
              Datos de la abertura
            </CardTitle>
            <CardDescription>
              Todos los parámetros se validan con zod y se recalculan en vivo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldShell icon={<Ruler className="size-5" />}>
                    <FormField
                      control={form.control}
                      name="openingTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de abertura</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {openingTypes.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Define perfiles, herrajes y horas base.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FieldShell>

                  <FieldShell icon={<PackageCheck className="size-5" />}>
                    <FormField
                      control={form.control}
                      name="qualityLineId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calidad / línea</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {qualityLines.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Ajusta aluminio, herrajes y mano de obra.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FieldShell>

                  <FormField
                    control={form.control}
                    name="widthCm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ancho (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" min={30} max={500} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heightCm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alto (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" min={30} max={350} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={50} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marginPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Margen comercial (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={60} step={0.5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorOptions.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="glassId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vidrio</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {glassOptions.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingZoneId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Envío</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shippingZones.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxProfileId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impuestos</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {taxProfiles.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeInstallation"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <div className="flex items-start gap-3 rounded-lg border border-border bg-slate-950/20 p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="flex items-center gap-2">
                              <Hammer className="size-4 text-primary" />
                              Incluir colocación
                            </FormLabel>
                            <FormDescription>
                              Suma costo base de visita y colocación por m2 cotizado.
                            </FormDescription>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
                  <Button type="submit" size="lg">
                    <Calculator />
                    Generar cotización
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setSubmittedAt(null);
                      form.reset(defaultValues);
                    }}
                  >
                    Restaurar demo
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Resumen comercial</CardTitle>
              <CardDescription>
                Precio orientativo para presentar al cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {liveQuote ? (
                <>
                  <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
                    <p className="text-sm font-medium opacity-80">Total final</p>
                    <p className="mt-1 text-4xl font-black tracking-tight">
                      {currency(liveQuote.result.totals.total)}
                    </p>
                    <p className="mt-2 text-sm opacity-80">
                      Incluye {liveQuote.selections.taxProfile.name.toLowerCase()}.
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <SummaryLine label="Subtotal" value={currency(liveQuote.result.totals.subtotal)} />
                    <SummaryLine label="Margen" value={currency(liveQuote.result.totals.margin)} />
                    <SummaryLine label="Impuestos" value={currency(liveQuote.result.totals.taxes)} />
                    <Separator />
                    <SummaryLine label="Abertura" value={liveQuote.selections.openingType.name} />
                    <SummaryLine label="Línea" value={liveQuote.selections.qualityLine.name} />
                    <SummaryLine label="Vidrio" value={liveQuote.selections.glass.name} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Corregí los campos marcados para ver el precio final.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-400/30 bg-amber-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-100">
                <Info className="size-5" />
                Supuestos de demo
              </CardTitle>
              <CardDescription className="text-amber-100/75">
                Valores hardcodeados para presentar el flujo completo sin backend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    Ver parámetros
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Parámetros base del MVP</DialogTitle>
                    <DialogDescription>
                      Estos valores están en código y se pueden reemplazar por una API o base de datos más adelante.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <SummaryStat label="Aluminio por kg" value={currency(PRICING_ASSUMPTIONS.aluminumKgCost)} />
                    <SummaryStat label="Hora fabricación" value={currency(PRICING_ASSUMPTIONS.manufacturingHourCost)} />
                    <SummaryStat label="Merma" value={percentage(PRICING_ASSUMPTIONS.wasteRate)} />
                    <SummaryStat label="Colocación base" value={currency(PRICING_ASSUMPTIONS.installationBaseCost)} />
                    <SummaryStat label="Colocación m2" value={currency(PRICING_ASSUMPTIONS.installationCostPerM2)} />
                    <SummaryStat label="Margen default" value={percentage(PRICING_ASSUMPTIONS.defaultMarginRate)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5 text-primary" />
            Desglose de costos
          </CardTitle>
          <CardDescription>
            Transparencia para revisar cómo se compone el precio antes de enviarlo al cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {liveQuote ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveQuote.result.breakdown.map((item) => (
                  <TableRow key={item.label}>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell className="text-muted-foreground">{item.detail}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {currency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-semibold">Costo directo</TableCell>
                  <TableCell className="text-muted-foreground">Materiales + fabricación + logística</TableCell>
                  <TableCell className="text-right font-bold">
                    {currency(liveQuote.result.totals.directCost)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              El desglose se muestra cuando el formulario tiene datos válidos.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function MetricPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <span className="flex size-10 items-center justify-center rounded-lg bg-cyan-400/15 text-primary [&_svg]:size-5">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-slate-950/25 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-44 text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
