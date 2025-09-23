import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/Loading"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MakeInput } from "@/lib/validations"
import { useState } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { toast } from "sonner"

interface MakeDialogProps {
  onSuccess: () => void
}

export function MakeDialog( {onSuccess}: MakeDialogProps ) {
  const [form, setForm] = useState<MakeInput>({name: "", slug: ""})
  const [loading, setLoading] = useState<boolean>(false)

  const { apiCall} = useApiClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await apiCall("/api/admin/makes", {
        method: "POST",
        body: JSON.stringify(form),
      })

      if(!res.ok) throw new Error(`Failed to create make: ${res.status}`)

      toast("Make created!")
      onSuccess()
    } catch (e) {
      if(e instanceof Error) {
        toast(e.message)
      } else {
        toast("Unknown error occurred!")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Make</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Add Make</DialogTitle>
            <DialogDescription>
              Create a bew Make here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" onChange={handleChange}/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" onChange={handleChange}/>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="w-24">
              {loading ? <LoadingSpinner size="sm" /> : "Add Make"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
