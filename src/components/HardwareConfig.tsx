import { Cpu, Radio, Waves } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface SensorStatus {
  nfcActive: boolean;
  irActive: boolean;
}

interface HardwareConfigProps {
  sensorStatus: SensorStatus;
  isConnected: boolean;
}

const pinData = [
  { component: "MFRC522 (NFC)", pin: "SDA/SS", gpio: "GPIO 5" },
  { component: "MFRC522 (NFC)", pin: "RST", gpio: "GPIO 6" },
  { component: "MFRC522 (NFC)", pin: "SCK", gpio: "GPIO 2" },
  { component: "MFRC522 (NFC)", pin: "MOSI", gpio: "GPIO 3" },
  { component: "MFRC522 (NFC)", pin: "MISO", gpio: "GPIO 4" },
  { component: "HC-SR04 (Ultrasonic)", pin: "TRIG", gpio: "GPIO 8" },
  { component: "HC-SR04 (Ultrasonic)", pin: "ECHO", gpio: "GPIO 9" },
];

export const HardwareConfig = ({ sensorStatus, isConnected }: HardwareConfigProps) => {
  return (
    <div className="space-y-4">
      {/* Sensor Status Indicators */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium">NFC Reader</p>
              <p className="text-xs text-muted-foreground">MFRC522 · 13.56 MHz</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2.5 w-2.5 rounded-full",
                isConnected && sensorStatus.nfcActive
                  ? "bg-status-active animate-pulse"
                  : isConnected
                    ? "bg-status-service"
                    : "bg-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isConnected && sensorStatus.nfcActive
                  ? "text-status-active"
                  : isConnected
                    ? "text-status-service"
                    : "text-muted-foreground"
              )}>
                {isConnected ? (sensorStatus.nfcActive ? "Active" : "Idle") : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Waves className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium">Ultrasonic Sensor</p>
              <p className="text-xs text-muted-foreground">HC-SR04 · Distance</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2.5 w-2.5 rounded-full",
                isConnected && sensorStatus.irActive
                  ? "bg-status-motion animate-pulse"
                  : isConnected
                    ? "bg-status-active"
                    : "bg-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isConnected && sensorStatus.irActive
                  ? "text-status-motion"
                  : isConnected
                    ? "text-status-active"
                    : "text-muted-foreground"
              )}>
                {isConnected ? (sensorStatus.irActive ? "Triggered" : "Clear") : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pin Assignment Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Cpu className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">ESP32-C6 SuperMini · Pin Assignments</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-secondary/30">
              <TableHead className="text-xs text-muted-foreground">Component</TableHead>
              <TableHead className="text-xs text-muted-foreground">Pin</TableHead>
              <TableHead className="text-xs text-muted-foreground">GPIO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pinData.map((row, i) => (
              <TableRow key={i} className="border-border hover:bg-secondary/30">
                <TableCell className="text-sm font-medium">{row.component}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.pin}</TableCell>
                <TableCell>
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs font-mono text-primary">
                    {row.gpio}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
