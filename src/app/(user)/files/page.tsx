import { getFiles } from "@/app/actions/drive";
import { FileResultCard } from "@/components/FileResultCard";
import { SearchFiles } from "@/components/SearchFiles";

export default async function FilesPage() {
  const files = await getFiles(500);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Files</h1>
        <p className="text-muted-foreground mt-1 text-sm">{files.length} total</p>
      </header>

      <SearchFiles initialFiles={files} />
    </div>
  );
}
