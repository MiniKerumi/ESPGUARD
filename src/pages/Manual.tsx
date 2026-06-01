import { Link } from "react-router-dom";
import { ArrowLeft, Bluetooth, Shield, Settings, AlertTriangle, Nfc, Radio, Cloud, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-muted-foreground">{children}</CardContent>
  </Card>
);

const Manual = () => {
  return (
    <div className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ESPGUARD User Manual</h1>
            <p className="text-sm text-muted-foreground">Everything you need to operate the system</p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        </div>

        {/* Quick Start */}
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1.</strong> Power on the ESP32-C6 device (ESPGUARD-Server).</p>
            <p><strong>2.</strong> Open the app and tap <em>Connect to ESP32</em>.</p>
            <p><strong>3.</strong> Tap an authorized NFC card to toggle Maintenance Mode.</p>
            <p><strong>4.</strong> When armed (NORMAL), motion triggers the ALARM.</p>
            <p><strong>5.</strong> Tap the authorized NFC card again to stop the alarm.</p>
          </CardContent>
        </Card>

        {/* System States */}
        <Section icon={Shield} title="System States">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-3">
              <Badge className="mb-2 bg-status-active text-foreground">NORMAL</Badge>
              <p>Armed. Motion sensor active. Awaiting events.</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <Badge variant="secondary" className="mb-2">MAINT</Badge>
              <p>Maintenance. Alarm disabled, safe to move around.</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <Badge variant="destructive" className="mb-2">ALARM</Badge>
              <p>Intruder detected. Buzzer + app alert until NFC scan.</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <Badge variant="destructive" className="mb-2">UNAUTH</Badge>
              <p>Unrecognized NFC card scanned. Access denied.</p>
            </div>
          </div>
        </Section>

        {/* Connecting */}
        <Section icon={Bluetooth} title="Connecting via Bluetooth">
          <p>The app uses BLE to talk to the ESP32-C6. Make sure Bluetooth and Location permissions are enabled on your phone.</p>
          <ol className="ml-4 list-decimal space-y-1">
            <li>Open the app on the home screen.</li>
            <li>Tap <em>Connect to ESP32</em>.</li>
            <li>Choose <strong>ESPGUARD-Server</strong> from the device picker.</li>
            <li>Once connected, the status changes to <em>Connected</em> and notifications start streaming.</li>
          </ol>
          <p className="text-xs">Multiple phones can connect at the same time — each receives live state updates.</p>
        </Section>

        {/* NFC */}
        <Section icon={Nfc} title="Using NFC Cards">
          <p>All arming/disarming is done physically with NFC — there is no manual disarm button.</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Authorized tap:</strong> toggles between NORMAL ↔ MAINT, or silences an active ALARM.</li>
            <li><strong>Unauthorized tap:</strong> logged as UNAUTH event, access denied.</li>
          </ul>
          <p>Manage which UIDs are authorized from the <Link to="/admin" className="text-primary underline">Admin → Authorized NFC</Link> panel.</p>
        </Section>

        {/* Alarm */}
        <Section icon={AlertTriangle} title="Alarm Behavior">
          <p>When the ultrasonic sensor detects movement while armed, the system enters ALARM:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>On-device buzzer sounds.</li>
            <li>App plays an audible alert and shows a red banner.</li>
            <li>Alarm only stops when an authorized NFC card is scanned on the device.</li>
          </ul>
        </Section>

        {/* Admin */}
        <Section icon={Settings} title="Admin Dashboard">
          <p>Access via the <Link to="/admin" className="text-primary underline">Admin</Link> link on the home screen.</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Authorized NFC:</strong> Add, block, or activate cards. Changes auto-sync to the device over BLE.</li>
            <li><strong>Logs:</strong> View every event (ACCESS, ALARM, UNAUTH) with UID and timestamp.</li>
            <li><strong>Reports:</strong> Export logs as CSV or generate a detailed report.</li>
          </ul>
        </Section>

        {/* Cloud Sync */}
        <Section icon={Cloud} title="Cloud Sync & Offline Mode">
          <p>Events are logged to Lovable Cloud in real time when you have internet.</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Offline:</strong> Events are queued locally on your phone.</li>
            <li><strong>Reconnect:</strong> Queued events flush automatically when internet returns.</li>
            <li><strong>NFC whitelist:</strong> Changes made in the cloud sync to the device next time it connects via BLE.</li>
          </ul>
        </Section>

        {/* Hardware */}
        <Section icon={Radio} title="Hardware Overview">
          <p>The device runs on an ESP32-C6 mini with:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>MFRC522 NFC reader (SPI)</li>
            <li>HC-SR04 ultrasonic motion sensor</li>
            <li>Buzzer + status LED</li>
            <li>BLE service: <code className="text-xs">ESPGUARD-Server</code></li>
          </ul>
        </Section>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="t1">
                <AccordionTrigger>Device not showing up when scanning</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Make sure the ESP32 is powered, Bluetooth is on, and Location permission is granted. Restart the device if needed.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t2">
                <AccordionTrigger>NFC card not recognized</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Add the UID in Admin → Authorized NFC, set status to ACTIVE, then tap <em>Sync to Device</em> while connected.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t3">
                <AccordionTrigger>Logs not appearing in Admin</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Check your internet connection. Offline events will sync automatically once you reconnect.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t4">
                <AccordionTrigger>Alarm won't stop</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  The alarm only stops via authorized NFC scan on the device. There is no manual disarm — this is intentional for security.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <p className="pt-4 text-center text-xs text-muted-foreground">ESPGUARD Security Monitor · v1.0</p>
      </div>
    </div>
  );
};

export default Manual;
