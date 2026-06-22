import { useCallback, useState } from "react"
import { Download, FileText, Pencil, Plus, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Document } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { useI18n } from "@/contexts/I18nContext"
import { documentSchema } from "@/lib/validation"
import { deleteDocument, getDocuments, saveDocument } from "@/lib/storage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export function Documents() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [docs, setDocs] = useState<Document[]>(() =>
    user ? getDocuments(user.id) : []
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [preview, setPreview] = useState<Document | null>(null)
  const [editing, setEditing] = useState<Document | null>(null)
  const [form, setForm] = useState({
    type: "cv" as "cv" | "cover-letter",
    title: "",
    content: "",
    tags: "",
    isPrimary: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const refresh = useCallback(() => {
    if (user) setDocs(getDocuments(user.id))
  }, [user])

  const openNew = () => {
    setEditing(null)
    setForm({ type: "cv", title: "", content: "", tags: "", isPrimary: false })
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (doc: Document) => {
    setEditing(doc)
    setForm({
      type: doc.type,
      title: doc.title,
      content: doc.content,
      tags: doc.tags.join(", "),
      isPrimary: doc.isPrimary,
    })
    setErrors({})
    setDialogOpen(true)
  }

  const handleSave = () => {
    const parsed = documentSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0]?.toString() ?? "form"] = i.message
      })
      setErrors(fieldErrors)
      return
    }
    if (!user) return

    const now = new Date().toISOString()
    const doc: Document = {
      id: editing?.id ?? crypto.randomUUID(),
      userId: user.id,
      type: parsed.data.type,
      title: parsed.data.title,
      content: parsed.data.content,
      tags: parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isPrimary: parsed.data.isPrimary,
      createdAt: editing?.createdAt ?? now,
      updatedAt: now,
    }
    saveDocument(doc)
    refresh()
    setDialogOpen(false)
    toast.success(editing ? t("documents.updated") : t("documents.created"))
  }

  const handleDelete = (id: string) => {
    deleteDocument(id)
    refresh()
    toast.success(t("documents.deleted"))
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(docs, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "applypilot-documents.json"
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t("documents.exported"))
  }

  const docTypeLabel = (type: Document["type"]) =>
    type === "cv" ? t("documents.cv") : t("documents.coverLetter")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("documents.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("documents.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 size-4" /> {t("documents.exportJson")}
          </Button>
          <Button onClick={openNew}>
            <Plus className="mr-2 size-4" /> {t("documents.add")}
          </Button>
        </div>
      </div>

      {docs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 text-muted-foreground">{t("documents.empty")}</p>
            <Button className="mt-4" onClick={openNew}>{t("documents.createFirst")}</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <Card key={doc.id} className="hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {doc.title}
                      {doc.isPrimary && <Star className="size-3.5 fill-amber-400 text-amber-400" />}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">{docTypeLabel(doc.type)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-3 text-sm text-muted-foreground">{doc.content}</p>
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                  </div>
                )}
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setPreview(doc)}>{t("common.preview")}</Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(doc)}><Pencil className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="size-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? t("documents.edit") : t("documents.new")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t("documents.type")}</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "cv" | "cover-letter" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cv">{t("documents.cv")}</SelectItem>
                  <SelectItem value="cover-letter">{t("documents.coverLetter")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("documents.docTitle")}</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("documents.content")}</Label>
              <Textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              {errors.content && <p className="text-xs text-destructive">{errors.content}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("documents.tags")}</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            {form.type === "cv" && (
              <div className="flex items-center gap-2">
                <Checkbox checked={form.isPrimary} onCheckedChange={(c) => setForm({ ...form, isPrimary: c === true })} id="primary" />
                <Label htmlFor="primary">{t("documents.primaryCv")}</Label>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("common.cancel")}</Button>
              <Button onClick={handleSave}>{t("common.save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap text-sm font-sans">{preview?.content}</pre>
        </DialogContent>
      </Dialog>
    </div>
  )
}