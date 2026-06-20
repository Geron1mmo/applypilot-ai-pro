import { copyFileSync } from "fs"
import { join } from "path"

const dist = "dist"
copyFileSync(join(dist, "index.html"), join(dist, "404.html"))