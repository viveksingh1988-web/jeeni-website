"use client";

import { useCMS } from "./edit-context";
import { Children, type ReactNode } from "react";
import type { Locator } from "@/lib/cms/mutate";

type ScalarBind = { id: string };
type ItemBind = { bind: { loc: Locator; itemId: string; field: string } };

type Props = (ScalarBind | ItemBind) & {
  children: ReactNode;
  className?: string;
  /** Rendered element. Use "div"/"p" for block text, default inline "span". */
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

/* Inline-editable text. Binds to either a scalar (`id`) or a collection item
   field (`bind`). Outside edit mode it renders the resolved value (or the
   default children). In edit mode the element becomes contentEditable and
   commits to the draft on blur — edits appear live, on the page, instantly. */
export function Editable(props: Props) {
  const { children, className, as = "span" } = props;
  const cms = useCMS();

  const defaultText =
    typeof children === "string"
      ? children
      : Children.toArray(children)
          .filter((c) => typeof c === "string")
          .join("");

  // Resolve the current value for the active doc.
  let value = defaultText;
  if (cms) {
    if ("id" in props) {
      value = cms.getScalar(props.id, defaultText);
    } else {
      const { loc, itemId, field } = props.bind;
      const collId = loc.kind === "top" ? loc.id : loc.parentId;
      const coll = cms.doc.collections[collId];
      const stored =
        loc.kind === "top"
          ? coll?.items?.[itemId]?.fields?.[field]
          : coll?.items?.[loc.itemId]?.children?.[loc.childKey]?.items?.[itemId]
              ?.fields?.[field];
      value = stored ?? defaultText;
    }
  }

  const Tag = as;

  function commit(text: string) {
    if (!cms || text === value) return;
    if ("id" in props) cms.setScalar(props.id, text);
    else cms.setItemField(props.bind.loc, props.bind.itemId, props.bind.field, text);
  }

  if (!cms?.editMode) {
    const content = cms ? value : children;
    return <Tag className={className}>{content}</Tag>;
  }

  return (
    <Tag
      className={`${className ?? ""} cms-editable`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      // When this sits inside a link/button, stop the click from navigating so
      // the caret lands in the text instead.
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onBlur={(e) => commit(e.currentTarget.textContent ?? "")}
    >
      {value}
    </Tag>
  );
}
