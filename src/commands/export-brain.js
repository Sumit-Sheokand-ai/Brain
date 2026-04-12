import AdmZip from 'adm-zip'
import { homedir } from 'os'
import { join } from 'path'

const BRAIN_DIR = process.env.BRAIN_DIR || join(homedir(), '.claude', 'brain')

export function cmdExport() {
  const zip = new AdmZip()
  zip.addLocalFolder(BRAIN_DIR, 'brain')
  const out = join(homedir(), `brain-export-${Date.now()}.zip`)
  zip.writeZip(out)
  console.log(`✓ Brain exported to: ${out}`)
}
