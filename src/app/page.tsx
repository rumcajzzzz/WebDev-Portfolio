import { supabase } from "@/lib/supabaseClient"
import { Project } from "@/lib/types"

import HeroSection from "@/components/HeroSection"
import AboutSection from "./components/AboutSection"
import WorkflowSection from "./components/WorkFlowSection"
import ProjectsSection from "./components/ProjectsSection"
import ContactSection from "./components/ContactSection"

export const revalidate = 3600

export default async function Home() {
  const { data, error } = await supabase
    .from<'projects', Project>('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) console.error('Supabase projects fetch failed:', error.message)
  const projects: Project[] = data ?? []

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <WorkflowSection />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </main>
  )
}
