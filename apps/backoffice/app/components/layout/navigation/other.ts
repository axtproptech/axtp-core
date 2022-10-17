import { IconBrandChrome, IconHelp } from "@tabler/icons";
import { NavigationItem } from "@/types/navigationItem";
const icons = { IconBrandChrome, IconHelp };
export const other: NavigationItem = {
  id: "sample-docs-roadmap",
  title: "Sample Page",
  type: "group",
  children: [
    {
      id: "sample-page",
      title: "Sample Page",
      type: "item",
      url: "/sample-page",
      icon: icons.IconBrandChrome,
      breadcrumbs: false,
    },
    {
      id: "documentation",
      title: "Documentation",
      type: "item",
      url: "https://codedthemes.gitbook.io/berry/",
      icon: icons.IconHelp,
      external: true,
      target: true,
    },
  ],
};
