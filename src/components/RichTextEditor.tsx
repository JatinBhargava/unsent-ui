import { useEffect, useRef, useState } from "react";
import {
  FONT_OPTIONS,
  DEFAULT_FONT_ID,
  buildRichContent,
  parseRichContent,
  isRichContent,
} from "../utils/richContent";

const WRITE_FONT_STORAGE_KEY = "unsent:writeFont";

interface RichTextEditorProps {
  initialContent: string;
  placeholder?: string;
  onChange: (value: { html: string; text: string }) => void;
  minHeightClassName?: string;
}

export default function RichTextEditor({
  initialContent,
  placeholder = "Start writing here…",
  onChange,
  minHeightClassName = "min-h-[21rem]",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [font, setFont] = useState<string>(
    () => localStorage.getItem(WRITE_FONT_STORAGE_KEY) || DEFAULT_FONT_ID,
  );
  const [isEmpty, setIsEmpty] = useState(!initialContent);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (isRichContent(initialContent)) {
      const { innerHtml, fontId } = parseRichContent(initialContent);
      editor.innerHTML = innerHtml;
      setFont(fontId);
    } else {
      editor.innerText = initialContent;
    }
    setIsEmpty(editor.innerText.trim().length === 0);
    // Only hydrate once, on mount — after that the editor is uncontrolled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(WRITE_FONT_STORAGE_KEY, font);
  }, [font]);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;
    setIsEmpty(editor.innerText.trim().length === 0);
    onChange({ html: buildRichContent(editor.innerHTML, font), text: editor.innerText });
  };

  const handleFontChange = (nextFont: string) => {
    setFont(nextFont);
    const editor = editorRef.current;
    if (!editor) return;
    onChange({ html: buildRichContent(editor.innerHTML, nextFont), text: editor.innerText });
  };

  // extractContents() yields zero-length text nodes for empty ranges, so a bare
  // childNodes.length check would resurrect them as empty <b>/<i>/<u> tags.
  const hasContent = (node: Node): boolean =>
    Array.from(node.childNodes).some(
      (n) => n.nodeType === Node.ELEMENT_NODE || (n.textContent?.length ?? 0) > 0,
    );

  const findAncestorTag = (node: Node, tag: string, stopAt: Node): HTMLElement | null => {
    let el: Element | null = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
    while (el && el !== stopAt) {
      if (el.tagName.toLowerCase() === tag) return el as HTMLElement;
      el = el.parentElement;
    }
    return null;
  };

  const applyFormat = (tag: "b" | "i" | "u") => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed || !editor.contains(range.commonAncestorContainer)) return;

    const wrapper = findAncestorTag(range.commonAncestorContainer, tag, editor);

    if (wrapper) {
      // Selection sits inside an existing tag — toggle it off for just the
      // selected portion, splitting the tag around it.
      const afterRange = document.createRange();
      afterRange.setStart(range.endContainer, range.endOffset);
      afterRange.setEnd(wrapper, wrapper.childNodes.length);
      const afterFragment = afterRange.extractContents();

      const selectedFragment = range.extractContents();
      const selectedNodes = Array.from(selectedFragment.childNodes);

      const parent = wrapper.parentNode;
      if (!parent) return;
      const referenceNode = wrapper.nextSibling;

      parent.insertBefore(selectedFragment, referenceNode);

      if (hasContent(afterFragment)) {
        const afterWrapper = document.createElement(tag);
        afterWrapper.appendChild(afterFragment);
        parent.insertBefore(afterWrapper, referenceNode);
      }

      if (!hasContent(wrapper)) {
        wrapper.remove();
      }

      if (selectedNodes.length > 0) {
        const newRange = document.createRange();
        newRange.setStartBefore(selectedNodes[0]);
        newRange.setEndAfter(selectedNodes[selectedNodes.length - 1]);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      const el = document.createElement(tag);
      try {
        range.surroundContents(el);
      } catch {
        el.appendChild(range.extractContents());
        range.insertNode(el);
      }

      const newRange = document.createRange();
      newRange.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    emitChange();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
    emitChange();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          {(
            [
              { label: "B", title: "Bold", tag: "b", className: "font-bold" },
              { label: "I", title: "Italic", tag: "i", className: "italic" },
              { label: "U", title: "Underline", tag: "u", className: "underline" },
            ] as const
          ).map((btn) => (
            <button
              key={btn.label}
              type="button"
              title={btn.title}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat(btn.tag)}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${btn.className}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <select
          value={font}
          onChange={(e) => handleFontChange(e.target.value)}
          title="Font"
          className="rounded-md border-0 bg-transparent py-1 text-xs text-gray-500 hover:text-gray-800 focus:outline-none cursor-pointer"
        >
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        {isEmpty && (
          <p className="pointer-events-none absolute inset-0 text-sm sm:text-base text-gray-300 leading-relaxed">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onPaste={handlePaste}
          style={{
            fontFamily: FONT_OPTIONS.find((o) => o.id === font)?.fontFamily,
          }}
          className={`w-full ${minHeightClassName} bg-transparent border-0 text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap focus:outline-none`}
        />
      </div>
    </div>
  );
}
