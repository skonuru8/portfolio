import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export async function loadSystemMdx(slug: string) {
  const file = path.join(process.cwd(), "content/systems", `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  return MDXRemote({ source, components: mdxComponents });
}

export async function loadProjectMdx(slug: string) {
  const file = path.join(process.cwd(), "content/projects", `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  return MDXRemote({ source, components: mdxComponents });
}
