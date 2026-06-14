import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Globe, Terminal, Code2, AlertCircle, Copy, Check, Info } from "lucide-react";
import { getApiKey } from "@/app/actions/settings";
import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function ApiDocsPage() {
  const apiKey = await getApiKey() || "2328a4b69080a0475f1dfac6e00437e9";

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          API Documentation
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Use the API to generate download links for Google Drive files programmatically.
        </p>
      </header>

      {/* API Key Section */}
      <section id="api-key" className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Key className="w-5 h-5 text-primary" />
          <h2>Authentication</h2>
        </div>
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-primary">Your API Key</CardTitle>
            <CardDescription>Use this key to authenticate your requests. Never share it publicly.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 bg-background/50 border border-primary/20 rounded-xl p-4 group transition-all hover:border-primary/40">
              <code className="text-lg font-mono font-bold text-primary flex-1 truncate">{apiKey}</code>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2 py-1">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* GET Endpoint */}
        <section id="get-endpoint" className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Globe className="w-5 h-5 text-success" />
            <h2>GET Endpoint</h2>
          </div>
          <Card className="glass-card">
            <CardHeader>
              <CardDescription>Generate a download link via URL parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs break-all border border-border">
                <span className="text-success font-bold">GET</span> http://new.drivecloud.cc/api/v1/{"{"}api_key{"}"}/{"{"}drive_id{"}"}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border/50">
                    <th className="pb-2 font-medium">Parameter</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Required</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 font-mono text-xs text-foreground">api_key</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs text-foreground">drive_id</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Yes</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* POST Endpoint */}
        <section id="post-endpoint" className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Globe className="w-5 h-5 text-primary" />
            <h2>POST Endpoint</h2>
          </div>
          <Card className="glass-card">
            <CardHeader>
              <CardDescription>JSON payload with Bearer authentication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs break-all border border-border">
                <span className="text-primary font-bold">POST</span> http://new.drivecloud.cc/api/v2/post
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Headers</p>
                <div className="bg-muted/30 rounded-md p-2 text-xs font-mono space-y-1">
                  <div>Authorization: Bearer YOUR_API_KEY</div>
                  <div>Content-Type: application/json</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Success/Error Responses */}
      <section id="responses" className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Terminal className="w-5 h-5 text-primary" />
          <h2>Response Schema</h2>
        </div>
        <Tabs defaultValue="success" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs bg-muted/50">
            <TabsTrigger value="success">Success</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>
          <TabsContent value="success">
            <pre className="bg-black/90 text-success/90 p-6 rounded-2xl border border-success/20 font-mono text-sm overflow-x-auto shadow-2xl">
{`{
  "success": true,
  "message": "Link generation successful",
  "data": {
    "token": "unique_token_string",
    "download_url": "http://new.drivecloud.cc/file/unique_token_string",
    "filename": "example_file.pdf",
    "filesize": "2.5 MB",
    "status": "ready"
  }
}`}
            </pre>
          </TabsContent>
          <TabsContent value="error">
            <pre className="bg-black/90 text-destructive/90 p-6 rounded-2xl border border-destructive/20 font-mono text-sm overflow-x-auto shadow-2xl">
{`{
  "success": false,
  "message": "Error description"
}`}
            </pre>
          </TabsContent>
        </Tabs>
      </section>

      {/* Code Examples */}
      <section id="examples" className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Code2 className="w-5 h-5 text-primary" />
          <h2>Usage Examples</h2>
        </div>
        <Tabs defaultValue="javascript" className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
          </TabsList>
          <TabsContent value="javascript" className="space-y-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Example using Fetch (POST)</p>
              <pre className="bg-muted p-6 rounded-2xl font-mono text-xs overflow-x-auto border border-border">
{`const apiKey = '${apiKey}';
const driveId = 'YOUR_FILE_ID';

fetch('http://new.drivecloud.cc/api/v2/post', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ drive_id: driveId })
})
.then(r => r.json())
.then(data => {
  if (data.success) console.log('Download URL:', data.data.download_url);
  else console.error('Error:', data.message);
})
.catch(console.error);`}
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="curl" className="space-y-4 mt-4">
            <pre className="bg-muted p-6 rounded-2xl font-mono text-xs overflow-x-auto border border-border">
{`# GET Request
curl -X GET "http://new.drivecloud.cc/api/v1/${apiKey}/YOUR_FILE_ID"

# POST Request
curl -X POST "http://new.drivecloud.cc/api/v2/post" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{ "drive_id": "YOUR_FILE_ID" }'`}
            </pre>
          </TabsContent>
          <TabsContent value="php" className="space-y-4 mt-4">
             <pre className="bg-muted p-6 rounded-2xl font-mono text-xs overflow-x-auto border border-border">
{`<?php
$apiKey = '${apiKey}';
$driveId = 'YOUR_FILE_ID';
$url = "http://new.drivecloud.cc/api/v2/post";

$payload = ['drive_id' => $driveId];
$options = [
  'http' => [
    'method'  => 'POST',
    'header'  => "Authorization: Bearer {$apiKey}\\r\\nContent-Type: application/json",
    'content' => json_encode($payload)
  ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);
$result = json_decode($response, true);

if (!empty($result['success'])) {
  echo "Download URL: " . $result['data']['download_url'];
} else {
  echo "Error: " . ($result['message'] ?? 'unknown');
}
?>`}
              </pre>
          </TabsContent>
        </Tabs>
      </section>

      {/* Important Notes */}
      <section className="pt-8">
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 grid place-items-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Important Notes</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Use small delays when generating many links to avoid rate limiting.",
              "Some files may return pending/processing depending on your backend.",
              "Always include correct API key. Invalid key will return auth error.",
              "Check success status in response and handle errors gracefully."
            ].map((note, i) => (
              <div key={i} className="flex gap-3 items-start p-4 bg-background/50 rounded-2xl border border-border/50">
                <Check className="w-4 h-4 text-success shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
