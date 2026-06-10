import { Palette, PackageCheck, Ruler, ShieldCheck, Truck } from "lucide-react";

import {
  colorOptions,
  glassOptions,
  openingTypes,
  qualityLines,
  shippingZones,
  taxProfiles,
} from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, percentage } from "@/lib/pricing";

export function CatalogPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass-panel rounded-3xl p-6 md:p-10">
        <Badge variant="secondary" className="w-fit">
          Datos hardcodeados
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
          Catálogos y supuestos de cálculo
        </h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
          Estas tablas representan el set mínimo de datos para una demo MVP:
          aberturas, líneas, colores, vidrios, envíos e impuestos.
        </p>
      </section>

      <CatalogSection
        icon={<Ruler />}
        title="Variedades de aberturas"
        description="Cada tipo define consumo de perfil, herrajes y horas de fabricación."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Kg/m2</TableHead>
              <TableHead className="text-right">Herrajes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openingTypes.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.description}</TableCell>
                <TableCell className="text-right">{item.profileKgPerM2.toFixed(1)}</TableCell>
                <TableCell className="text-right">{currency(item.hardwareBase)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CatalogSection>

      <CatalogSection
        icon={<PackageCheck />}
        title="Calidades / líneas"
        description="Multiplicadores que simulan Herrero, Módena, A30 New y alta prestación."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {qualityLines.map((item) => (
            <Card key={item.id} className="bg-slate-950/30">
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <CatalogMetric label="Perfil" value={`x${item.profileMultiplier.toFixed(2)}`} />
                <CatalogMetric label="Herrajes" value={`x${item.hardwareMultiplier.toFixed(2)}`} />
                <CatalogMetric label="Mano de obra" value={`x${item.laborMultiplier.toFixed(2)}`} />
              </CardContent>
            </Card>
          ))}
        </div>
      </CatalogSection>

      <div className="grid gap-8 xl:grid-cols-2">
        <CatalogSection
          icon={<Palette />}
          title="Colores"
          description="Recargos por terminación y costo fijo por metro cuadrado."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Recargo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colorOptions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description}</TableCell>
                  <TableCell className="text-right">
                    {percentage(item.materialMultiplier - 1)} + {currency(item.fixedCostPerM2)}/m2
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CatalogSection>

        <CatalogSection
          icon={<ShieldCheck />}
          title="Vidrios e impuestos"
          description="Costos de vidrio y perfiles fiscales disponibles."
        >
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vidrio</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">ARS/m2</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {glassOptions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.description}</TableCell>
                    <TableCell className="text-right">{currency(item.costPerM2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="grid gap-3 sm:grid-cols-2">
              {taxProfiles.map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-slate-950/25 p-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CatalogSection>
      </div>

      <CatalogSection
        icon={<Truck />}
        title="Envío"
        description="Costos logísticos simples para AMBA, Córdoba Capital y ciudades cercanas."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {shippingZones.map((item) => (
            <Card key={item.id} className="bg-slate-950/30">
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <CatalogMetric label="Base" value={currency(item.baseCost)} />
                <CatalogMetric label="Adicional por unidad" value={currency(item.costPerUnit)} />
              </CardContent>
            </Card>
          ))}
        </div>
      </CatalogSection>
    </main>
  );
}

function CatalogSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel rounded-2xl p-6">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary [&_svg]:size-5">
          {icon}
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function CatalogMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
