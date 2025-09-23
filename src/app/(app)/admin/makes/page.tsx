"use client"

import { useEffect, useState } from "react"
import { makeColumns } from "./columns"
import { MakeTable } from "./MakeTable"
import { MakeItemListDTO } from "@/types/AdminDashboardDTO"
import { useAuthStore } from "@/stores/authStore"
import { useApiClient } from "@/hooks/useApiClient"
import { toast } from "sonner"
import Loading from "@/components/ui/Loading"

export default function MakePage() {
  const [makeData, setMakeData] = useState<MakeItemListDTO[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { apiCall } = useApiClient()
  const { isInitialized } = useAuthStore()

  const fetchMakes = async() => {
    try {
      setLoading(true)

      const res = await apiCall("/api/admin/makes")
      if(!res.ok) throw new Error(`Failed to fetch makes: ${res.status}`)

      const data = await res.json()
      setMakeData(data.data)
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true)
    if(!isInitialized) {
      setLoading(false)
      return
    }

    fetchMakes()
  }, [isInitialized])


  const handleMakeDelete = async(id: string) => {
    try {
      setLoading(true)

      const res = await apiCall(`/api/admin/makes/${id}`, {
        method: "DELETE"
      })
      if(!res.ok) throw new Error(`Failed to delete make: ${res.status}`)
      
      toast("Make deleted!")
      await fetchMakes()
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading variant="spinner" />;
  }

  return(
    <section className="w-full h-full flex justify-center items-center">
      <div className="w-[95%] h-full">
        <MakeTable columns={makeColumns(handleMakeDelete)} data={makeData} fetchMakes={fetchMakes}/>
      </div>
    </section>
  )
}