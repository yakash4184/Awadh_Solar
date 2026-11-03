import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
export default defineConfig([...nextVitals, {rules:{'@next/next/no-img-element':'off','@next/next/no-html-link-for-pages':'off','react-hooks/set-state-in-effect':'off','react-hooks/purity':'off','react-hooks/refs':'off','react/no-unescaped-entities':'off'}}, globalIgnores(['.next/**','node_modules/**'])])
