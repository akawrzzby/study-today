// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import readingTime from "reading-time";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "markdown",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    category: { type: "string", required: true },
    published: { type: "boolean", default: true }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^posts\//, "")
    },
    readingTime: {
      type: "json",
      resolve: (doc) => readingTime(doc.body.raw)
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: true
        }
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["heading-anchor"]
          }
        }
      ]
    ]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-ENQ2F25I.mjs.map
